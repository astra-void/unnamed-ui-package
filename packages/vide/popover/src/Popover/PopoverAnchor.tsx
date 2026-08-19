import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { usePopoverContext } from "./context";
import type { PopoverAnchorProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function PopoverAnchor(props: PopoverAnchorProps) {
  const core = usePopoverContext();
  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);
  const merged = applyElementSpec(core.anchorSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[PopoverAnchor] `asChild` requires a child instance.");
    }

    return applySlotProps(child as Frame, merged);
  }

  return <frame {...merged}>{props.children}</frame>;
}
