import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { AccordionItemContext, useAccordionContext } from "./context";
import type { AccordionItemProps } from "./types";

const OWN_PROPS = ["value", "disabled", "asChild", "children"] as const;

export function AccordionItem(props: AccordionItemProps) {
  const core = useAccordionContext();
  // Built once, which keeps the item's activation guard stable across the paired events of one
  // gamepad or keyboard activation.
  const item = core.createItem({ value: props.value, disabled: props.disabled });

  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);
  const merged = applyElementSpec(item.itemSpec(), passthrough, { neutral: props.asChild !== true });

  return AccordionItemContext(item, () => {
    if (props.asChild === true) {
      const child = resolveSlotInstance(props.children);
      if (child === undefined) {
        error("[AccordionItem] `asChild` requires a child instance.");
      }

      // No neutral defaults here: the rendered instance belongs to the consumer.
      return applySlotProps(child as Frame, merged);
    }

    return <frame {...merged}>{props.children}</frame>;
  });
}
