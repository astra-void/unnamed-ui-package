import { createControllableState, type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import type { CheckboxCore, CheckboxOptions, CheckedState } from "./types";

// Roblox instance defaults are themselves a look: a bare `textbutton` renders an opaque grey box
// labelled "Button". Neutralize only that, and leave every real appearance decision (colors, size,
// fonts, text) to the consumer. Adapters spread these before consumer props, so they stay overridable.
const ROOT_NEUTRAL: Partial<WritableInstanceProperties<TextButton>> = {
  AutoButtonColor: false,
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

const INDICATOR_NEUTRAL: Partial<WritableInstanceProperties<Frame>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
};

function getNextCheckedState(checked: CheckedState): CheckedState {
  if (checked === "indeterminate") {
    return true;
  }

  return !checked;
}

/**
 * Checkbox behavior, free of any UI framework.
 *
 * Pure to construct: no side effects run here, which is what lets Vide's strict mode call a
 * component twice and lets React build the core inside a ref without a render-phase surprise.
 */
export function createCheckbox(rx: Reactivity, options: CheckboxOptions = {}): CheckboxCore {
  const state = createControllableState<CheckedState>(rx, {
    value: options.checked,
    defaultValue: options.defaultChecked ?? false,
    onChange: options.onCheckedChange,
  });

  function disabled() {
    return read(options.disabled ?? false) === true;
  }

  function required() {
    return read(options.required ?? false) === true;
  }

  function setChecked(nextChecked: CheckedState) {
    if (disabled()) {
      return;
    }

    state.set(nextChecked);
  }

  function toggle() {
    if (disabled()) {
      return;
    }

    state.set(getNextCheckedState(state.get()));
  }

  function rootSpec(): ElementSpec<TextButton> {
    return {
      neutral: ROOT_NEUTRAL,
      props: {
        Active: () => !disabled(),
        Selectable: () => !disabled(),
      },
      events: {
        Activated: toggle,
      },
    };
  }

  function indicatorSpec(): ElementSpec<Frame> {
    return { neutral: INDICATOR_NEUTRAL };
  }

  return {
    checked: state.get,
    disabled,
    required,
    setChecked,
    toggle,
    rootSpec,
    indicator: {
      present: () => state.get() !== false,
      spec: indicatorSpec,
    },
  };
}
