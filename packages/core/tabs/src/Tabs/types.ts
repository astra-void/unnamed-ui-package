import type { Derivable, ElementSpec } from "@lattice-ui/core-runtime";

export type TabsSetValue = (value: string) => void;
export type TabsOrientation = "horizontal" | "vertical";

export interface TabsOptions {
  value?: Derivable<string | undefined>;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: Derivable<TabsOrientation | undefined>;
}

export interface TabsTriggerOptions {
  value: string;
  disabled?: Derivable<boolean | undefined>;
  getGuiObject: () => GuiObject | undefined;
}

export interface TabsTriggerRegistration {
  id: number;
  value: string;
  order: number;
  getGuiObject: () => GuiObject | undefined;
  getDisabled: () => boolean;
}

export interface TabsTriggerCore {
  value: string;
  selected: () => boolean;
  disabled: () => boolean;
  spec: () => ElementSpec<TextButton>;
  /** Joins the ordered ring the arrow keys step through. Leaves through the reactivity's cleanup. */
  register: () => void;
}

export interface TabsContentCore {
  value: string;
  selected: () => boolean;
  spec: () => ElementSpec<Frame>;
}

export interface TabsCore {
  value: () => string | undefined;
  setValue: TabsSetValue;
  orientation: () => TabsOrientation;
  moveSelection: (fromValue: string, direction: -1 | 1) => void;
  /**
   * Settles selection onto an enabled tab.
   *
   * Called when the set of triggers or their disabled state changes: a selected tab that goes away
   * or becomes disabled hands selection to the next enabled one after it, not to the first.
   */
  syncSelection: () => void;
  listSpec: () => ElementSpec<Frame>;
  createTrigger: (options: TabsTriggerOptions) => TabsTriggerCore;
  createContent: (value: string) => TabsContentCore;
}
