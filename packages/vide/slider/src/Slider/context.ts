import type { SliderCore } from "@lattice-ui/core-slider";
import { Vide } from "@lattice-ui/vide-runtime";

export const SliderContext = Vide.context<SliderCore>();

export function useSliderContext(): SliderCore {
  const core = SliderContext() as SliderCore | undefined;

  if (core === undefined) {
    error("[Slider] context is undefined. Render this inside <Slider.Root>.");
  }

  return core;
}
