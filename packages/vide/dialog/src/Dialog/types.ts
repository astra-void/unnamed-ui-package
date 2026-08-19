import type { PresenceMotionConfig } from "@lattice-ui/vide-motion";
import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type DialogProps = {
  open?: Derivable<boolean | undefined>;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: Derivable<boolean | undefined>;
  /** Written as a function, so the parts read the dialog context after Root provides it. */
  children?: Vide.Node;
};

export type DialogTriggerProps = {
  asChild?: boolean;
  disabled?: Derivable<boolean | undefined>;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type DialogPortalProps = {
  container?: BasePlayerGui;
  displayOrderBase?: number;
  children?: Vide.Node;
};

export type DialogOverlayProps = {
  asChild?: boolean;
  forceMount?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type DialogContentProps = {
  asChild?: boolean;
  transition?: PresenceMotionConfig;
  forceMount?: boolean;
  trapFocus?: Derivable<boolean | undefined>;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type DialogCloseProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;
