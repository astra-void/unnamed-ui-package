import {
  applyElementSpec,
  getPassthroughProps,
  getSlotChild,
  React,
  Slot,
  toSlotProps,
} from "@lattice-ui/react-runtime";
import { AccordionItemContextProvider, useAccordionContext } from "./context";
import type { AccordionItemProps } from "./types";

const OWN_PROPS = ["value", "disabled", "asChild", "children"] as const;

export function AccordionItem(props: AccordionItemProps) {
  const core = useAccordionContext().core;
  const propsRef = React.useRef(props);
  propsRef.current = props;

  // Built once, so the item keeps the activation guard that collapses the paired events of a single
  // gamepad or keyboard activation.
  const item = React.useMemo(
    () => core.createItem({ value: props.value, disabled: () => propsRef.current.disabled }),
    [core, props.value],
  );

  const open = item.open();
  const disabled = item.disabled();

  const contextValue = React.useMemo(
    () => ({ value: props.value, open, disabled, item }),
    [disabled, item, open, props.value],
  );

  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);
  const merged = applyElementSpec(item.itemSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild) {
    const child = props.children;
    if (getSlotChild(child) === undefined) {
      error("[AccordionItem] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return (
      <AccordionItemContextProvider value={contextValue}>
        <Slot {...toSlotProps(merged)}>{child}</Slot>
      </AccordionItemContextProvider>
    );
  }

  return (
    <AccordionItemContextProvider value={contextValue}>
      <frame {...merged}>{props.children}</frame>
    </AccordionItemContextProvider>
  );
}
