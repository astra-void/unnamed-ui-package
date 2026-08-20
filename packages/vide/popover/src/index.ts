import { PopoverAnchor } from "./Popover/PopoverAnchor";
import { PopoverClose } from "./Popover/PopoverClose";
import { PopoverContent } from "./Popover/PopoverContent";
import { PopoverPortal } from "./Popover/PopoverPortal";
import { PopoverRoot } from "./Popover/PopoverRoot";
import { PopoverTrigger } from "./Popover/PopoverTrigger";

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Content: PopoverContent,
  Anchor: PopoverAnchor,
  Close: PopoverClose,
} as const satisfies {
  Root: typeof PopoverRoot;
  Trigger: typeof PopoverTrigger;
  Portal: typeof PopoverPortal;
  Content: typeof PopoverContent;
  Anchor: typeof PopoverAnchor;
  Close: typeof PopoverClose;
};

// The Vide layer has no `vide-popper` package — the popper is behavior, and behavior lives in the
// core — so the placement type is re-exported here, where the prop that takes it is declared.
export type { PopperPlacement } from "@lattice-ui/core-popper";
export { usePopoverContext } from "./Popover/context";
export type {
  PopoverAnchorProps,
  PopoverCloseProps,
  PopoverContentProps,
  PopoverPortalProps,
  PopoverProps,
  PopoverTriggerProps,
} from "./Popover/types";
export { PopoverAnchor, PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger };
