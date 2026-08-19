import { createAccordion } from "@lattice-ui/core-accordion";
import { createVideReactivity } from "@lattice-ui/vide-runtime";
import { AccordionContext } from "./context";
import type { AccordionProps } from "./types";

export function AccordionRoot(props: AccordionProps) {
  const core = createAccordion(createVideReactivity(), {
    type: props.type ?? "single",
    value: props.value,
    defaultValue: props.defaultValue,
    collapsible: props.collapsible,
    onValueChange: props.onValueChange,
  });

  return AccordionContext(core, () => props.children);
}

export { AccordionRoot as Accordion };
