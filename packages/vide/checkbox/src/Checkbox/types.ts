import type { CheckboxSetChecked, CheckedState } from "@lattice-ui/core-checkbox";
import type { PresenceMotionConfig } from "@lattice-ui/core-motion";
import type { Derivable } from "@lattice-ui/core-runtime";
import type { PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type { CheckboxSetChecked, CheckedState };

/**
 * Every state prop is `Derivable`, which is the Vide shape: a caller passes a source directly and
 * the primitive stays bound to it, where the React layer takes a plain value each render.
 */
export type CheckboxProps = {
  checked?: Derivable<CheckedState | undefined>;
  defaultChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
  disabled?: Derivable<boolean | undefined>;
  required?: Derivable<boolean | undefined>;
  asChild?: boolean;
  /**
   * Children must be written as a function — `<Checkbox.Root>{() => <Checkbox.Indicator />}</Checkbox.Root>`.
   * Vide evaluates JSX children before the parent component runs, so an eagerly written child would
   * read the checkbox context before this component provides it.
   */
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type CheckboxIndicatorProps = {
  /** Opt into motion. Presence timing is the primitive's; the animation is yours. */
  transition?: PresenceMotionConfig;
  /** Keep the indicator mounted and drive `Visible` instead of unmounting it. */
  forceMount?: boolean;
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;
