import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useContextMenuContext } from "./context";
import type { ContextMenuGroupProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function ContextMenuGroup(props: ContextMenuGroupProps) {
  const core = useContextMenuContext();
  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);
  const merged = applyElementSpec(core.groupSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[ContextMenuGroup] `asChild` requires a child instance.");
    }

    // No neutral defaults here: the rendered instance belongs to the consumer.
    return applySlotProps(child as Frame, merged);
  }

  return <frame {...merged}>{props.children}</frame>;
}
