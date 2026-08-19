import type { MotionProperties, MotionStateTargets } from "@lattice-ui/core-motion";
import type { Derivable, ElementSpec } from "@lattice-ui/core-runtime";

export type SwitchSetChecked = (checked: boolean) => void;

export interface SwitchOptions {
  checked?: Derivable<boolean | undefined>;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: Derivable<boolean | undefined>;
}

export interface SwitchCore {
  checked: () => boolean;
  disabled: () => boolean;
  setChecked: SwitchSetChecked;
  toggle: () => void;
  rootSpec: () => ElementSpec<TextButton>;
  thumb: {
    spec: () => ElementSpec<Frame>;
    /**
     * Where the thumb parks in each state.
     *
     * Checked puts the thumb's trailing edge on the track's trailing edge, unchecked its leading
     * edge on the leading edge. `AnchorPoint` and `Position` interpolate together, so the travel
     * resolves to `t * (trackWidth - thumbWidth)` for any thumb width — the primitive never has to
     * know how wide the consumer made it. The same pairing on the Y axis centers the thumb at any
     * track height, which the consumer could not correct for themselves because motion owns both
     * properties.
     */
    geometry: () => MotionStateTargets;
  };
}

export interface SwitchThumbGeometry extends MotionProperties {
  AnchorPoint: Vector2;
  Position: UDim2;
}
