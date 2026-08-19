import type { Derivable, ElementSpec } from "@lattice-ui/core-runtime";

export type CheckedState = boolean | "indeterminate";

export type CheckboxSetChecked = (checked: CheckedState) => void;

export interface CheckboxOptions {
  /** Controlled value. Pass a getter so the core sees the caller's current value, not a snapshot. */
  checked?: Derivable<CheckedState | undefined>;
  defaultChecked?: CheckedState;
  disabled?: Derivable<boolean | undefined>;
  required?: Derivable<boolean | undefined>;
  /**
   * Captured once, so adapters that re-create the callback (React re-renders) must pass a stable
   * wrapper dispatching to the current one.
   */
  onCheckedChange?: (checked: CheckedState) => void;
}

export interface CheckboxCore {
  // Property syntax rather than method syntax throughout: roblox-ts compiles a method declaration
  // to a colon-call with an implicit `self`, so assigning a plain function to one is an error.
  checked: () => CheckedState;
  disabled: () => boolean;
  required: () => boolean;
  setChecked: CheckboxSetChecked;
  toggle: () => void;
  /** What the root renders, described without reference to a framework. */
  rootSpec: () => ElementSpec<TextButton>;
  indicator: {
    /** Whether the indicator represents a checked or indeterminate box. */
    present: () => boolean;
    spec: () => ElementSpec<Frame>;
  };
}
