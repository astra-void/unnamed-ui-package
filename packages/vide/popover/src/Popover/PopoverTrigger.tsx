import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { usePopoverContext } from "./context";
import type { PopoverTriggerProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "children"] as const;

export function PopoverTrigger(props: PopoverTriggerProps) {
  const core = usePopoverContext();
  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const spec = core.triggerSpec({ disabled: props.disabled });
  const merged = applyElementSpec(spec, passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[PopoverTrigger] `asChild` requires a child instance.");
    }

    return applySlotProps(child as TextButton, merged);
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
