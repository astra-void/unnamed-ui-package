import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useSelectContext } from "./context";
import type { SelectSeparatorProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function SelectSeparator(props: SelectSeparatorProps) {
  const core = useSelectContext();
  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);
  const merged = applyElementSpec(core.separatorSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[SelectSeparator] `asChild` requires a child instance.");
    }

    // No neutral defaults here: the rendered instance belongs to the consumer.
    return applySlotProps(child as Frame, merged);
  }

  return <frame {...merged}>{props.children}</frame>;
}
