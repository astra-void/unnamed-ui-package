import { applyElementSpec, getPassthroughProps, React, Slot, toSlotProps } from "@lattice-ui/react-runtime";
import { useComboboxContext } from "./context";
import type { ComboboxTriggerProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "children"] as const;

export function ComboboxTrigger(props: ComboboxTriggerProps) {
  const core = useComboboxContext().core;
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(core.triggerSpec({ disabled: () => propsRef.current.disabled }), passthrough, {
    neutral: props.asChild !== true,
  });

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[ComboboxTrigger] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
