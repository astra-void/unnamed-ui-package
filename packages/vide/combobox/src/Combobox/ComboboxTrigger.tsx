import { useFocusNode } from "@lattice-ui/vide-focus";
import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useComboboxContext } from "./context";
import type { ComboboxTriggerProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "children"] as const;

export function ComboboxTrigger(props: ComboboxTriggerProps) {
  const core = useComboboxContext();
  useFocusNode({
    getGuiObject: core.getTrigger,
    disabled: props.disabled,
  });

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(core.triggerSpec({ disabled: props.disabled }), passthrough, {
    neutral: props.asChild !== true,
  });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[ComboboxTrigger] `asChild` requires a child instance.");
    }

    return applySlotProps(child as TextButton, merged);
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
