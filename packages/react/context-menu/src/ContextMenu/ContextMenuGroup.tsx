import { applyElementSpec, getPassthroughProps, React, Slot, toSlotProps } from "@lattice-ui/react-runtime";
import { useContextMenuContext } from "./context";
import type { ContextMenuGroupProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function ContextMenuGroup(props: ContextMenuGroupProps) {
  const core = useContextMenuContext().core;
  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);
  const merged = applyElementSpec(core.groupSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[ContextMenuGroup] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <frame {...merged}>{props.children}</frame>;
}
