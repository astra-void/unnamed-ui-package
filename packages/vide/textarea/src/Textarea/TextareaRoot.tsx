import { createTextarea } from "@lattice-ui/core-textarea";
import { createVideReactivity, renderChildren } from "@lattice-ui/vide-runtime";
import { TextareaContext } from "./context";
import type { TextareaProps } from "./types";

export function TextareaRoot(props: TextareaProps) {
  const core = createTextarea(createVideReactivity(), {
    value: props.value,
    defaultValue: props.defaultValue ?? "",
    disabled: props.disabled,
    readOnly: props.readOnly,
    required: props.required,
    invalid: props.invalid,
    name: props.name,
    autoResize: props.autoResize,
    minRows: props.minRows,
    maxRows: props.maxRows,
    onValueChange: props.onValueChange,
    onValueCommit: props.onValueCommit,
  });

  return TextareaContext(core, () => renderChildren(props.children));
}
