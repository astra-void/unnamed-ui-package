import { resolveThumbOffset, resolveThumbSize } from "@lattice-ui/core-scroll-area";
import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useScrollAreaContext } from "./context";
import type { ScrollAreaThumbProps } from "./types";

const OWN_PROPS = ["orientation", "asChild", "children"] as const;

export function ScrollAreaThumb(props: ScrollAreaThumbProps) {
  const core = useScrollAreaContext();
  const orientation = props.orientation;
  const vertical = orientation === "vertical";

  // Size and position are the scroll mapping, not decoration: both are bound to the measurements
  // the viewport reports.
  function geometry() {
    const axis = core.axis(orientation);
    const trackSize = axis.viewportSize;
    const thumbSize = resolveThumbSize(axis.viewportSize, axis.contentSize, trackSize);
    const offset = resolveThumbOffset(axis.scrollPosition, axis.viewportSize, axis.contentSize, trackSize, thumbSize);

    return { thumbSize, offset };
  }

  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);
  const merged = applyElementSpec({ neutral: { BackgroundTransparency: 1, BorderSizePixel: 0 } }, passthrough, {
    neutral: props.asChild !== true,
  });

  merged.Size = () => {
    const { thumbSize } = geometry();
    return vertical ? new UDim2(1, 0, 0, thumbSize) : new UDim2(0, thumbSize, 1, 0);
  };
  merged.Position = () => {
    const { offset } = geometry();
    return vertical ? UDim2.fromOffset(0, offset) : UDim2.fromOffset(offset, 0);
  };

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[ScrollAreaThumb] `asChild` requires a child instance.");
    }

    return applySlotProps(child as Frame, merged);
  }

  return <frame {...merged}>{props.children}</frame>;
}
