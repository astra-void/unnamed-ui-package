import { createSlider } from "@lattice-ui/core-slider";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { SliderContextProvider } from "./context";
import type { SliderProps } from "./types";

export function SliderRoot(props: SliderProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createSlider(rx, {
      value: () => propsRef.current.value,
      defaultValue: propsRef.current.defaultValue,
      min: () => propsRef.current.min,
      max: () => propsRef.current.max,
      step: () => propsRef.current.step,
      orientation: () => propsRef.current.orientation,
      disabled: () => propsRef.current.disabled,
      onValueChange: (value) => propsRef.current.onValueChange?.(value),
      onValueCommit: (value) => propsRef.current.onValueCommit?.(value),
    }),
  );

  const value = core.value();
  const min = core.min();
  const max = core.max();
  const step = core.step();
  const orientation = core.orientation();
  const disabled = core.disabled();
  const isDragging = core.isDragging();

  const contextValue = React.useMemo(
    () => ({
      value,
      setValue: core.setValue,
      commitValue: core.commitValue,
      min,
      max,
      step,
      orientation,
      disabled,
      isDragging,
      setTrackNode: core.setTrack,
      setThumbNode: core.setThumb,
      startDrag: core.startDrag,
      core,
    }),
    [core, disabled, isDragging, max, min, orientation, step, value],
  );

  return <SliderContextProvider value={contextValue}>{props.children}</SliderContextProvider>;
}
