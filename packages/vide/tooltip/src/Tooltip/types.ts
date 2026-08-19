import type { PopperPlacement } from "@lattice-ui/core-popper";
import type { PresenceMotionConfig } from "@lattice-ui/vide-motion";
import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type TooltipProviderProps = {
  delayDuration?: Derivable<number | undefined>;
  skipDelayDuration?: Derivable<number | undefined>;
  children: () => Vide.Node;
};

export type TooltipProps = {
  open?: Derivable<boolean | undefined>;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: Derivable<number | undefined>;
  /** Written as a function, so the parts read the tooltip context after Root provides it. */
  children?: Vide.Node;
};

export type TooltipTriggerProps = {
  asChild?: boolean;
  disabled?: Derivable<boolean | undefined>;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type TooltipPortalProps = {
  container?: BasePlayerGui;
  displayOrderBase?: number;
  children?: Vide.Node;
};

export type TooltipContentProps = {
  transition?: PresenceMotionConfig;
  asChild?: boolean;
  forceMount?: boolean;
  placement?: Derivable<PopperPlacement | undefined>;
  sideOffset?: Derivable<number | undefined>;
  alignOffset?: Derivable<number | undefined>;
  collisionPadding?: Derivable<number | undefined>;
  children?: Vide.Node;
} & PassthroughProps<Frame>;
