import type { ToggleGroupCore } from "@lattice-ui/core-toggle-group";
import type { PassthroughProps } from "@lattice-ui/react-runtime";
import type React from "@rbxts/react";

export type ToggleGroupType = "single" | "multiple";
export type ToggleGroupValue = string | string[];

export type ToggleGroupCommonProps = {
  disabled?: boolean;
  asChild?: boolean;
  children?: React.ReactNode;
} & PassthroughProps<Frame>;

export type ToggleGroupSingleProps = {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
};

export type ToggleGroupMultipleProps = {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type ToggleGroupProps = ToggleGroupCommonProps & (ToggleGroupSingleProps | ToggleGroupMultipleProps);

export type ToggleGroupContextValue = {
  type: ToggleGroupType;
  disabled: boolean;
  isPressed: (itemValue: string) => boolean;
  toggleValue: (itemValue: string) => void;
  /** The core, for the parts that build an item rather than read the group's state. */
  core: ToggleGroupCore;
};

export type ToggleGroupItemProps = {
  value: string;
  disabled?: boolean;
  asChild?: boolean;
  children?: React.ReactElement;
} & PassthroughProps<TextButton>;
