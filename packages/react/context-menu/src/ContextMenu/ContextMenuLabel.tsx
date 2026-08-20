import { applyElementSpec, getPassthroughProps, React, Slot, toSlotProps } from "@lattice-ui/react-runtime";
import { useContextMenuContext } from "./context";
import type { ContextMenuLabelProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function ContextMenuLabel(props: ContextMenuLabelProps) {
  const core = useContextMenuContext().core;
  const passthrough = getPassthroughProps<TextLabel>(props, OWN_PROPS);
  const merged = applyElementSpec(core.labelSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[ContextMenuLabel] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textlabel {...merged}>{props.children}</textlabel>;
}
