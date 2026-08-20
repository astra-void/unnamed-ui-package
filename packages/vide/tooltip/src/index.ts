import { TooltipContent } from "./Tooltip/TooltipContent";
import { TooltipPortal } from "./Tooltip/TooltipPortal";
import { TooltipProvider } from "./Tooltip/TooltipProvider";
import { TooltipRoot } from "./Tooltip/TooltipRoot";
import { TooltipTrigger } from "./Tooltip/TooltipTrigger";

export const Tooltip = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
} as const satisfies {
  Provider: typeof TooltipProvider;
  Root: typeof TooltipRoot;
  Trigger: typeof TooltipTrigger;
  Portal: typeof TooltipPortal;
  Content: typeof TooltipContent;
};

// The Vide layer has no `vide-popper` package — the popper is behavior, and behavior lives in the
// core — so the placement type is re-exported here, where the prop that takes it is declared.
export type { PopperPlacement } from "@lattice-ui/core-popper";
export { useTooltipContext, useTooltipPolicy } from "./Tooltip/context";
export type {
  TooltipContentProps,
  TooltipPortalProps,
  TooltipProps,
  TooltipProviderProps,
  TooltipTriggerProps,
} from "./Tooltip/types";
export { TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger };
