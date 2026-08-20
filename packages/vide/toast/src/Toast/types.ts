import type { ToastCore, ToastOptions, ToastRecord } from "@lattice-ui/core-toast";
import type { PresenceMotionConfig } from "@lattice-ui/vide-motion";
import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

// `useToast` hands back the queue itself, so a consumer has to be able to name its type.
export type { ToastCore, ToastOptions, ToastRecord };

export type ToastProviderProps = {
  defaultDurationMs?: Derivable<number | undefined>;
  maxVisible?: Derivable<number | undefined>;
  /** Written as a function, so the parts read the toast context after the provider provides it. */
  children?: Vide.Node;
};

export type ToastViewportProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type ToastRootProps = {
  transition?: PresenceMotionConfig;
  asChild?: boolean;
  visible?: Derivable<boolean | undefined>;
  onExitComplete?: () => void;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type ToastTitleProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextLabel>;

export type ToastDescriptionProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextLabel>;

export type ToastActionProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type ToastCloseProps = {
  /** Which toast this closes. */
  toastId: string;
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;
