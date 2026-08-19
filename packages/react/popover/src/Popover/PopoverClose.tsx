import {
  applyElementSpec,
  getPassthroughProps,
  getSlotChild,
  React,
  Slot,
  toSlotProps,
} from "@lattice-ui/react-runtime";
import { usePopoverContext } from "./context";
import type { PopoverCloseProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function PopoverClose(props: PopoverCloseProps) {
  const core = usePopoverContext().core;
  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(core.closeSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild) {
    const child = props.children;
    if (getSlotChild(child) === undefined) {
      error("[PopoverClose] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
