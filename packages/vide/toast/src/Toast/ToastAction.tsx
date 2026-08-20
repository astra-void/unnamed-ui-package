import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useToastContext } from "./context";
import type { ToastActionProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function ToastAction(props: ToastActionProps) {
  const core = useToastContext();
  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(core.actionSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[ToastAction] `asChild` requires a child instance.");
    }

    // No neutral defaults here: the rendered instance belongs to the consumer.
    return applySlotProps(child as TextButton, merged);
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
