import type { Derivable, ElementSpec } from "@lattice-ui/core-runtime";

export type ScrollAreaType = "auto" | "always" | "scroll";
export type ScrollAreaOrientation = "vertical" | "horizontal";

export interface ScrollAxisMetrics {
  viewportSize: number;
  contentSize: number;
  scrollPosition: number;
}

export interface ScrollAreaMetrics {
  vertical: ScrollAxisMetrics;
  horizontal: ScrollAxisMetrics;
}

export interface ScrollAreaOptions {
  type?: Derivable<ScrollAreaType | undefined>;
  /** How long the scrollbars linger after scrolling stops, for `type="scroll"`. */
  scrollHideDelayMs?: Derivable<number | undefined>;
}

export interface ScrollAreaCore {
  type: () => ScrollAreaType;
  scrollHideDelayMs: () => number;
  metrics: () => ScrollAreaMetrics;
  axis: (orientation: ScrollAreaOrientation) => ScrollAxisMetrics;
  setMetrics: (metrics: ScrollAreaMetrics) => void;
  setViewport: (instance: ScrollingFrame | undefined) => void;
  getViewport: () => ScrollingFrame | undefined;
  setScrollPosition: (orientation: ScrollAreaOrientation, position: number) => void;
  /** Keeps the scrollbars up while scrolling continues, then hides them after the delay. */
  notifyScrollActivity: () => void;
  showScrollbar: (orientation: ScrollAreaOrientation) => boolean;
  viewportSpec: () => ElementSpec<ScrollingFrame>;
  scrollbarSpec: (orientation: ScrollAreaOrientation) => ElementSpec<Frame>;
  cornerSpec: () => ElementSpec<Frame>;
}
