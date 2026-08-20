import type { Derivable, ElementSpec, Reactivity } from "@lattice-ui/core-runtime";
import type { ComboboxFilterFn } from "./logic";

export type { ComboboxFilterFn };

export type ComboboxSetOpen = (open: boolean) => void;
export type ComboboxSetValue = (value: string) => void;
export type ComboboxSetInputValue = (inputValue: string) => void;

export interface ComboboxItemRegistration {
  id: number;
  value: string;
  order: number;
  getGuiObject: () => GuiObject | undefined;
  getDisabled: () => boolean;
  getTextValue: () => string;
}

export interface ComboboxOptions {
  value?: Derivable<string | undefined>;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  inputValue?: Derivable<string | undefined>;
  defaultInputValue?: string;
  onInputValueChange?: (inputValue: string) => void;
  open?: Derivable<boolean | undefined>;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: Derivable<boolean | undefined>;
  readOnly?: Derivable<boolean | undefined>;
  required?: Derivable<boolean | undefined>;
  modal?: Derivable<boolean | undefined>;
  filterFn?: Derivable<ComboboxFilterFn | undefined>;
  focusInstance?: (instance: GuiObject | undefined) => void;
}

export interface ComboboxItemOptions {
  value: string;
  disabled?: Derivable<boolean | undefined>;
  getTextValue: () => string;
  getGuiObject: () => GuiObject | undefined;
}

export interface ComboboxItemCore {
  value: string;
  selected: () => boolean;
  disabled: () => boolean;
  highlighted: () => boolean;
  /** Whether the current query matches this item, which is what hides a filtered-out row. */
  visible: () => boolean;
  setFocused: (focused: boolean) => void;
  activate: () => void;
  spec: () => ElementSpec<TextButton>;
  register: () => void;
}

export interface ComboboxCore {
  open: () => boolean;
  setOpen: ComboboxSetOpen;
  value: () => string | undefined;
  setValue: ComboboxSetValue;
  inputValue: () => string;
  setInputValue: ComboboxSetInputValue;
  /** What the list filters against: the typed query while open, the settled input while closed. */
  queryValue: () => string;
  /** Puts the selected item's text back into the input. */
  syncInputFromValue: () => void;
  disabled: () => boolean;
  readOnly: () => boolean;
  required: () => boolean;
  modal: () => boolean;
  filterFn: () => ComboboxFilterFn;
  getItemText: (value: string) => string | undefined;
  registryRevision: () => number;
  /** Forces the value onto a selectable item while the list is open. */
  syncForcedValue: () => void;
  /** Runs the open/close transition: arming on open, and settling the input on close. */
  syncOpenState: () => void;

  getAnchor: () => GuiObject | undefined;
  getTrigger: () => GuiObject | undefined;
  getContent: () => GuiObject | undefined;
  getInput: () => TextBox | undefined;
  setAnchor: (instance: GuiObject | undefined) => void;
  setContent: (instance: GuiObject | undefined) => void;
  setInput: (instance: TextBox | undefined) => void;
  getInsideRoots: () => Array<GuiObject | undefined>;
  focusSelectedItem: () => void;
  /** Puts focus back on the input or trigger, which is where it goes when the list closes. */
  focusTrigger: () => void;

  createItem: (rx: Reactivity, options: ComboboxItemOptions) => ComboboxItemCore;
  triggerSpec: (options?: { disabled?: Derivable<boolean | undefined> }) => ElementSpec<TextButton>;
  inputSpec: () => ElementSpec<TextBox>;
  valueSpec: () => ElementSpec<TextLabel>;
  contentSpec: () => ElementSpec<Frame>;
  groupSpec: () => ElementSpec<Frame>;
  separatorSpec: () => ElementSpec<Frame>;
  labelSpec: () => ElementSpec<TextLabel>;
}
