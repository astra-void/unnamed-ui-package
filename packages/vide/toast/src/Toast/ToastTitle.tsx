import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useToastContext } from "./context";
import type { ToastTitleProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function ToastTitle(props: ToastTitleProps) {
  const core = useToastContext();
  const passthrough = getPassthroughProps<TextLabel>(props, OWN_PROPS);
  const merged = applyElementSpec(core.titleSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[ToastTitle] `asChild` requires a child instance.");
    }

    // No neutral defaults here: the rendered instance belongs to the consumer.
    return applySlotProps(child as TextLabel, merged);
  }

  return <textlabel {...merged}>{props.children}</textlabel>;
}
