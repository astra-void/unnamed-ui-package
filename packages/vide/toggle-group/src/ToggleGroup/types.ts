import type { ToggleGroupType } from "@lattice-ui/core-toggle-group";
import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type { ToggleGroupType };

export type ToggleGroupCommonProps = {
  disabled?: Derivable<boolean | undefined>;
  asChild?: boolean;
  /** Written as a function, so items read the group context after Root provides it. */
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type ToggleGroupSingleProps = {
  type: "single";
  value?: Derivable<string | undefined>;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
};

export type ToggleGroupMultipleProps = {
  type: "multiple";
  value?: Derivable<string[] | undefined>;
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type ToggleGroupProps = ToggleGroupCommonProps & (ToggleGroupSingleProps | ToggleGroupMultipleProps);

export type ToggleGroupItemProps = {
  value: string;
  disabled?: Derivable<boolean | undefined>;
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;
