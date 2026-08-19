import type { Derivable, ElementSpec } from "@lattice-ui/core-runtime";

export type TooltipSetOpen = (open: boolean) => void;

export interface TooltipDelayPolicy {
  /** The delay to use for this open, given how recently another tooltip was shown. */
  resolveOpenDelay: (requestedDelay?: number) => number;
  /** Records that a tooltip opened, which is what starts the skip window. */
  markOpen: () => void;
}

export interface TooltipProviderOptions {
  delayDuration?: Derivable<number | undefined>;
  /** How long after one tooltip closes another opens without waiting the full delay. */
  skipDelayDuration?: Derivable<number | undefined>;
}

export interface TooltipOptions {
  open?: Derivable<boolean | undefined>;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: Derivable<number | undefined>;
  /** The shared delay policy. Omit for a tooltip outside a provider. */
  policy?: TooltipDelayPolicy;
}

export interface TooltipTriggerOptions {
  disabled?: Derivable<boolean | undefined>;
}

export interface TooltipTriggerCore {
  disabled: () => boolean;
  spec: () => ElementSpec<TextButton>;
  /** Clears hover and focus and closes, for a trigger that becomes disabled while open. */
  reset: () => void;
}

export interface TooltipCore {
  open: () => boolean;
  setOpen: TooltipSetOpen;
  /** Opens after the resolved delay, which is how hover opens a tooltip. */
  openWithDelay: () => void;
  close: () => void;
  getTrigger: () => GuiObject | undefined;
  getContent: () => GuiObject | undefined;
  setTrigger: (instance: GuiObject | undefined) => void;
  setContent: (instance: GuiObject | undefined) => void;
  createTrigger: (options?: TooltipTriggerOptions) => TooltipTriggerCore;
  contentSpec: () => ElementSpec<Frame>;
}
