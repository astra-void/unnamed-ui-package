import { createCheckbox } from "@lattice-ui/core-checkbox";
import {
  applyElementSpec,
  applySlotProps,
  createVideReactivity,
  getPassthroughProps,
  resolveSlotInstance,
  // JSX in this file compiles to `Vide.jsx(...)`, so the identifier has to be in scope as a value.
  Vide,
} from "@lattice-ui/vide-runtime";
import { CheckboxContext } from "./context";
import type { CheckboxProps } from "./types";

const OWN_PROPS = [
  "checked",
  "defaultChecked",
  "onCheckedChange",
  "disabled",
  "required",
  "asChild",
  "children",
] as const;

export function CheckboxRoot(props: CheckboxProps) {
  // A Vide component runs once, so the core is built once and the props it was given are already
  // the live sources it should read. Nothing here needs the ref indirection the React adapter uses.
  const core = createCheckbox(createVideReactivity(), {
    checked: props.checked,
    defaultChecked: props.defaultChecked ?? false,
    disabled: props.disabled,
    required: props.required,
    onCheckedChange: props.onCheckedChange,
  });

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const spec = core.rootSpec();

  return CheckboxContext(core, () => {
    if (props.asChild === true) {
      const child = resolveSlotInstance(props.children);
      if (child === undefined) {
        error("[Checkbox] `asChild` requires a child instance.");
      }

      // No neutral defaults here: the rendered instance belongs to the consumer.
      return applySlotProps(child as TextButton, applyElementSpec(spec, passthrough, { neutral: false }));
    }

    return <textbutton {...applyElementSpec(spec, passthrough)}>{props.children}</textbutton>;
  });
}
