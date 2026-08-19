import type { Derivable, ElementSpec } from "@lattice-ui/core-runtime";

export type RadioGroupSetValue = (value: string) => void;
export type RadioGroupOrientation = "horizontal" | "vertical";

export interface RadioGroupOptions {
  value?: Derivable<string | undefined>;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: Derivable<boolean | undefined>;
  required?: Derivable<boolean | undefined>;
  orientation?: Derivable<RadioGroupOrientation | undefined>;
}

export interface RadioGroupItemOptions {
  value: string;
  disabled?: Derivable<boolean | undefined>;
  /** Where to read this item's instance from, for focus movement between items. */
  getGuiObject: () => GuiObject | undefined;
}

export interface RadioGroupItemCore {
  value: string;
  checked: () => boolean;
  disabled: () => boolean;
  spec: () => ElementSpec<TextButton>;
  /** Joins the group's ordered ring. Idempotent; leaves through the reactivity's cleanup. */
  register: () => void;
  indicator: {
    present: () => boolean;
    spec: () => ElementSpec<Frame>;
  };
}

export interface RadioGroupItemRegistration {
  id: number;
  value: string;
  order: number;
  getGuiObject: () => GuiObject | undefined;
  getDisabled: () => boolean;
}

export interface RadioGroupCore {
  value: () => string | undefined;
  setValue: RadioGroupSetValue;
  disabled: () => boolean;
  required: () => boolean;
  orientation: () => RadioGroupOrientation;
  /** Moves focus and selection to the next enabled item in `direction`. */
  moveSelection: (fromValue: string, direction: -1 | 1) => void;
  createItem: (options: RadioGroupItemOptions) => RadioGroupItemCore;
}
