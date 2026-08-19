import { type Derivable, type Reactivity, read } from "@lattice-ui/core-runtime";
import { computePopper } from "./compute";
import { subscribeAnchor, subscribeContent, subscribeViewport } from "./observers";
import { normalizePopperPositioningOptions } from "./options";
import type { ComputePopperResult, NormalizedPopperPositioningOptions, PopperPlacement } from "./types";
import { getViewportRect } from "./viewport";

const RunService = game.GetService("RunService");
const ZERO_VECTOR2 = new Vector2(0, 0);

export interface PopperOptions {
  /**
   * The instances to measure.
   *
   * Getters rather than refs: a ref is a framework's shape, and both layers already hold the
   * instance somewhere of their own — a React ref object, a Vide source, or a plain upvalue.
   */
  getAnchor: () => GuiObject | undefined;
  getContent: () => GuiObject | undefined;
  enabled?: Derivable<boolean | undefined>;
  placement?: Derivable<PopperPlacement | undefined>;
  sideOffset?: Derivable<number | undefined>;
  alignOffset?: Derivable<number | undefined>;
  collisionPadding?: Derivable<number | undefined>;
}

export interface PopperCore {
  position: () => UDim2;
  anchorPoint: () => Vector2;
  placement: () => PopperPlacement;
  contentSize: () => Vector2;
  /** True once the content has a measured size, so placement reflects real geometry. */
  isPositioned: () => boolean;
  /** Recomputes now from the current options and measurements. */
  update: () => void;
  /**
   * Re-reads the options, re-attaches observers if the instances changed, and recomputes if
   * anything moved.
   *
   * The Heartbeat calls this on its own; adapters call it when they already know an input changed,
   * so the new placement lands in the same commit rather than a frame later. Positioning options
   * arrive as plain values from React, which no source can notify about.
   */
  sync: () => void;
  /**
   * Begins observing the anchor, the content and the viewport. Idempotent, and torn down through
   * the reactivity's cleanup — so calling it twice (Vide strict mode runs a component body twice)
   * connects nothing twice.
   */
  start: () => void;
}

function areVector2Equal(a: Vector2, b: Vector2) {
  return a.X === b.X && a.Y === b.Y;
}

function hasMeasuredContentSize(contentSize: Vector2) {
  return contentSize.X > 0 || contentSize.Y > 0;
}

function arePositioningEqual(a: NormalizedPopperPositioningOptions, b: NormalizedPopperPositioningOptions) {
  return (
    a.placement === b.placement &&
    a.sideOffset === b.sideOffset &&
    a.alignOffset === b.alignOffset &&
    a.collisionPadding === b.collisionPadding
  );
}

function areResultsEqual(a: ComputePopperResult, b: ComputePopperResult) {
  return (
    a.placement === b.placement &&
    a.anchorPoint.X === b.anchorPoint.X &&
    a.anchorPoint.Y === b.anchorPoint.Y &&
    a.position.X.Scale === b.position.X.Scale &&
    a.position.X.Offset === b.position.X.Offset &&
    a.position.Y.Scale === b.position.Y.Scale &&
    a.position.Y.Offset === b.position.Y.Offset
  );
}

/**
 * Anchored positioning, free of any UI framework.
 *
 * This is the piece of Lattice UI that is least like a state machine: it measures real instances,
 * listens to Roblox signals, and recomputes on a Heartbeat. None of that needs a framework — what it
 * needed was somewhere to put the result, which is what the injected reactivity provides.
 */
export function createPopper(rx: Reactivity, options: PopperOptions): PopperCore {
  function normalized() {
    return normalizePopperPositioningOptions({
      placement: read(options.placement ?? undefined),
      sideOffset: read(options.sideOffset ?? undefined),
      alignOffset: read(options.alignOffset ?? undefined),
      collisionPadding: read(options.collisionPadding ?? undefined),
    });
  }

  function isEnabled() {
    return read(options.enabled ?? true) !== false;
  }

  const resultSource = rx.source<ComputePopperResult>({
    anchorPoint: ZERO_VECTOR2,
    placement: normalized().placement,
    position: UDim2.fromOffset(0, 0),
  });
  const contentSizeSource = rx.source<Vector2>(ZERO_VECTOR2);
  const isPositionedSource = rx.source(false);

  function setContentSize(nextSize: Vector2) {
    if (!areVector2Equal(contentSizeSource.get(), nextSize)) {
      contentSizeSource.set(nextSize);
    }
  }

  function setResult(nextResult: ComputePopperResult) {
    if (!areResultsEqual(resultSource.get(), nextResult)) {
      resultSource.set(nextResult);
    }
  }

  function update() {
    if (!isEnabled()) {
      return;
    }

    const anchor = options.getAnchor();
    const content = options.getContent();

    if (anchor === undefined) {
      setContentSize(ZERO_VECTOR2);
      isPositionedSource.set(false);
      return;
    }

    const positioning = normalized();

    if (content === undefined) {
      setContentSize(ZERO_VECTOR2);
      setResult(
        computePopper({
          anchorPosition: anchor.AbsolutePosition,
          anchorSize: anchor.AbsoluteSize,
          contentSize: ZERO_VECTOR2,
          alignOffset: positioning.alignOffset,
          collisionPadding: positioning.collisionPadding,
          placement: positioning.placement,
          sideOffset: positioning.sideOffset,
          viewportRect: getViewportRect(anchor),
        }),
      );
      isPositionedSource.set(false);
      return;
    }

    const measuredContentSize = content.AbsoluteSize;
    setContentSize(measuredContentSize);
    setResult(
      computePopper({
        anchorPosition: anchor.AbsolutePosition,
        anchorSize: anchor.AbsoluteSize,
        contentSize: measuredContentSize,
        alignOffset: positioning.alignOffset,
        collisionPadding: positioning.collisionPadding,
        placement: positioning.placement,
        sideOffset: positioning.sideOffset,
        viewportRect: getViewportRect(content),
      }),
    );
    isPositionedSource.set(hasMeasuredContentSize(measuredContentSize));
  }

  let started = false;
  let disconnectAnchor: (() => void) | undefined;
  let disconnectContent: (() => void) | undefined;
  let disconnectViewport: (() => void) | undefined;
  let observedAnchor: GuiObject | undefined;
  let observedContent: GuiObject | undefined;
  let syncConnection: RBXScriptConnection | undefined;
  let wasEnabled = true;
  // Positioning options are read, not subscribed to: a React caller passes plain numbers that change
  // between renders without touching a source. Comparing the normalized options each frame is what
  // makes a changed `sideOffset` recompute, which is otherwise invisible to the observers.
  let observedPositioning: NormalizedPopperPositioningOptions | undefined;

  function detachObservers() {
    disconnectAnchor?.();
    disconnectAnchor = undefined;
    disconnectContent?.();
    disconnectContent = undefined;
    disconnectViewport?.();
    disconnectViewport = undefined;
    observedAnchor = undefined;
    observedContent = undefined;
  }

  function syncObservers() {
    const enabled = isEnabled();

    if (!enabled) {
      // Reset once on the enabled -> disabled edge so a reopened layer measures from scratch rather
      // than flashing at its previous position.
      if (wasEnabled) {
        wasEnabled = false;
        detachObservers();
        setContentSize(ZERO_VECTOR2);
        isPositionedSource.set(false);
      }

      return;
    }

    wasEnabled = true;

    const positioning = normalized();
    if (observedPositioning === undefined || !arePositioningEqual(positioning, observedPositioning)) {
      observedPositioning = positioning;
      update();
    }

    const anchor = options.getAnchor();
    const content = options.getContent();

    if (anchor === undefined || content === undefined) {
      if (observedAnchor !== undefined || observedContent !== undefined) {
        detachObservers();
        update();
      }

      return;
    }

    if (anchor === observedAnchor && content === observedContent) {
      return;
    }

    detachObservers();
    disconnectAnchor = subscribeAnchor(anchor, update);
    disconnectContent = subscribeContent(content, update);
    disconnectViewport = subscribeViewport(content, update);
    observedAnchor = anchor;
    observedContent = content;
    update();
  }

  function start() {
    if (started) {
      return;
    }

    started = true;
    update();
    syncObservers();
    syncConnection = RunService.Heartbeat.Connect(syncObservers);

    rx.cleanup(() => {
      syncConnection?.Disconnect();
      syncConnection = undefined;
      detachObservers();
      started = false;
    });
  }

  return {
    position: () => resultSource.get().position,
    anchorPoint: () => resultSource.get().anchorPoint,
    placement: () => resultSource.get().placement,
    contentSize: () => contentSizeSource.get(),
    isPositioned: () => isPositionedSource.get(),
    update,
    sync: syncObservers,
    start,
  };
}
