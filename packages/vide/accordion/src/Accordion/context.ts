import type { AccordionCore, AccordionItemCore } from "@lattice-ui/core-accordion";
import { Vide } from "@lattice-ui/vide-runtime";

export const AccordionContext = Vide.context<AccordionCore>();
export const AccordionItemContext = Vide.context<AccordionItemCore>();

export function useAccordionContext(): AccordionCore {
  const core = AccordionContext() as AccordionCore | undefined;

  if (core === undefined) {
    error("[Accordion] context is undefined. Render this inside <Accordion.Root>.");
  }

  return core;
}

export function useAccordionItemContext(): AccordionItemCore {
  const item = AccordionItemContext() as AccordionItemCore | undefined;

  if (item === undefined) {
    error("[Accordion] item context is undefined. Render this inside <Accordion.Item>.");
  }

  return item;
}
