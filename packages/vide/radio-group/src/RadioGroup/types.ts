import type { RadioGroupOrientation } from "@lattice-ui/core-radio-group";
import type { PresenceMotionConfig } from "@lattice-ui/vide-motion";
import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type { RadioGroupOrientation };

export type RadioGroupProps = {
  value?: Derivable<string | undefined>;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: Derivable<boolean | undefined>;
  required?: Derivable<boolean | undefined>;
  orientation?: Derivable<RadioGroupOrientation | undefined>;
  /** Written as a function, so items read the group context after Root provides it. */
  children?: Vide.Node;
};

export type RadioGroupItemProps = {
  value: string;
  disabled?: Derivable<boolean | undefined>;
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type RadioGroupIndicatorProps = {
  transition?: PresenceMotionConfig;
  forceMount?: boolean;
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;
