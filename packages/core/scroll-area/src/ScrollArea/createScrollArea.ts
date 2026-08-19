import { type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import type {
  ScrollAreaCore,
  ScrollAreaMetrics,
  ScrollAreaOptions,
  ScrollAreaOrientation,
  ScrollAreaType,
  ScrollAxisMetrics,
} from "./types";

// Roblox instance defaults are themselves a look. Neutralize only those; adapters spread them
// before consumer props so they stay overridable.
const FRAME_NEUTRAL: Partial<WritableInstanceProperties<Frame>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
};

const VIEWPORT_NEUTRAL: Partial<WritableInstanceProperties<ScrollingFrame>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  // The scrollbars are the primitive's own parts, so the engine's are turned off rather than left
  // to render on top of them.
  ScrollBarImageTransparency: 1,
  ScrollBarThickness: 0,
};

const DEFAULT_HIDE_DELAY_MS = 600;
// A single pixel of slack, so a viewport that measures a hair under its content does not flicker a
// scrollbar into existence.
const OVERFLOW_EPSILON = 1;

function createAxisMetrics(): ScrollAxisMetrics {
  return { viewportSize: 0, contentSize: 0, scrollPosition: 0 };
}

function areAxisMetricsEqual(left: ScrollAxisMetrics, right: ScrollAxisMetrics) {
  return (
    left.viewportSize === right.viewportSize &&
    left.contentSize === right.contentSize &&
    left.scrollPosition === right.scrollPosition
  );
}

function areMetricsEqual(left: ScrollAreaMetrics, right: ScrollAreaMetrics) {
  return areAxisMetricsEqual(left.vertical, right.vertical) && areAxisMetricsEqual(left.horizontal, right.horizontal);
}

/** Scroll area behavior, free of any UI framework: measurement, scrollbar visibility, scrolling. */
export function createScrollArea(rx: Reactivity, options: ScrollAreaOptions = {}): ScrollAreaCore {
  function scrollType(): ScrollAreaType {
    return read(options.type ?? "auto") ?? "auto";
  }

  function scrollHideDelayMs() {
    return math.max(0, read(options.scrollHideDelayMs ?? DEFAULT_HIDE_DELAY_MS) ?? DEFAULT_HIDE_DELAY_MS);
  }

  const metricsSource = rx.source<ScrollAreaMetrics>({
    vertical: createAxisMetrics(),
    horizontal: createAxisMetrics(),
  });
  // Only `type="scroll"` hides on idle; the other modes leave this true.
  const activeSource = rx.source(scrollType() !== "scroll");

  let viewport: ScrollingFrame | undefined;
  let activitySequence = 0;
  let hideTask: thread | undefined;

  function cancelHideTask() {
    if (hideTask === undefined) {
      return;
    }

    const pending = hideTask;
    hideTask = undefined;
    pcall(() => {
      task.cancel(pending);
    });
  }

  function notifyScrollActivity() {
    if (scrollType() !== "scroll") {
      // Nothing to reveal: the scrollbars are already governed by overflow alone.
      activeSource.set(true);
      return;
    }

    activitySequence += 1;
    const sequence = activitySequence;
    activeSource.set(true);
    cancelHideTask();

    hideTask = task.delay(scrollHideDelayMs() / 1000, () => {
      hideTask = undefined;

      if (sequence !== activitySequence) {
        return;
      }

      activeSource.set(false);
    });
  }

  function axis(orientation: ScrollAreaOrientation) {
    const current = metricsSource.get();
    return orientation === "vertical" ? current.vertical : current.horizontal;
  }

  function hasOverflow(orientation: ScrollAreaOrientation) {
    const current = axis(orientation);
    return current.contentSize > current.viewportSize + OVERFLOW_EPSILON;
  }

  rx.cleanup(cancelHideTask);

  return {
    type: scrollType,
    scrollHideDelayMs,
    metrics: () => metricsSource.get(),
    axis,
    // Bailing out on unchanged metrics is not an optimization: measurement signals fire repeatedly
    // with identical values, and a fresh object each time re-renders the tree that measures, which
    // measures again.
    setMetrics: (nextMetrics) => {
      if (!areMetricsEqual(metricsSource.get(), nextMetrics)) {
        metricsSource.set(nextMetrics);
      }
    },
    setViewport: (instance) => {
      viewport = instance;
    },
    getViewport: () => viewport,
    setScrollPosition: (orientation, position) => {
      const target = viewport;
      if (target === undefined) {
        return;
      }

      const current = axis(orientation);
      const maxScroll = math.max(0, current.contentSize - current.viewportSize);
      const nextPosition = math.clamp(position, 0, maxScroll);

      target.CanvasPosition =
        orientation === "vertical"
          ? new Vector2(target.CanvasPosition.X, nextPosition)
          : new Vector2(nextPosition, target.CanvasPosition.Y);

      notifyScrollActivity();
    },
    notifyScrollActivity,
    showScrollbar: (orientation) => {
      if (!hasOverflow(orientation)) {
        return false;
      }

      return scrollType() === "scroll" ? activeSource.get() : true;
    },
    viewportSpec: (): ElementSpec<ScrollingFrame> => ({ neutral: VIEWPORT_NEUTRAL }),
    scrollbarSpec: (orientation): ElementSpec<Frame> => ({
      neutral: FRAME_NEUTRAL,
      props: { Visible: () => (hasOverflow(orientation) ? scrollType() !== "scroll" || activeSource.get() : false) },
    }),
    cornerSpec: () => ({ neutral: FRAME_NEUTRAL }),
  };
}
