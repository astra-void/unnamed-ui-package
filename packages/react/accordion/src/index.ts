export * from "@lattice-ui/core-accordion";

import { AccordionContent } from "./Accordion/AccordionContent";
import { AccordionHeader } from "./Accordion/AccordionHeader";
import { AccordionItem } from "./Accordion/AccordionItem";
import { AccordionRoot } from "./Accordion/AccordionRoot";
import { AccordionTrigger } from "./Accordion/AccordionTrigger";

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
} as const;

export type {
  AccordionContentProps,
  AccordionContextValue,
  AccordionHeaderProps,
  AccordionItemContextValue,
  AccordionItemProps,
  AccordionProps,
  AccordionTriggerProps,
} from "./Accordion/types";
