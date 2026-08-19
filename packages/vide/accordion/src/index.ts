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
} as const satisfies {
  Root: typeof AccordionRoot;
  Item: typeof AccordionItem;
  Header: typeof AccordionHeader;
  Trigger: typeof AccordionTrigger;
  Content: typeof AccordionContent;
};

export { useAccordionContext, useAccordionItemContext } from "./Accordion/context";
export type {
  AccordionContentProps,
  AccordionHeaderProps,
  AccordionItemProps,
  AccordionProps,
  AccordionTriggerProps,
} from "./Accordion/types";
export { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger };
