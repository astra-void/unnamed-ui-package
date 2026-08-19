import type { MenuSelectEvent } from "@lattice-ui/core-menu";
import type { PopperPlacement } from "@lattice-ui/core-popper";
import type { PresenceMotionConfig } from "@lattice-ui/vide-motion";
import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type { MenuSelectEvent };

export type MenuProps = {
  open?: Derivable<boolean | undefined>;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: Derivable<boolean | undefined>;
  /** Written as a function, so the parts read the menu context after Root provides it. */
  children?: Vide.Node;
};

export type MenuTriggerProps = {
  asChild?: boolean;
  disabled?: Derivable<boolean | undefined>;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type MenuPortalProps = {
  container?: BasePlayerGui;
  displayOrderBase?: number;
  children?: Vide.Node;
};

export type MenuContentProps = {
  transition?: PresenceMotionConfig;
  asChild?: boolean;
  forceMount?: boolean;
  placement?: Derivable<PopperPlacement | undefined>;
  sideOffset?: Derivable<number | undefined>;
  alignOffset?: Derivable<number | undefined>;
  collisionPadding?: Derivable<number | undefined>;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type MenuItemProps = {
  asChild?: boolean;
  disabled?: Derivable<boolean | undefined>;
  onSelect?: (event: MenuSelectEvent) => void;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type MenuGroupProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type MenuSeparatorProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type MenuLabelProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextLabel>;
