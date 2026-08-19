import type { Derivable, ElementSpec } from "@lattice-ui/core-runtime";

export type ToggleGroupType = "single" | "multiple";
export type ToggleGroupValue = string | string[];

export interface ToggleGroupOptions {
  type: ToggleGroupType;
  disabled?: Derivable<boolean | undefined>;
  /** Single mode: the pressed value, or undefined for none. */
  value?: Derivable<string | undefined>;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  /** Multiple mode: the pressed values. */
  values?: Derivable<string[] | undefined>;
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
}

export interface ToggleGroupItemOptions {
  value: string;
  disabled?: Derivable<boolean | undefined>;
}

export interface ToggleGroupItemCore {
  disabled: () => boolean;
  pressed: () => boolean;
  spec: () => ElementSpec<TextButton>;
}

export interface ToggleGroupCore {
  type: () => ToggleGroupType;
  disabled: () => boolean;
  isPressed: (itemValue: string) => boolean;
  toggleValue: (itemValue: string) => void;
  rootSpec: () => ElementSpec<Frame>;
  /**
   * Builds an item, once.
   *
   * A factory rather than a per-render spec: the item owns an activation guard, and a guard
   * re-created between the paired events of one activation would let the second one through — which
   * is the double-toggle the guard exists to stop.
   */
  createItem: (options: ToggleGroupItemOptions) => ToggleGroupItemCore;
}
