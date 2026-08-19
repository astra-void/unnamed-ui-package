import type { Derivable, ElementSpec, Reactivity } from "@lattice-ui/core-runtime";

export type MenuSetOpen = (open: boolean) => void;

export interface MenuSelectEvent {
  defaultPrevented: boolean;
  preventDefault: () => void;
}

export interface MenuItemRegistration {
  id: number;
  order: number;
  getGuiObject: () => GuiObject | undefined;
  getDisabled: () => boolean;
}

export interface MenuOptions {
  open?: Derivable<boolean | undefined>;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Modal by default: a menu blocks what is behind it unless told otherwise. */
  modal?: Derivable<boolean | undefined>;
  /** How to move focus, injected because focus is a host concern rather than a framework one. */
  focusInstance?: (instance: GuiObject | undefined) => void;
}

export interface MenuItemOptions {
  disabled?: Derivable<boolean | undefined>;
  onSelect?: (event: MenuSelectEvent) => void;
  getGuiObject: () => GuiObject | undefined;
}

export interface MenuItemCore {
  disabled: () => boolean;
  /** True while the pointer is on the item or managed focus is, tracked apart so neither clears the other. */
  highlighted: () => boolean;
  setFocused: (focused: boolean) => void;
  /** Runs the item's selection, closing the menu unless the consumer prevents it. */
  activate: () => void;
  spec: () => ElementSpec<TextButton>;
  register: () => void;
}

export interface MenuCore {
  open: () => boolean;
  setOpen: MenuSetOpen;
  modal: () => boolean;
  getTrigger: () => GuiObject | undefined;
  getContent: () => GuiObject | undefined;
  /** The trigger, for the dismissable layer's inside test. */
  getInsideRoots: () => Array<GuiObject | undefined>;
  setTrigger: (instance: GuiObject | undefined) => void;
  setContent: (instance: GuiObject | undefined) => void;
  /** Moves focus to the first enabled item, which is what opening a menu does. */
  focusFirstItem: () => void;
  restoreTriggerFocus: () => void;
  /**
   * Builds an item on the caller's own reactivity.
   *
   * The item's highlight lives in its own sources rather than the menu's, so a hover or a focus
   * change re-renders the item that changed instead of the menu that contains it — which in React
   * would not re-render the item at all.
   */
  createItem: (rx: Reactivity, options: MenuItemOptions) => MenuItemCore;
  triggerSpec: (options?: { disabled?: Derivable<boolean | undefined> }) => ElementSpec<TextButton>;
  contentSpec: () => ElementSpec<Frame>;
  groupSpec: () => ElementSpec<Frame>;
  separatorSpec: () => ElementSpec<Frame>;
  labelSpec: () => ElementSpec<TextLabel>;
}
