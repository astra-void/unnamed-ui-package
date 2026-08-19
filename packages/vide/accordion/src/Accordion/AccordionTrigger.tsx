import { useFocusNode } from "@lattice-ui/vide-focus";
import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useAccordionItemContext } from "./context";
import type { AccordionTriggerProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function AccordionTrigger(props: AccordionTriggerProps) {
  const item = useAccordionItemContext();
  const instance = Vide.source<GuiObject | undefined>(undefined);

  useFocusNode({
    getGuiObject: () => instance(),
    disabled: () => item.disabled(),
  });

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(item.triggerSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[AccordionTrigger] `asChild` requires a child instance.");
    }

    const target = child as TextButton;
    instance(target);
    return applySlotProps(target, merged);
  }

  merged.action = (created: TextButton) => instance(created);

  return <textbutton {...merged}>{props.children}</textbutton>;
}
