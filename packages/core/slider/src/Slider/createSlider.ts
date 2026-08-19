import { createControllableState, type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import {
  normalizeBounds,
  normalizeStep,
  pointerPositionToValue,
  snapValueToStep,
  valueToPercent,
} from "./internals/math";
import type { SliderCore, SliderOptions, SliderOrientation } from "./types";

const UserInputService = game.GetService("UserInputService");

// Roblox instance defaults are themselves a look. Neutralize only those; adapters spread them
// before consumer props so they stay overridable.
const FRAME_NEUTRAL: Partial<WritableInstanceProperties<Frame>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
};

const THUMB_NEUTRAL: Partial<WritableInstanceProperties<TextButton>> = {
  AutoButtonColor: false,
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

/** How many steps Page Up / Page Down move. */
const PAGE_STEP_MULTIPLIER = 10;

function toGuiObject(instance: Instance | undefined) {
  if (instance?.IsA("GuiObject") !== true) {
    return undefined;
  }

  return instance;
}

function isPointerStartInput(inputObject: InputObject) {
  return (
    inputObject.UserInputType === Enum.UserInputType.MouseButton1 ||
    inputObject.UserInputType === Enum.UserInputType.Touch
  );
}

/** Slider behavior, free of any UI framework: value mapping, dragging, and keyboard adjustment. */
export function createSlider(rx: Reactivity, options: SliderOptions = {}): SliderCore {
  function bounds() {
    return normalizeBounds(read(options.min ?? 0) ?? 0, read(options.max ?? 100) ?? 100);
  }

  function step() {
    return normalizeStep(read(options.step ?? 1) ?? 1);
  }

  function orientation(): SliderOrientation {
    return read(options.orientation ?? "horizontal") ?? "horizontal";
  }

  function disabled() {
    return read(options.disabled ?? false) === true;
  }

  const initialBounds = bounds();
  const state = createControllableState<number>(rx, {
    value: options.value,
    defaultValue: snapValueToStep(
      options.defaultValue ?? initialBounds.min,
      initialBounds.min,
      initialBounds.max,
      normalizeStep(read(options.step ?? 1) ?? 1),
    ),
    onChange: options.onValueChange,
  });

  const draggingSource = rx.source(false);

  let track: GuiObject | undefined;
  let thumb: GuiObject | undefined;
  let activeDragInput: InputObject | undefined;
  let moveConnection: RBXScriptConnection | undefined;
  let endConnection: RBXScriptConnection | undefined;
  // The value the drag last produced. Read at the end of a drag, where the state source may not have
  // been adopted by a controlled caller.
  let latestValue = state.get();

  function value() {
    const currentBounds = bounds();
    return snapValueToStep(state.get(), currentBounds.min, currentBounds.max, step());
  }

  function setValue(nextValue: number) {
    if (disabled()) {
      return;
    }

    const currentBounds = bounds();
    const normalized = snapValueToStep(nextValue, currentBounds.min, currentBounds.max, step());
    latestValue = normalized;
    state.set(normalized);
  }

  function commitValue(nextValue: number) {
    if (disabled()) {
      return;
    }

    const currentBounds = bounds();
    options.onValueCommit?.(snapValueToStep(nextValue, currentBounds.min, currentBounds.max, step()));
  }

  function disconnectDragging() {
    moveConnection?.Disconnect();
    moveConnection = undefined;
    endConnection?.Disconnect();
    endConnection = undefined;
    activeDragInput = undefined;
    draggingSource.set(false);
  }

  function updateValueFromInput(inputObject: InputObject) {
    if (track === undefined) {
      return undefined;
    }

    const currentBounds = bounds();
    const nextValue = pointerPositionToValue(
      new Vector2(inputObject.Position.X, inputObject.Position.Y),
      track.AbsolutePosition,
      track.AbsoluteSize,
      currentBounds.min,
      currentBounds.max,
      step(),
      orientation(),
    );

    setValue(nextValue);
    return nextValue;
  }

  function finishDrag(inputObject?: InputObject) {
    if (activeDragInput === undefined) {
      return;
    }

    if (inputObject !== undefined) {
      const nextValue = updateValueFromInput(inputObject);
      if (nextValue !== undefined) {
        latestValue = nextValue;
      }
    }

    commitValue(latestValue);
    disconnectDragging();
  }

  function startDrag(inputObject: InputObject) {
    if (disabled() || !isPointerStartInput(inputObject)) {
      return;
    }

    draggingSource.set(true);
    activeDragInput = inputObject;

    const initialValue = updateValueFromInput(inputObject);
    if (initialValue !== undefined) {
      latestValue = initialValue;
    }

    moveConnection?.Disconnect();
    endConnection?.Disconnect();

    moveConnection = UserInputService.InputChanged.Connect((changedInput) => {
      const drag = activeDragInput;
      if (drag === undefined) {
        return;
      }

      // A touch drag only follows its own finger; a mouse drag follows any movement.
      if (drag.UserInputType === Enum.UserInputType.Touch) {
        if (changedInput.UserInputType !== Enum.UserInputType.Touch || changedInput !== drag) {
          return;
        }
      } else if (changedInput.UserInputType !== Enum.UserInputType.MouseMovement) {
        return;
      }

      const nextValue = updateValueFromInput(changedInput);
      if (nextValue !== undefined) {
        latestValue = nextValue;
      }
    });

    endConnection = UserInputService.InputEnded.Connect((endedInput) => {
      const drag = activeDragInput;
      if (drag === undefined) {
        return;
      }

      const endedTouch = drag.UserInputType === Enum.UserInputType.Touch && endedInput === drag;
      const endedMouse =
        drag.UserInputType === Enum.UserInputType.MouseButton1 &&
        endedInput.UserInputType === Enum.UserInputType.MouseButton1;

      if (!endedTouch && !endedMouse) {
        return;
      }

      finishDrag(endedTouch ? endedInput : undefined);
    });
  }

  function percent() {
    const currentBounds = bounds();
    return valueToPercent(value(), currentBounds.min, currentBounds.max);
  }

  function isHorizontal() {
    return orientation() === "horizontal";
  }

  function handleThumbInput(inputObject: InputObject) {
    if (isPointerStartInput(inputObject)) {
      startDrag(inputObject);
      return;
    }

    if (disabled()) {
      return;
    }

    const currentBounds = bounds();
    const currentStep = step();
    const keyCode = inputObject.KeyCode;
    const pageStep = currentStep * PAGE_STEP_MULTIPLIER;

    // Only the value axis adjusts the slider; the cross axis is left for the navigation controller
    // to move focus away from the thumb.
    const incrementKey = isHorizontal() ? Enum.KeyCode.Right : Enum.KeyCode.Up;
    const decrementKey = isHorizontal() ? Enum.KeyCode.Left : Enum.KeyCode.Down;

    let nextValue: number | undefined;

    if (keyCode === Enum.KeyCode.Home) {
      nextValue = currentBounds.min;
    } else if (keyCode === Enum.KeyCode.End) {
      nextValue = currentBounds.max;
    } else if (keyCode === Enum.KeyCode.PageUp) {
      nextValue = value() + pageStep;
    } else if (keyCode === Enum.KeyCode.PageDown) {
      nextValue = value() - pageStep;
    } else if (keyCode === incrementKey) {
      nextValue = value() + currentStep;
    } else if (keyCode === decrementKey) {
      nextValue = value() - currentStep;
    } else if (keyCode === Enum.KeyCode.Return || keyCode === Enum.KeyCode.Space) {
      commitValue(value());
      return;
    } else {
      return;
    }

    setValue(nextValue);
    commitValue(nextValue);
  }

  rx.cleanup(disconnectDragging);

  return {
    value,
    setValue,
    commitValue,
    min: () => bounds().min,
    max: () => bounds().max,
    step,
    orientation,
    disabled,
    isDragging: () => draggingSource.get(),
    percent,

    setTrack: (instance) => {
      track = toGuiObject(instance);
    },
    setThumb: (instance) => {
      thumb = toGuiObject(instance);
    },
    startDrag,

    trackSpec: (): ElementSpec<Frame> => ({
      neutral: FRAME_NEUTRAL,
      events: {
        InputBegan: ((_rbx: GuiObject, inputObject: InputObject) => {
          startDrag(inputObject);
        }) as Callback,
      },
      refs: [
        (instance) => {
          track = toGuiObject(instance);
        },
      ],
    }),
    rangeSpec: () => ({ neutral: FRAME_NEUTRAL }),
    rangeGeometry: () => {
      const filled = percent();
      // Position and Size are the value mapping, not decoration, so motion owns them here.
      const geometry = isHorizontal()
        ? { Position: UDim2.fromScale(0, 0), Size: UDim2.fromScale(filled, 1) }
        : { Position: UDim2.fromScale(0, 1 - filled), Size: UDim2.fromScale(1, filled) };

      return { active: geometry, inactive: geometry };
    },
    thumbSpec: (): ElementSpec<TextButton> => ({
      neutral: THUMB_NEUTRAL,
      props: {
        Active: () => !disabled(),
        // Motion drives `Position` to the value point; the centered anchor is what makes that point
        // the middle of the thumb rather than its top-left corner.
        AnchorPoint: new Vector2(0.5, 0.5),
        Selectable: () => !disabled(),
      },
      events: {
        InputBegan: ((_rbx: GuiObject, inputObject: InputObject) => {
          handleThumbInput(inputObject);
        }) as Callback,
      },
      refs: [
        (instance) => {
          thumb = toGuiObject(instance);
        },
      ],
    }),
    thumbGeometry: () => {
      const filled = percent();
      const position = isHorizontal() ? UDim2.fromScale(filled, 0.5) : UDim2.fromScale(0.5, 1 - filled);

      return { active: { Position: position }, inactive: { Position: position } };
    },
    capturesDirectional: (direction) =>
      isHorizontal() ? direction === "left" || direction === "right" : direction === "up" || direction === "down",
  };
}
