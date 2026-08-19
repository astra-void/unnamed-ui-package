import { createSwitch } from "@lattice-ui/core-switch";
import {
  applyElementSpec,
  applySlotProps,
  createVideReactivity,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { SwitchContext } from "./context";
import type { SwitchProps } from "./types";

const OWN_PROPS = ["checked", "defaultChecked", "onCheckedChange", "disabled", "asChild", "children"] as const;

export function SwitchRoot(props: SwitchProps) {
  const core = createSwitch(createVideReactivity(), {
    checked: props.checked,
    defaultChecked: props.defaultChecked ?? false,
    disabled: props.disabled,
    onCheckedChange: props.onCheckedChange,
  });

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(core.rootSpec(), passthrough, { neutral: props.asChild !== true });

  return SwitchContext(core, () => {
    if (props.asChild === true) {
      const child = resolveSlotInstance(props.children);
      if (child === undefined) {
        error("[Switch] `asChild` requires a child instance.");
      }

      // No neutral defaults here: the rendered instance belongs to the consumer.
      return applySlotProps(child as TextButton, merged);
    }

    return <textbutton {...merged}>{props.children}</textbutton>;
  });
}
