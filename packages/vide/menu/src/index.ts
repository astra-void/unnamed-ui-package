import { MenuContent } from "./Menu/MenuContent";
import { MenuGroup } from "./Menu/MenuGroup";
import { MenuItem } from "./Menu/MenuItem";
import { MenuLabel } from "./Menu/MenuLabel";
import { MenuPortal } from "./Menu/MenuPortal";
import { MenuRoot } from "./Menu/MenuRoot";
import { MenuSeparator } from "./Menu/MenuSeparator";
import { MenuTrigger } from "./Menu/MenuTrigger";

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Portal: MenuPortal,
  Content: MenuContent,
  Item: MenuItem,
  Group: MenuGroup,
  Label: MenuLabel,
  Separator: MenuSeparator,
} as const satisfies {
  Root: typeof MenuRoot;
  Trigger: typeof MenuTrigger;
  Portal: typeof MenuPortal;
  Content: typeof MenuContent;
  Item: typeof MenuItem;
  Group: typeof MenuGroup;
  Label: typeof MenuLabel;
  Separator: typeof MenuSeparator;
};

// The Vide layer has no `vide-popper` package — the popper is behavior, and behavior lives in the
// core — so the placement type is re-exported here, where the prop that takes it is declared.
export type { PopperPlacement } from "@lattice-ui/core-popper";
export { useMenuContext, useMenuItemContext } from "./Menu/context";
export type {
  MenuContentProps,
  MenuGroupProps,
  MenuItemProps,
  MenuLabelProps,
  MenuPortalProps,
  MenuProps,
  MenuSelectEvent,
  MenuSeparatorProps,
  MenuTriggerProps,
} from "./Menu/types";
export { MenuContent, MenuGroup, MenuItem, MenuLabel, MenuPortal, MenuRoot, MenuSeparator, MenuTrigger };
