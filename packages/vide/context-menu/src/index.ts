import { ContextMenuContent } from "./ContextMenu/ContextMenuContent";
import { ContextMenuGroup } from "./ContextMenu/ContextMenuGroup";
import { ContextMenuItem } from "./ContextMenu/ContextMenuItem";
import { ContextMenuLabel } from "./ContextMenu/ContextMenuLabel";
import { ContextMenuPortal } from "./ContextMenu/ContextMenuPortal";
import { ContextMenuRoot } from "./ContextMenu/ContextMenuRoot";
import { ContextMenuSeparator } from "./ContextMenu/ContextMenuSeparator";
import { ContextMenuTrigger } from "./ContextMenu/ContextMenuTrigger";

export const ContextMenu = {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Portal: ContextMenuPortal,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  Group: ContextMenuGroup,
  Label: ContextMenuLabel,
  Separator: ContextMenuSeparator,
} as const satisfies {
  Root: typeof ContextMenuRoot;
  Trigger: typeof ContextMenuTrigger;
  Portal: typeof ContextMenuPortal;
  Content: typeof ContextMenuContent;
  Item: typeof ContextMenuItem;
  Group: typeof ContextMenuGroup;
  Label: typeof ContextMenuLabel;
  Separator: typeof ContextMenuSeparator;
};

// The Vide layer has no `vide-popper` package — the popper is behavior, and behavior lives in the
// core — so the placement type is re-exported here, where the prop that takes it is declared.
export type { PopperPlacement } from "@lattice-ui/core-popper";
export { useContextMenuContext, useContextMenuItemContext } from "./ContextMenu/context";
export type {
  ContextMenuContentProps,
  ContextMenuGroupProps,
  ContextMenuItemProps,
  ContextMenuLabelProps,
  ContextMenuPortalProps,
  ContextMenuProps,
  ContextMenuSeparatorProps,
  ContextMenuTriggerProps,
  MenuSelectEvent,
} from "./ContextMenu/types";
export {
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuTrigger,
};
