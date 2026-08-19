import type { SliderOrientation } from "@lattice-ui/core-slider";
import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type { SliderOrientation };

export type SliderProps = {
  value?: Derivable<number | undefined>;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  min?: Derivable<number | undefined>;
  max?: Derivable<number | undefined>;
  step?: Derivable<number | undefined>;
  orientation?: Derivable<SliderOrientation | undefined>;
  disabled?: Derivable<boolean | undefined>;
  /** Written as a function, so the parts read the slider context after Root provides it. */
  children?: Vide.Node;
};

export type SliderTrackProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type SliderRangeProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type SliderThumbProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;
