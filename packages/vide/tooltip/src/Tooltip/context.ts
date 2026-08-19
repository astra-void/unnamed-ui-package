import type { TooltipCore, TooltipDelayPolicy } from "@lattice-ui/core-tooltip";
import { Vide } from "@lattice-ui/vide-runtime";

export const TooltipContext = Vide.context<TooltipCore>();
export const TooltipPolicyContext = Vide.context<TooltipDelayPolicy>();

export function useTooltipContext(): TooltipCore {
  const core = TooltipContext() as TooltipCore | undefined;

  if (core === undefined) {
    error("[Tooltip] context is undefined. Render this inside <Tooltip.Root>.");
  }

  return core;
}

/** The shared delay policy, or undefined for a tooltip outside a provider. */
export function useTooltipPolicy(): TooltipDelayPolicy | undefined {
  return TooltipPolicyContext() as TooltipDelayPolicy | undefined;
}
