import { createTextField } from "@lattice-ui/core-text-field";
import { createVideReactivity, renderChildren } from "@lattice-ui/vide-runtime";
import { TextFieldContext } from "./context";
import type { TextFieldProps } from "./types";

export function TextFieldRoot(props: TextFieldProps) {
  const core = createTextField(createVideReactivity(), {
    value: props.value,
    defaultValue: props.defaultValue ?? "",
    disabled: props.disabled,
    readOnly: props.readOnly,
    required: props.required,
    invalid: props.invalid,
    name: props.name,
    onValueChange: props.onValueChange,
    onValueCommit: props.onValueCommit,
  });

  return TextFieldContext(core, () => renderChildren(props.children));
}
