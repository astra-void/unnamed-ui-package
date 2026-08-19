import { createControllableState, type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import type { SwitchCore, SwitchOptions, SwitchThumbGeometry } from "./types";

// Roblox instance defaults are themselves a look: a bare `textbutton` renders an opaque grey box
// labelled "Button". Neutralize only that; adapters spread these before consumer props.
const ROOT_NEUTRAL: Partial<WritableInstanceProperties<TextButton>> = {
  AutoButtonColor: false,
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

const THUMB_NEUTRAL: Partial<WritableInstanceProperties<Frame>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
};

const CHECKED_THUMB_GEOMETRY: SwitchThumbGeometry = {
  AnchorPoint: new Vector2(1, 0.5),
  Position: UDim2.fromScale(1, 0.5),
};

const UNCHECKED_THUMB_GEOMETRY: SwitchThumbGeometry = {
  AnchorPoint: new Vector2(0, 0.5),
  Position: UDim2.fromScale(0, 0.5),
};

const THUMB_GEOMETRY = {
  active: CHECKED_THUMB_GEOMETRY,
  inactive: UNCHECKED_THUMB_GEOMETRY,
};

/** Switch behavior, free of any UI framework. */
export function createSwitch(rx: Reactivity, options: SwitchOptions = {}): SwitchCore {
  const state = createControllableState<boolean>(rx, {
    value: options.checked,
    defaultValue: options.defaultChecked ?? false,
    onChange: options.onCheckedChange,
  });

  function disabled() {
    return read(options.disabled ?? false) === true;
  }

  function setChecked(nextChecked: boolean) {
    if (disabled()) {
      return;
    }

    state.set(nextChecked);
  }

  function toggle() {
    if (disabled()) {
      return;
    }

    state.set(!state.get());
  }

  function rootSpec(): ElementSpec<TextButton> {
    return {
      neutral: ROOT_NEUTRAL,
      props: {
        Active: () => !disabled(),
        Selectable: () => !disabled(),
      },
      events: { Activated: toggle },
    };
  }

  return {
    checked: state.get,
    disabled,
    setChecked,
    toggle,
    rootSpec,
    thumb: {
      spec: () => ({ neutral: THUMB_NEUTRAL }),
      geometry: () => THUMB_GEOMETRY,
    },
  };
}
