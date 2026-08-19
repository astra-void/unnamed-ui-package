import type { LayerInteractEvent } from "@lattice-ui/core-layer";
import type React from "@rbxts/react";

export type { LayerInteractEvent };

export type DismissableLayerProps = {
  children?: React.ReactNode;
  enabled?: boolean;
  contentBoundaryRef?: React.MutableRefObject<GuiObject | undefined>;
  insideRefs?: Array<React.MutableRefObject<GuiObject | undefined> | React.MutableRefObject<TextBox | undefined>>;
  /**
   * Instances that count as inside, read on demand. For callers that keep them in a behavior core
   * rather than in refs; takes precedence over `insideRefs`.
   */
  insideRoots?: () => Array<GuiObject | undefined>;
  modal?: boolean;
  disableOutsidePointerEvents?: boolean;
  onPointerDownOutside?: (event: LayerInteractEvent) => void;
  onInteractOutside?: (event: LayerInteractEvent) => void;
  onDismiss?: () => void;
};
