import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useTooltipContext } from "./context";
import type { TooltipTriggerProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "children"] as const;

export function TooltipTrigger(props: TooltipTriggerProps) {
  const core = useTooltipContext();
  // Built once, so hover and focus accumulate on one activity state.
  const trigger = core.createTrigger({ disabled: props.disabled });

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(trigger.spec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[TooltipTrigger] `asChild` requires a child instance.");
    }

    const target = child as TextButton;
    core.setTrigger(target);
    return applySlotProps(target, merged);
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
