import type { DialogCore } from "@lattice-ui/core-dialog";
import type { LayerInteractEvent } from "@lattice-ui/react-layer";
import type { PresenceMotionConfig } from "@lattice-ui/react-motion";
import type { PassthroughProps } from "@lattice-ui/react-runtime";
import type React from "@rbxts/react";

export type DialogSetOpen = (open: boolean) => void;

export type DialogContextValue = {
  open: boolean;
  setOpen: DialogSetOpen;
  modal: boolean;
  /** The core, for the parts that need its specs rather than the open flag. */
  core: DialogCore;
};

export type DialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  children?: React.ReactNode;
};

export type DialogTriggerProps = {
  asChild?: boolean;
  disabled?: boolean;
  children?: React.ReactElement;
} & PassthroughProps<TextButton>;

export type DialogPortalProps = {
  container?: BasePlayerGui;
  displayOrderBase?: number;
  children?: React.ReactNode;
};

export type DialogOverlayProps = {
  asChild?: boolean;
  forceMount?: boolean;
  children?: React.ReactElement;
} & PassthroughProps<TextButton>;

export type DialogContentProps = {
  asChild?: boolean;
  transition?: PresenceMotionConfig;
  forceMount?: boolean;
  trapFocus?: boolean;
  restoreFocus?: boolean;
  onPointerDownOutside?: (event: LayerInteractEvent) => void;
  onInteractOutside?: (event: LayerInteractEvent) => void;
  children?: React.ReactNode;
} & PassthroughProps<Frame>;

export type DialogCloseProps = {
  asChild?: boolean;
  children?: React.ReactElement;
} & PassthroughProps<TextButton>;
