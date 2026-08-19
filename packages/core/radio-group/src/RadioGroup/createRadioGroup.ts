import {
  findOrderedSelectionEntry,
  focusOrderedSelectionEntry,
  getRelativeOrderedSelectionEntry,
} from "@lattice-ui/core-focus";
import { createControllableState, type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import type {
  RadioGroupCore,
  RadioGroupItemCore,
  RadioGroupItemOptions,
  RadioGroupItemRegistration,
  RadioGroupOptions,
  RadioGroupOrientation,
} from "./types";

// Roblox instance defaults are themselves a look. Neutralize only those; adapters spread them
// before consumer props so they stay overridable.
const ITEM_NEUTRAL: Partial<WritableInstanceProperties<TextButton>> = {
  AutoButtonColor: false,
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

const INDICATOR_NEUTRAL: Partial<WritableInstanceProperties<Frame>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
};

// Item identity and document order are process-wide, matching how the React layer assigned them:
// order is the sequence items were first constructed in, which is their order in the tree.
let nextItemId = 0;
let nextItemOrder = 0;

/** Radio group behavior, free of any UI framework. */
export function createRadioGroup(rx: Reactivity, options: RadioGroupOptions = {}): RadioGroupCore {
  const state = createControllableState<string | undefined>(rx, {
    value: options.value,
    defaultValue: options.defaultValue,
    onChange: (nextValue) => {
      if (nextValue !== undefined) {
        options.onValueChange?.(nextValue);
      }
    },
  });

  const items: RadioGroupItemRegistration[] = [];

  function disabled() {
    return read(options.disabled ?? false) === true;
  }

  function orientation(): RadioGroupOrientation {
    return read(options.orientation ?? "vertical") ?? "vertical";
  }

  function setValue(nextValue: string) {
    if (disabled()) {
      return;
    }

    state.set(nextValue);
  }

  function moveSelection(fromValue: string, direction: -1 | 1) {
    const currentItem = findOrderedSelectionEntry(items, (item) => item.value === fromValue);
    const nextItem = getRelativeOrderedSelectionEntry(items, currentItem?.id, direction);

    if (nextItem === undefined) {
      return;
    }

    // Focus first: selection follows focus in a radio group, so the two have to land together.
    focusOrderedSelectionEntry(nextItem);
    setValue(nextItem.value);
  }

  /** Which arrow keys step the ring, given the group's orientation. */
  function directionFor(keyCode: Enum.KeyCode): -1 | 1 | undefined {
    if (orientation() === "horizontal") {
      if (keyCode === Enum.KeyCode.Left) {
        return -1;
      }

      return keyCode === Enum.KeyCode.Right ? 1 : undefined;
    }

    if (keyCode === Enum.KeyCode.Up) {
      return -1;
    }

    return keyCode === Enum.KeyCode.Down ? 1 : undefined;
  }

  function createItem(itemOptions: RadioGroupItemOptions): RadioGroupItemCore {
    nextItemId += 1;
    nextItemOrder += 1;
    const id = nextItemId;
    const order = nextItemOrder;

    function itemDisabled() {
      return disabled() || read(itemOptions.disabled ?? false) === true;
    }

    function checked() {
      return state.get() === itemOptions.value;
    }

    function selectItem() {
      if (itemDisabled()) {
        return;
      }

      setValue(itemOptions.value);
    }

    let registered = false;

    return {
      value: itemOptions.value,
      checked,
      disabled: itemDisabled,
      register: () => {
        if (registered) {
          return;
        }

        registered = true;
        items.push({
          id,
          value: itemOptions.value,
          order,
          getGuiObject: itemOptions.getGuiObject,
          getDisabled: itemDisabled,
        });

        rx.cleanup(() => {
          const index = items.findIndex((entry) => entry.id === id);
          if (index >= 0) {
            items.remove(index);
          }

          registered = false;
        });
      },
      spec: (): ElementSpec<TextButton> => ({
        neutral: ITEM_NEUTRAL,
        props: {
          Active: () => !itemDisabled(),
          Selectable: () => !itemDisabled(),
        },
        events: {
          Activated: selectItem,
          // Selection follows focus: reaching an item with the gamepad selects it.
          SelectionGained: selectItem,
          InputBegan: (_rbx: GuiObject, inputObject: InputObject) => {
            if (itemDisabled()) {
              return;
            }

            const direction = directionFor(inputObject.KeyCode);
            if (direction !== undefined) {
              moveSelection(itemOptions.value, direction);
              return;
            }

            const keyCode = inputObject.KeyCode;
            if (keyCode !== Enum.KeyCode.Return && keyCode !== Enum.KeyCode.Space) {
              return;
            }

            setValue(itemOptions.value);
          },
        },
      }),
      indicator: {
        present: checked,
        spec: () => ({ neutral: INDICATOR_NEUTRAL }),
      },
    };
  }

  return {
    value: state.get,
    setValue,
    disabled,
    required: () => read(options.required ?? false) === true,
    orientation,
    moveSelection,
    createItem,
  };
}
