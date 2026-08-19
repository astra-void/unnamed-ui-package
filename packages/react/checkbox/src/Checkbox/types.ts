import type { CheckboxSetChecked, CheckedState } from "@lattice-ui/core-checkbox";
import type { PresenceMotionConfig } from "@lattice-ui/react-motion";
import type { PassthroughProps } from "@lattice-ui/react-runtime";
import type React from "@rbxts/react";

export type { CheckboxSetChecked, CheckedState };

export type CheckboxContextValue = {
  checked: CheckedState;
  setChecked: CheckboxSetChecked;
  disabled: boolean;
  required: boolean;
};

export type CheckboxProps = {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
  disabled?: boolean;
  required?: boolean;
  asChild?: boolean;
  children?: React.ReactNode;
} & PassthroughProps<TextButton>;

export type CheckboxIndicatorProps = {
  transition?: PresenceMotionConfig;
  forceMount?: boolean;
  asChild?: boolean;
  children?: React.ReactNode;
} & PassthroughProps<Frame>;
