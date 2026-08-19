import type { SwitchSetChecked } from "@lattice-ui/core-switch";
import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type { SwitchSetChecked };

export type SwitchProps = {
  checked?: Derivable<boolean | undefined>;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: Derivable<boolean | undefined>;
  asChild?: boolean;
  /** Written as a function, so the thumb reads the switch context after this component provides it. */
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type SwitchThumbProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;
