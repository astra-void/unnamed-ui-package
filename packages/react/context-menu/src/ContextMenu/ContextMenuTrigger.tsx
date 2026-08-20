import { applyElementSpec, getPassthroughProps, React, Slot, toSlotProps } from "@lattice-ui/react-runtime";
import { useContextMenuContext } from "./context";
import type { ContextMenuTriggerProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "children"] as const;

export function ContextMenuTrigger(props: ContextMenuTriggerProps) {
  const core = useContextMenuContext().core;
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(core.triggerSpec({ disabled: () => propsRef.current.disabled }), passthrough, {
    neutral: props.asChild !== true,
  });

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[ContextMenuTrigger] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
