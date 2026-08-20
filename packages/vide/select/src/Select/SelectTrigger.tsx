import { useFocusNode } from "@lattice-ui/vide-focus";
import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useSelectContext } from "./context";
import type { SelectTriggerProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "children"] as const;

export function SelectTrigger(props: SelectTriggerProps) {
  const core = useSelectContext();
  // Built once, which keeps the activation guard stable across the paired events of one activation.
  const trigger = core.createTrigger({ disabled: props.disabled });

  useFocusNode({
    getGuiObject: core.getTrigger,
    disabled: () => trigger.disabled(),
  });

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(trigger.spec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[SelectTrigger] `asChild` requires a child instance.");
    }

    return applySlotProps(child as TextButton, merged);
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
