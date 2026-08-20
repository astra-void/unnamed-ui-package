import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useSelectContext } from "./context";
import type { SelectValueProps } from "./types";

const OWN_PROPS = ["asChild", "placeholder", "children"] as const;

export function SelectValue(props: SelectValueProps) {
  const core = useSelectContext();
  const passthrough = getPassthroughProps<TextLabel>(props, OWN_PROPS);
  const merged = applyElementSpec(core.valueSpec(), passthrough, { neutral: props.asChild !== true });

  // The selected item's text, or the placeholder while nothing is chosen. Text is data here, not
  // appearance: it is what the current selection *is*.
  merged.Text = () => {
    const value = core.value();
    const text = value !== undefined ? core.getItemText(value) : undefined;

    return text ?? props.placeholder ?? "";
  };

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[SelectValue] `asChild` requires a child instance.");
    }

    return applySlotProps(child as TextLabel, merged);
  }

  return <textlabel {...merged}>{props.children}</textlabel>;
}
