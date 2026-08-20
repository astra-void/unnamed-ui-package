import { createProgress } from "@lattice-ui/core-progress";
import { createVideReactivity, renderChildren } from "@lattice-ui/vide-runtime";
import { ProgressContext } from "./context";
import type { ProgressProps } from "./types";

export function ProgressRoot(props: ProgressProps) {
  const core = createProgress(createVideReactivity(), {
    value: props.value,
    defaultValue: props.defaultValue ?? 0,
    max: props.max,
    indeterminate: props.indeterminate,
    onValueChange: props.onValueChange,
  });

  return ProgressContext(core, () => renderChildren(props.children));
}

export { ProgressRoot as Progress };
