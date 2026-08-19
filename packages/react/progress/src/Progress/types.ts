import type { ProgressCore } from "@lattice-ui/core-progress";
import type { ResponseMotionConfig as MotionConfig } from "@lattice-ui/react-motion";
import type { PassthroughProps } from "@lattice-ui/react-runtime";
import type React from "@rbxts/react";

export type ProgressContextValue = {
  value: number;
  max: number;
  ratio: number;
  indeterminate: boolean;
  /** The core, for the parts that need geometry rather than a rendered value. */
  core: ProgressCore;
};

export type ProgressProps = {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  indeterminate?: boolean;
  children?: React.ReactNode;
};

export type ProgressIndicatorProps = {
  transition?: MotionConfig;
  asChild?: boolean;
  children?: React.ReactNode;
} & PassthroughProps<Frame>;

export type SpinnerProps = {
  asChild?: boolean;
  spinning?: boolean;
  speedDegPerSecond?: number;
  children?: React.ReactNode;
} & PassthroughProps<Frame>;
