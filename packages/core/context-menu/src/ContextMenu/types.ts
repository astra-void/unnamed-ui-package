import type { MenuItemCore, MenuItemOptions, MenuSelectEvent } from "@lattice-ui/core-menu";
import type { Derivable, ElementSpec, Reactivity } from "@lattice-ui/core-runtime";

export type { MenuItemCore as ContextMenuItemCore, MenuItemOptions as ContextMenuItemOptions, MenuSelectEvent };

export type ContextMenuSetOpen = (open: boolean) => void;

export interface ContextMenuOptions {
  open?: Derivable<boolean | undefined>;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: Derivable<boolean | undefined>;
  focusInstance?: (instance: GuiObject | undefined) => void;
}

export interface ContextMenuCore {
  open: () => boolean;
  setOpen: ContextMenuSetOpen;
  modal: () => boolean;
  /**
   * Where the menu was invoked, in the same inset-adjusted space as `GuiObject.AbsolutePosition`.
   * The content mounts a 1x1 virtual anchor here so the shared popper can place and flip against
   * the viewport exactly as it does for a real anchor.
   */
  anchorPosition: () => Vector2;
  openAtPosition: (position: Vector2) => void;
  getVirtualAnchor: () => GuiObject | undefined;
  setVirtualAnchor: (instance: GuiObject | undefined) => void;
  getContent: () => GuiObject | undefined;
  setContent: (instance: GuiObject | undefined) => void;
  getInsideRoots: () => Array<GuiObject | undefined>;
  focusFirstItem: () => void;
  restoreTriggerFocus: () => void;
  createItem: (rx: Reactivity, options: MenuItemOptions) => MenuItemCore;
  triggerSpec: (options?: { disabled?: Derivable<boolean | undefined> }) => ElementSpec<TextButton>;
  contentSpec: () => ElementSpec<Frame>;
  groupSpec: () => ElementSpec<Frame>;
  separatorSpec: () => ElementSpec<Frame>;
  labelSpec: () => ElementSpec<TextLabel>;
}
