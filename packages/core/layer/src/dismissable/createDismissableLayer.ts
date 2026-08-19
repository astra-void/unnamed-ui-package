import type { Reactivity } from "@lattice-ui/core-runtime";
import { DEFAULT_LAYER_IGNORE_GUI_INSET } from "../internals/constants";
import { getGuiInsetTopLeft } from "../internals/env";
import { isOutsidePointerEvent } from "./events";
import { promoteLayer, registerLayer, unregisterLayer } from "./layerStack";
import type { LayerInteractEvent } from "./types";

export interface DismissableLayerOptions {
  initialEnabled?: boolean;
  modal?: boolean;
  disableOutsidePointerEvents?: boolean;
  /** The consumer's real content, when it has one. Hit-tested to decide inside versus outside. */
  getContentBoundary?: () => GuiObject | undefined;
  /** The layer's own full-screen canvas, used as the boundary when the consumer gives none. */
  getFallbackBoundary?: () => GuiObject | undefined;
  /** Instances that count as inside even though they are not in the content, such as a trigger. */
  getInsideRoots?: () => Array<GuiObject | undefined>;
  getPortalContainer: () => BasePlayerGui | undefined;
  onDismiss?: () => void;
  onPointerDownOutside?: (event: LayerInteractEvent) => void;
  onInteractOutside?: (event: LayerInteractEvent) => void;
}

export interface DismissableLayerCore {
  /** See `PresenceCore.setPresent` for why enablement is pushed in rather than polled. */
  setEnabled: (enabled: boolean) => void;
  enabled: () => boolean;
  /** Position in the layer stack, which the adapter turns into a DisplayOrder. */
  stackOrder: () => number;
  /** Whether the layer should render a blocker that swallows pointer input beneath it. */
  blocksOutsidePointer: () => boolean;
  ignoresGuiInset: () => boolean;
  /** Where the content canvas sits, which depends on whether the layer ignores the topbar inset. */
  contentWrapperPosition: () => UDim2;
  /** Registers with the global layer stack. Idempotent; unregisters through the cleanup. */
  start: () => void;
}

/**
 * A dismissable layer's bookkeeping: stack registration, promotion on open, and the outside-pointer
 * test. What it renders — a ScreenGui, a blocker, a canvas — belongs to the adapter.
 */
export function createDismissableLayer(rx: Reactivity, options: DismissableLayerOptions): DismissableLayerCore {
  const ignoresGuiInset = DEFAULT_LAYER_IGNORE_GUI_INSET;
  const insetTopLeft = getGuiInsetTopLeft();
  const stackOrderSource = rx.source(0);

  let enabled = options.initialEnabled === true;
  let registrationId: number | undefined;
  let started = false;

  function isPointerOutside(inputObject: InputObject) {
    const providedBoundary = options.getContentBoundary?.();
    // When the consumer provides a boundary it points at real content; otherwise fall back to the
    // layer's own full-screen canvas, which is hit at every position and must not count as content.
    const usingProvidedBoundary = providedBoundary !== undefined;
    const contentBoundary = usingProvidedBoundary ? providedBoundary : options.getFallbackBoundary?.();

    const container = options.getPortalContainer();
    if (contentBoundary === undefined || container === undefined) {
      return false;
    }

    return isOutsidePointerEvent(inputObject, container, contentBoundary, {
      insideRoots: options.getInsideRoots?.() ?? [],
      layerIgnoresGuiInset: ignoresGuiInset,
      boundaryMatchesSelf: usingProvidedBoundary,
    });
  }

  function start() {
    if (started) {
      return;
    }

    started = true;
    const registration = registerLayer({
      getEnabled: () => enabled,
      isPointerOutside,
      onPointerDownOutside: (event) => options.onPointerDownOutside?.(event),
      onInteractOutside: (event) => options.onInteractOutside?.(event),
      onDismiss: () => options.onDismiss?.(),
    });

    registrationId = registration.id;
    stackOrderSource.set(registration.mountOrder);

    // Registered layers stay mounted with `enabled` following open state, so promote on the closed
    // -> open edge: z-order and dismissal order should follow open order, not mount order.
    if (enabled) {
      promote();
    }

    rx.cleanup(() => {
      if (registrationId !== undefined) {
        unregisterLayer(registrationId);
        registrationId = undefined;
      }

      started = false;
    });
  }

  function promote() {
    if (registrationId === undefined) {
      return;
    }

    const nextOrder = promoteLayer(registrationId);
    if (nextOrder !== undefined) {
      stackOrderSource.set(nextOrder);
    }
  }

  function setEnabled(nextEnabled: boolean) {
    if (nextEnabled === enabled) {
      return;
    }

    enabled = nextEnabled;

    if (nextEnabled) {
      promote();
    }
  }

  return {
    setEnabled,
    enabled: () => enabled,
    stackOrder: () => stackOrderSource.get(),
    blocksOutsidePointer: () => enabled && (options.modal === true || options.disableOutsidePointerEvents === true),
    ignoresGuiInset: () => ignoresGuiInset,
    contentWrapperPosition: () =>
      ignoresGuiInset ? UDim2.fromOffset(insetTopLeft.X, insetTopLeft.Y) : UDim2.fromScale(0, 0),
    start,
  };
}
