import type { SwitchCore, SwitchSetChecked } from "@lattice-ui/core-switch";
import type { PassthroughProps } from "@lattice-ui/react-runtime";
import type React from "@rbxts/react";

export type { SwitchSetChecked };

export type SwitchContextValue = {
  checked: boolean;
  setChecked: SwitchSetChecked;
  disabled: boolean;
  /** The core, for the parts that need its geometry rather than a rendered value. */
  core: SwitchCore;
};

export type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  asChild?: boolean;
  children?: React.ReactNode;
} & PassthroughProps<TextButton>;

export type SwitchThumbProps = {
  asChild?: boolean;
  children?: React.ReactNode;
} & PassthroughProps<Frame>;
