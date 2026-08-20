import type { Derivable, ElementSpec, Reactivity } from "@lattice-ui/core-runtime";

export type SelectSetOpen = (open: boolean) => void;
export type SelectSetValue = (value: string) => void;

export interface SelectItemRegistration {
  id: number;
  value: string;
  order: number;
  getGuiObject: () => GuiObject | undefined;
  getDisabled: () => boolean;
  getTextValue: () => string;
}

export interface SelectOptions {
  value?: Derivable<string | undefined>;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: Derivable<boolean | undefined>;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: Derivable<boolean | undefined>;
  required?: Derivable<boolean | undefined>;
  modal?: Derivable<boolean | undefined>;
  focusInstance?: (instance: GuiObject | undefined) => void;
}

export interface SelectTriggerOptions {
  disabled?: Derivable<boolean | undefined>;
}

export interface SelectTriggerCore {
  disabled: () => boolean;
  spec: () => ElementSpec<TextButton>;
}

export interface SelectItemOptions {
  value: string;
  disabled?: Derivable<boolean | undefined>;
  /** The item's text, which `Select.Value` shows for the current selection. */
  getTextValue: () => string;
  getGuiObject: () => GuiObject | undefined;
}

export interface SelectItemCore {
  value: string;
  selected: () => boolean;
  disabled: () => boolean;
  highlighted: () => boolean;
  setFocused: (focused: boolean) => void;
  /** Chooses this item and closes the list. */
  activate: () => void;
  spec: () => ElementSpec<TextButton>;
  register: () => void;
}

export interface SelectCore {
  open: () => boolean;
  setOpen: SelectSetOpen;
  value: () => string | undefined;
  setValue: SelectSetValue;
  disabled: () => boolean;
  required: () => boolean;
  /** A select popup blocks what is behind it while open, as a menu does. */
  modal: () => boolean;
  /** The text of the current selection, for `Select.Value` to show. */
  getItemText: (value: string) => string | undefined;
  /**
   * Settles the value onto a selectable item.
   *
   * An empty registry means the list is closed rather than empty, so the current value is kept.
   */
  syncValue: () => void;
  /**
   * Bumped whenever an item registers or unregisters.
   *
   * Adapters settle the value once the batch has landed rather than per registration: resolving
   * after the first item alone would hand the selection to it, because the rest are not there yet.
   */
  registryRevision: () => number;
  getTrigger: () => GuiObject | undefined;
  getContent: () => GuiObject | undefined;
  setContent: (instance: GuiObject | undefined) => void;
  getInsideRoots: () => Array<GuiObject | undefined>;
  focusSelectedItem: () => void;
  /** Puts focus back on the trigger, which is where it goes when the list closes. */
  focusTrigger: () => void;
  createItem: (rx: Reactivity, options: SelectItemOptions) => SelectItemCore;
  /**
   * Builds the trigger, once.
   *
   * A factory rather than a per-render spec, for the same reason an item is: the trigger owns an
   * activation guard, and one re-created between the paired events of a single activation would let
   * the second through and toggle `open` straight back.
   */
  createTrigger: (options?: SelectTriggerOptions) => SelectTriggerCore;
  valueSpec: () => ElementSpec<TextLabel>;
  contentSpec: () => ElementSpec<Frame>;
  groupSpec: () => ElementSpec<Frame>;
  separatorSpec: () => ElementSpec<Frame>;
  labelSpec: () => ElementSpec<TextLabel>;
}
