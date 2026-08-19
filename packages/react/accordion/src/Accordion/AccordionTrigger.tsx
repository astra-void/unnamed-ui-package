import { useFocusNode } from "@lattice-ui/react-focus";
import {
  applyElementSpec,
  composeRefs,
  getPassthroughProps,
  React,
  Slot,
  toSlotProps,
} from "@lattice-ui/react-runtime";
import { useAccordionItemContext } from "./context";
import type { AccordionTriggerProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function AccordionTrigger(props: AccordionTriggerProps) {
  const item = useAccordionItemContext().item;
  const triggerRef = React.useRef<GuiObject>();

  const setTriggerRef = React.useCallback((instance: Instance | undefined) => {
    triggerRef.current = instance?.IsA("GuiObject") === true ? instance : undefined;
  }, []);

  useFocusNode({
    ref: triggerRef,
    getDisabled: () => item.disabled(),
  });

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(item.triggerSpec(), passthrough, { neutral: props.asChild !== true });
  merged.ref = composeRefs<GuiObject>(merged.ref as never, setTriggerRef);

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[AccordionTrigger] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
