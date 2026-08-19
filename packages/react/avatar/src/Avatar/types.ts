import type { AvatarCore, AvatarStatus } from "@lattice-ui/core-avatar";
import type { PassthroughProps } from "@lattice-ui/react-runtime";
import type React from "@rbxts/react";

export type AvatarContextValue = {
  src?: string;
  status: AvatarStatus;
  setStatus: (status: AvatarStatus) => void;
  delayElapsed: boolean;
  /** The core, for the parts that read load state rather than render it. */
  core: AvatarCore;
};

export type AvatarProps = {
  src?: string;
  delayMs?: number;
  children?: React.ReactNode;
};

export type AvatarImageProps = {
  asChild?: boolean;
  src?: string;
  children?: React.ReactElement;
} & PassthroughProps<ImageLabel>;

export type AvatarFallbackProps = {
  asChild?: boolean;
  children?: React.ReactElement;
} & PassthroughProps<TextLabel>;
