import { createTooltip } from "@lattice-ui/core-tooltip";
import { createVideReactivity, renderChildren } from "@lattice-ui/vide-runtime";
import { TooltipContext, useTooltipPolicy } from "./context";
import type { TooltipProps } from "./types";

export function TooltipRoot(props: TooltipProps) {
  const core = createTooltip(createVideReactivity(), {
    open: props.open,
    defaultOpen: props.defaultOpen ?? false,
    delayDuration: props.delayDuration,
    onOpenChange: props.onOpenChange,
    policy: useTooltipPolicy(),
  });

  return TooltipContext(core, () => renderChildren(props.children));
}

export { TooltipRoot as Tooltip };
