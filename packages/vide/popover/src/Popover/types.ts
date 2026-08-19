import type { PresenceMotionConfig } from "@lattice-ui/core-motion";
import type { PopoverCore, PopoverSetOpen } from "@lattice-ui/core-popover";
import type { PopperPlacement } from "@lattice-ui/core-popper";
import type { Derivable } from "@lattice-ui/core-runtime";
import type { PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type { PopoverCore, PopoverSetOpen };

export type PopoverProps = {
  open?: Derivable<boolean | undefined>;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: Derivable<boolean | undefined>;
  /** Written as a function, so the parts inside can read the popover context. */
  children?: Vide.Node;
};

export type PopoverTriggerProps = {
  asChild?: boolean;
  disabled?: Derivable<boolean | undefined>;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type PopoverPortalProps = {
  container?: BasePlayerGui;
  displayOrderBase?: number;
  children?: Vide.Node;
};

export type PopoverContentProps = {
  /** Opt into motion. Presence timing is the primitive's; the animation is yours. */
  transition?: PresenceMotionConfig;
  asChild?: boolean;
  forceMount?: boolean;
  placement?: Derivable<PopperPlacement | undefined>;
  sideOffset?: Derivable<number | undefined>;
  alignOffset?: Derivable<number | undefined>;
  collisionPadding?: Derivable<number | undefined>;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type PopoverAnchorProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type PopoverCloseProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;
