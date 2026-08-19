import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useScrollAreaContext } from "./context";
import type { ScrollAreaScrollbarProps } from "./types";

const OWN_PROPS = ["orientation", "asChild", "children"] as const;

export function ScrollAreaScrollbar(props: ScrollAreaScrollbarProps) {
  const core = useScrollAreaContext();
  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);
  const merged = applyElementSpec(core.scrollbarSpec(props.orientation), passthrough, {
    neutral: props.asChild !== true,
  });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[ScrollAreaScrollbar] `asChild` requires a child instance.");
    }

    // No neutral defaults here: the rendered instance belongs to the consumer.
    return applySlotProps(child as Frame, merged);
  }

  return <frame {...merged}>{props.children}</frame>;
}
