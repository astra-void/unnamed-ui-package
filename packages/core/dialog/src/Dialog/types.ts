import type { Derivable, ElementSpec } from "@lattice-ui/core-runtime";

export type DialogSetOpen = (open: boolean) => void;

export interface DialogOptions {
  open?: Derivable<boolean | undefined>;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Modal by default: a dialog blocks what is behind it unless told otherwise. */
  modal?: Derivable<boolean | undefined>;
  /**
   * How to move focus, injected because focus is a host concern rather than a framework one. The
   * decision — focus the trigger before opening, so dismissal has somewhere to return to — is here.
   */
  focusInstance?: (instance: GuiObject | undefined) => void;
}

export interface DialogTriggerOptions {
  disabled?: Derivable<boolean | undefined>;
}

export interface DialogCore {
  open: () => boolean;
  setOpen: DialogSetOpen;
  modal: () => boolean;
  getTrigger: () => GuiObject | undefined;
  setTrigger: (instance: GuiObject | undefined) => void;
  triggerSpec: (options?: DialogTriggerOptions) => ElementSpec<TextButton>;
  closeSpec: () => ElementSpec<TextButton>;
  overlaySpec: () => ElementSpec<TextButton>;
  contentSpec: () => ElementSpec<Frame>;
}
