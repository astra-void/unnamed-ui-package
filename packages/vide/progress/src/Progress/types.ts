import type { ResponseMotionConfig } from "@lattice-ui/vide-motion";
import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type ProgressProps = {
  value?: Derivable<number | undefined>;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: Derivable<number | undefined>;
  indeterminate?: Derivable<boolean | undefined>;
  /** Written as a function, so the indicator reads the progress context after Root provides it. */
  children?: Vide.Node;
};

export type ProgressIndicatorProps = {
  transition?: ResponseMotionConfig;
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type SpinnerProps = {
  asChild?: boolean;
  spinning?: Derivable<boolean | undefined>;
  speedDegPerSecond?: Derivable<number | undefined>;
  children?: Vide.Node;
} & PassthroughProps<Frame>;
