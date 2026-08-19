import type { MotionStateTargets } from "@lattice-ui/core-motion";
import type { Derivable, ElementSpec } from "@lattice-ui/core-runtime";

export type SliderOrientation = "horizontal" | "vertical";
export type SliderSetValue = (value: number) => void;
export type SliderCommitValue = (value: number) => void;

export interface SliderOptions {
  value?: Derivable<number | undefined>;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Fired when a drag or a key press finishes, which is separate from every intermediate value. */
  onValueCommit?: (value: number) => void;
  min?: Derivable<number | undefined>;
  max?: Derivable<number | undefined>;
  step?: Derivable<number | undefined>;
  orientation?: Derivable<SliderOrientation | undefined>;
  disabled?: Derivable<boolean | undefined>;
}

export interface SliderCore {
  value: () => number;
  setValue: SliderSetValue;
  commitValue: SliderCommitValue;
  min: () => number;
  max: () => number;
  step: () => number;
  orientation: () => SliderOrientation;
  disabled: () => boolean;
  /** True while a pointer drag is in flight, which motion uses to drop its settle. */
  isDragging: () => boolean;
  /** How far along the track the value sits, 0..1. */
  percent: () => number;

  setTrack: (instance: Instance | undefined) => void;
  setThumb: (instance: Instance | undefined) => void;
  /** Begins a pointer drag. Ignored for anything that is not a press or a touch. */
  startDrag: (inputObject: InputObject) => void;

  trackSpec: () => ElementSpec<Frame>;
  rangeSpec: () => ElementSpec<Frame>;
  /** Where the filled range sits and how big it is — geometry computed from the value. */
  rangeGeometry: () => MotionStateTargets;
  thumbSpec: () => ElementSpec<TextButton>;
  thumbGeometry: () => MotionStateTargets;
  /** Whether an arrow key along this axis adjusts the value rather than moving focus. */
  capturesDirectional: (direction: string) => boolean;
}
