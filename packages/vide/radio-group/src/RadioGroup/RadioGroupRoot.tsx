import { createRadioGroup } from "@lattice-ui/core-radio-group";
import { createVideReactivity } from "@lattice-ui/vide-runtime";
import { RadioGroupContext } from "./context";
import type { RadioGroupProps } from "./types";

export function RadioGroupRoot(props: RadioGroupProps) {
  const core = createRadioGroup(createVideReactivity(), {
    value: props.value,
    defaultValue: props.defaultValue,
    disabled: props.disabled,
    required: props.required,
    orientation: props.orientation,
    onValueChange: props.onValueChange,
  });

  return RadioGroupContext(core, () => props.children);
}
