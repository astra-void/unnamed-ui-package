import { createToggleGroup } from "@lattice-ui/core-toggle-group";
import {
  applyElementSpec,
  applySlotProps,
  createVideReactivity,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { ToggleGroupContext } from "./context";
import type { ToggleGroupProps } from "./types";

const OWN_PROPS = ["type", "value", "defaultValue", "onValueChange", "disabled", "asChild", "children"] as const;

export function ToggleGroupRoot(props: ToggleGroupProps) {
  const core = createToggleGroup(createVideReactivity(), {
    type: props.type,
    disabled: props.disabled,
    value: props.type === "single" ? props.value : undefined,
    defaultValue: props.type === "single" ? props.defaultValue : undefined,
    onValueChange: props.type === "single" ? props.onValueChange : undefined,
    values: props.type === "multiple" ? props.value : undefined,
    defaultValues: props.type === "multiple" ? (props.defaultValue ?? []) : [],
    onValuesChange: props.type === "multiple" ? props.onValueChange : undefined,
  });

  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);
  const merged = applyElementSpec(core.rootSpec(), passthrough, { neutral: props.asChild !== true });

  return ToggleGroupContext(core, () => {
    if (props.asChild === true) {
      const child = resolveSlotInstance(props.children);
      if (child === undefined) {
        error("[ToggleGroup] `asChild` requires a child instance.");
      }

      // No neutral defaults here: the rendered instance belongs to the consumer.
      return applySlotProps(child as Frame, merged);
    }

    return <frame {...merged}>{props.children}</frame>;
  });
}
