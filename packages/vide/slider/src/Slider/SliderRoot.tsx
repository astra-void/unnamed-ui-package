import { createSlider } from "@lattice-ui/core-slider";
import { createVideReactivity } from "@lattice-ui/vide-runtime";
import { SliderContext } from "./context";
import type { SliderProps } from "./types";

export function SliderRoot(props: SliderProps) {
  const core = createSlider(createVideReactivity(), {
    value: props.value,
    defaultValue: props.defaultValue,
    min: props.min,
    max: props.max,
    step: props.step,
    orientation: props.orientation,
    disabled: props.disabled,
    onValueChange: props.onValueChange,
    onValueCommit: props.onValueCommit,
  });

  return SliderContext(core, () => props.children);
}
