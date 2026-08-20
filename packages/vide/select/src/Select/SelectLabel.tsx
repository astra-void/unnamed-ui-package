import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useSelectContext } from "./context";
import type { SelectLabelProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function SelectLabel(props: SelectLabelProps) {
  const core = useSelectContext();
  const passthrough = getPassthroughProps<TextLabel>(props, OWN_PROPS);
  const merged = applyElementSpec(core.labelSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[SelectLabel] `asChild` requires a child instance.");
    }

    // No neutral defaults here: the rendered instance belongs to the consumer.
    return applySlotProps(child as TextLabel, merged);
  }

  return <textlabel {...merged}>{props.children}</textlabel>;
}
