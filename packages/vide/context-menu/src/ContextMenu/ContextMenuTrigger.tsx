import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useContextMenuContext } from "./context";
import type { ContextMenuTriggerProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "children"] as const;

export function ContextMenuTrigger(props: ContextMenuTriggerProps) {
  const core = useContextMenuContext();

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(core.triggerSpec({ disabled: props.disabled }), passthrough, {
    neutral: props.asChild !== true,
  });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[ContextMenuTrigger] `asChild` requires a child instance.");
    }

    return applySlotProps(child as TextButton, merged);
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
