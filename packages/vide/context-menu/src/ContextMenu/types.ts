import type { MenuSelectEvent } from "@lattice-ui/core-context-menu";
import type { PopperPlacement } from "@lattice-ui/core-popper";
import type { PresenceMotionConfig } from "@lattice-ui/vide-motion";
import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type { MenuSelectEvent };

export type ContextMenuProps = {
  open?: Derivable<boolean | undefined>;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: Derivable<boolean | undefined>;
  /** Written as a function, so the parts read the menu context after Root provides it. */
  children?: Vide.Node;
};

export type ContextMenuTriggerProps = {
  asChild?: boolean;
  disabled?: Derivable<boolean | undefined>;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type ContextMenuPortalProps = {
  container?: BasePlayerGui;
  displayOrderBase?: number;
  children?: Vide.Node;
};

export type ContextMenuContentProps = {
  transition?: PresenceMotionConfig;
  asChild?: boolean;
  forceMount?: boolean;
  placement?: Derivable<PopperPlacement | undefined>;
  sideOffset?: Derivable<number | undefined>;
  alignOffset?: Derivable<number | undefined>;
  collisionPadding?: Derivable<number | undefined>;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type ContextMenuItemProps = {
  asChild?: boolean;
  disabled?: Derivable<boolean | undefined>;
  onSelect?: (event: MenuSelectEvent) => void;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type ContextMenuGroupProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type ContextMenuSeparatorProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type ContextMenuLabelProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextLabel>;
