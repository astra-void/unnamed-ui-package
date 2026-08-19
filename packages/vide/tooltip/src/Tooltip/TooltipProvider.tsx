import { createTooltipPolicy } from "@lattice-ui/core-tooltip";
import { Vide } from "@lattice-ui/vide-runtime";
import { TooltipPolicyContext } from "./context";
import type { TooltipProviderProps } from "./types";

export function TooltipProvider(props: TooltipProviderProps) {
  // One policy for the whole group: a tooltip opening shortly after another closed uses the shorter
  // skip delay, which is what makes moving along a row of triggers feel continuous.
  const policy = createTooltipPolicy({
    delayDuration: props.delayDuration,
    skipDelayDuration: props.skipDelayDuration,
  });

  return TooltipPolicyContext(policy, props.children);
}
