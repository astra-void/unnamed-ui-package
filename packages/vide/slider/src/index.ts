import { SliderRange } from "./Slider/SliderRange";
import { SliderRoot } from "./Slider/SliderRoot";
import { SliderThumb } from "./Slider/SliderThumb";
import { SliderTrack } from "./Slider/SliderTrack";

export const Slider = {
  Root: SliderRoot,
  Track: SliderTrack,
  Range: SliderRange,
  Thumb: SliderThumb,
} as const satisfies {
  Root: typeof SliderRoot;
  Track: typeof SliderTrack;
  Range: typeof SliderRange;
  Thumb: typeof SliderThumb;
};

export { useSliderContext } from "./Slider/context";
export type { SliderProps, SliderRangeProps, SliderThumbProps, SliderTrackProps } from "./Slider/types";
export { SliderRange, SliderRoot, SliderThumb, SliderTrack };
