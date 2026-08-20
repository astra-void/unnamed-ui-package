import type { PopperPlacement } from "@lattice-ui/core-popper";
import type { PresenceMotionConfig } from "@lattice-ui/vide-motion";
import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type SelectProps = {
  value?: Derivable<string | undefined>;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: Derivable<boolean | undefined>;
  required?: Derivable<boolean | undefined>;
  open?: Derivable<boolean | undefined>;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: Derivable<boolean | undefined>;
  /** Written as a function, so the parts read the menu context after Root provides it. */
  children?: Vide.Node;
};

export type SelectTriggerProps = {
  asChild?: boolean;
  disabled?: Derivable<boolean | undefined>;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type SelectPortalProps = {
  container?: BasePlayerGui;
  displayOrderBase?: number;
  children?: Vide.Node;
};

export type SelectContentProps = {
  transition?: PresenceMotionConfig;
  asChild?: boolean;
  forceMount?: boolean;
  placement?: Derivable<PopperPlacement | undefined>;
  sideOffset?: Derivable<number | undefined>;
  alignOffset?: Derivable<number | undefined>;
  collisionPadding?: Derivable<number | undefined>;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type SelectItemProps = {
  value: string;
  /** The text `Select.Value` shows for this item. Defaults to `value`. */
  textValue?: string;
  asChild?: boolean;
  disabled?: Derivable<boolean | undefined>;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type SelectGroupProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type SelectSeparatorProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type SelectLabelProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextLabel>;

export type SelectValueProps = {
  asChild?: boolean;
  placeholder?: string;
  children?: Vide.Node;
} & PassthroughProps<TextLabel>;
