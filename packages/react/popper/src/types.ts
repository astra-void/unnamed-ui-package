import type { ComputePopperResult, PopperPositioningOptions } from "@lattice-ui/core-popper";
import type React from "@rbxts/react";

export type UsePopperOptions = PopperPositioningOptions & {
  anchorRef?: React.RefObject<GuiObject> | React.MutableRefObject<GuiObject | undefined>;
  contentRef?: React.RefObject<GuiObject> | React.MutableRefObject<GuiObject | undefined>;
  /**
   * Where to read the instances from, for callers that keep them somewhere other than a React ref —
   * a behavior core, for instance. Takes precedence over the matching ref.
   */
  getAnchor?: () => GuiObject | undefined;
  getContent?: () => GuiObject | undefined;
  enabled?: boolean;
};

export type UsePopperResult = ComputePopperResult & {
  contentSize: Vector2;
  isPositioned: boolean;
  update: () => void;
};
