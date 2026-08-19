import {
  applyElementSpec,
  getPassthroughProps,
  getSlotChild,
  React,
  Slot,
  toSlotProps,
} from "@lattice-ui/react-runtime";
import { usePopoverContext } from "./context";
import type { PopoverAnchorProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function PopoverAnchor(props: PopoverAnchorProps) {
  const core = usePopoverContext().core;
  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);
  const merged = applyElementSpec(core.anchorSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild) {
    const child = props.children;
    if (getSlotChild(child) === undefined) {
      error("[PopoverAnchor] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <frame {...merged}>{props.children}</frame>;
}
