import type { Derivable, ElementSpec } from "@lattice-ui/core-runtime";

export type PopoverSetOpen = (open: boolean) => void;

export interface PopoverOptions {
  open?: Derivable<boolean | undefined>;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: Derivable<boolean | undefined>;
  /**
   * How to move focus, injected because focus is a host concern rather than a framework one.
   *
   * The decision — focus the trigger before opening, so dismissal has somewhere to return to —
   * stays here; only the mechanism is the adapter's.
   */
  focusInstance?: (instance: GuiObject | undefined) => void;
}

export interface PopoverTriggerOptions {
  disabled?: Derivable<boolean | undefined>;
}

export interface PopoverCore {
  open: () => boolean;
  setOpen: PopoverSetOpen;
  modal: () => boolean;

  /**
   * The instances the popover positions against.
   *
   * A React ref, a Vide source and a plain upvalue are three spellings of the same thing, so the
   * core keeps the instances itself and each adapter hands them over as they mount.
   */
  setTrigger: (instance: GuiObject | undefined) => void;
  setAnchor: (instance: GuiObject | undefined) => void;
  setContent: (instance: GuiObject | undefined) => void;
  getTrigger: () => GuiObject | undefined;
  getAnchor: () => GuiObject | undefined;
  getContent: () => GuiObject | undefined;
  /** Trigger and anchor, for the dismissable layer's inside test. */
  getInsideRoots: () => Array<GuiObject | undefined>;

  triggerSpec: (options?: PopoverTriggerOptions) => ElementSpec<TextButton>;
  closeSpec: () => ElementSpec<TextButton>;
  anchorSpec: () => ElementSpec<Frame>;
  contentSpec: () => ElementSpec<Frame>;
}
