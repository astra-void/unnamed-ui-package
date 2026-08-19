import { createControllableState, type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import { clampProgressValue, resolveProgressRatio } from "./math";
import type { ProgressCore, ProgressOptions } from "./types";

// Roblox instance defaults are themselves a look. Neutralize only those; adapters spread them
// before consumer props so they stay overridable.
const INDICATOR_NEUTRAL: Partial<WritableInstanceProperties<Frame>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
};

// Geometry, not decoration: the fill ratio is this element's width, motion animates `Size` on the
// same instance, and clipping keeps oversized content inside the fill. Adapters spread these after
// the consumer's props so the value mapping cannot be overwritten by accident.
const INDICATOR_FILL: Partial<WritableInstanceProperties<Frame>> = {
  ClipsDescendants: true,
  Position: UDim2.fromScale(0, 0),
  Size: UDim2.fromScale(0, 1),
};

// An indeterminate bar shows a fixed-width sliver rather than a value.
const INDETERMINATE_WIDTH_SCALE = 0.35;

/** Progress behavior, free of any UI framework. */
export function createProgress(rx: Reactivity, options: ProgressOptions = {}): ProgressCore {
  const state = createControllableState<number>(rx, {
    value: options.value,
    defaultValue: options.defaultValue ?? 0,
    onChange: options.onValueChange,
  });

  function max() {
    return math.max(1, read(options.max ?? 100) ?? 100);
  }

  function indeterminate() {
    return read(options.indeterminate ?? false) === true;
  }

  function value() {
    return clampProgressValue(state.get(), max());
  }

  function ratio() {
    return resolveProgressRatio(value(), max(), indeterminate());
  }

  function indicatorSpec(): ElementSpec<Frame> {
    return { neutral: INDICATOR_NEUTRAL, props: INDICATOR_FILL };
  }

  return {
    value,
    max,
    ratio,
    indeterminate,
    indicator: {
      spec: indicatorSpec,
      geometry: () => {
        const widthScale = indeterminate() ? INDETERMINATE_WIDTH_SCALE : ratio();
        const fill = { Size: UDim2.fromScale(widthScale, 1) };

        // The fill does not toggle between two states; it settles onto the current ratio, so both
        // states are the same target.
        return { active: fill, inactive: fill };
      },
    },
  };
}
