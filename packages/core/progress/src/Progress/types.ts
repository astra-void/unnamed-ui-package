import type { MotionStateTargets } from "@lattice-ui/core-motion";
import type { Derivable, ElementSpec } from "@lattice-ui/core-runtime";

export interface ProgressOptions {
  value?: Derivable<number | undefined>;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: Derivable<number | undefined>;
  indeterminate?: Derivable<boolean | undefined>;
}

export interface SpinnerOptions {
  spinning?: Derivable<boolean | undefined>;
  speedDegPerSecond?: Derivable<number | undefined>;
}

export interface ProgressCore {
  /** The reported value, clamped into range. */
  value: () => number;
  max: () => number;
  /** How much of the track is filled, 0..1. Geometry computed from state, so it belongs here. */
  ratio: () => number;
  indeterminate: () => boolean;
  indicator: {
    spec: () => ElementSpec<Frame>;
    /** The fill geometry the indicator settles onto. Both states match: the fill has no toggle. */
    geometry: () => MotionStateTargets;
  };
}

export interface SpinnerCore {
  spinning: () => boolean;
  spec: () => ElementSpec<Frame>;
  /** The instance to rotate. Adapters hand it over from a ref or an action. */
  setInstance: (instance: GuiObject | undefined) => void;
  /** Starts the rotation loop. Idempotent; stops through the reactivity's cleanup. */
  start: () => void;
}
