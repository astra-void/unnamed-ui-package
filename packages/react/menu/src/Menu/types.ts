import type { MenuCore, MenuSelectEvent } from "@lattice-ui/core-menu";
import type { LayerInteractEvent } from "@lattice-ui/react-layer";
import type { PresenceMotionConfig as MotionConfig } from "@lattice-ui/react-motion";
import type { PopperPlacement } from "@lattice-ui/react-popper";
import type { PassthroughProps } from "@lattice-ui/react-runtime";
import type React from "@rbxts/react";

export type MenuSetOpen = (open: boolean) => void;

export type MenuContextValue = {
  open: boolean;
  setOpen: MenuSetOpen;
  modal: boolean;
  focusFirstItem: () => void;
  restoreTriggerFocus: () => void;
  /** The core, for the parts that build an item or position against the instances. */
  core: MenuCore;
};

export type MenuProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  children?: React.ReactNode;
};

/** Per-item state consumers read to style the item; the primitive never paints it. */
export type MenuItemContextValue = {
  highlighted: boolean;
  disabled: boolean;
};

export type MenuTriggerProps = {
  asChild?: boolean;
  disabled?: boolean;
  children?: React.ReactElement;
} & PassthroughProps<TextButton>;

export type MenuPortalProps = {
  container?: BasePlayerGui;
  displayOrderBase?: number;
  children?: React.ReactNode;
};

export type MenuContentProps = {
  transition?: MotionConfig;
  asChild?: boolean;
  forceMount?: boolean;
  placement?: PopperPlacement;
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number;
  onPointerDownOutside?: (event: LayerInteractEvent) => void;
  onInteractOutside?: (event: LayerInteractEvent) => void;
  children?: React.ReactNode;
} & PassthroughProps<Frame>;

export type { MenuSelectEvent };

export type MenuItemProps = {
  asChild?: boolean;
  disabled?: boolean;
  onSelect?: (event: MenuSelectEvent) => void;
  children?: React.ReactElement;
} & PassthroughProps<TextButton>;

export type MenuSeparatorProps = {
  asChild?: boolean;
  children?: React.ReactElement;
} & PassthroughProps<Frame>;

export type MenuGroupProps = {
  asChild?: boolean;
  children?: React.ReactElement;
} & PassthroughProps<Frame>;

export type MenuLabelProps = {
  asChild?: boolean;
  children?: React.ReactElement;
} & PassthroughProps<TextLabel>;
