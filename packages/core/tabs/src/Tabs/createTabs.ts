import {
  findOrderedSelectionEntry,
  focusOrderedSelectionEntry,
  getOrderedSelectionEntries,
  getRelativeOrderedSelectionEntry,
} from "@lattice-ui/core-focus";
import { createControllableState, type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import { createTabsContentName, createTabsTriggerName } from "./internals/ids";
import type {
  TabsContentCore,
  TabsCore,
  TabsOptions,
  TabsOrientation,
  TabsTriggerCore,
  TabsTriggerOptions,
  TabsTriggerRegistration,
} from "./types";

// Roblox instance defaults are themselves a look. Neutralize only those; adapters spread them
// before consumer props so they stay overridable.
const LIST_NEUTRAL: Partial<WritableInstanceProperties<Frame>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
};

const TRIGGER_NEUTRAL: Partial<WritableInstanceProperties<TextButton>> = {
  AutoButtonColor: false,
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

const CONTENT_NEUTRAL: Partial<WritableInstanceProperties<Frame>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
};

let nextTriggerId = 0;
let nextTriggerOrder = 0;

/**
 * Which tab selection should land on.
 *
 * A selected tab that is still enabled keeps selection. One that went away or became disabled hands
 * it to the next enabled tab *after* where it sat, so a disabled tab in the middle does not throw
 * the player back to the start.
 */
function resolveNextValue(
  currentValue: string | undefined,
  orderedTriggers: TabsTriggerRegistration[],
  fallbackOrder: number | undefined,
) {
  const enabled = orderedTriggers.filter((trigger) => !trigger.getDisabled());
  if (enabled.size() === 0) {
    return undefined;
  }

  if (currentValue === undefined) {
    return enabled[0]?.value;
  }

  const selectedEnabled = enabled.find((trigger) => trigger.value === currentValue);
  if (selectedEnabled !== undefined) {
    return selectedEnabled.value;
  }

  const selected = orderedTriggers.find((trigger) => trigger.value === currentValue);
  const anchorOrder = selected?.order ?? fallbackOrder;
  if (anchorOrder !== undefined) {
    const after = enabled.find((trigger) => trigger.order > anchorOrder);
    if (after !== undefined) {
      return after.value;
    }
  }

  return enabled[0]?.value;
}

/** Tabs behavior, free of any UI framework. */
export function createTabs(rx: Reactivity, options: TabsOptions = {}): TabsCore {
  const state = createControllableState<string | undefined>(rx, {
    value: options.value,
    defaultValue: options.defaultValue,
    onChange: (nextValue) => {
      if (nextValue !== undefined) {
        options.onValueChange?.(nextValue);
      }
    },
  });

  const triggers: TabsTriggerRegistration[] = [];
  const registryRevisionSource = rx.source(0);
  let lastSelectedOrder: number | undefined;

  function orientation(): TabsOrientation {
    return read(options.orientation ?? "horizontal") ?? "horizontal";
  }

  function setValue(nextValue: string) {
    const ordered = getOrderedSelectionEntries(triggers);
    const selected = ordered.find((trigger) => trigger.value === nextValue && !trigger.getDisabled());
    if (selected !== undefined) {
      lastSelectedOrder = selected.order;
    }

    state.set(nextValue);
  }

  function syncSelection() {
    const ordered = getOrderedSelectionEntries(triggers);
    const current = state.get();
    const selected = ordered.find((trigger) => trigger.value === current && !trigger.getDisabled());
    if (selected !== undefined) {
      lastSelectedOrder = selected.order;
    }

    const nextValue = resolveNextValue(current, ordered, lastSelectedOrder);
    if (nextValue !== current) {
      state.set(nextValue);
    }
  }

  function moveSelection(fromValue: string, direction: -1 | 1) {
    const currentTrigger = findOrderedSelectionEntry(triggers, (trigger) => trigger.value === fromValue);
    const nextTrigger = getRelativeOrderedSelectionEntry(triggers, currentTrigger?.id, direction);

    if (nextTrigger === undefined) {
      return;
    }

    // Focus first: selection follows focus in a tab list, so the two land together.
    focusOrderedSelectionEntry(nextTrigger);
    setValue(nextTrigger.value);
  }

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

  function createTrigger(triggerOptions: TabsTriggerOptions): TabsTriggerCore {
    nextTriggerId += 1;
    nextTriggerOrder += 1;
    const id = nextTriggerId;
    const order = nextTriggerOrder;
    let registered = false;

    function triggerDisabled() {
      return read(triggerOptions.disabled ?? false) === true;
    }

    function activate() {
      if (triggerDisabled()) {
        return;
      }

      setValue(triggerOptions.value);
    }

    return {
      value: triggerOptions.value,
      selected: () => state.get() === triggerOptions.value,
      disabled: triggerDisabled,
      register: () => {
        if (registered) {
          return;
        }

        registered = true;
        triggers.push({
          id,
          value: triggerOptions.value,
          order,
          getGuiObject: triggerOptions.getGuiObject,
          getDisabled: triggerDisabled,
        });
        registryRevisionSource.set(registryRevisionSource.get() + 1);

        rx.cleanup(() => {
          const index = triggers.findIndex((entry) => entry.id === id);
          if (index >= 0) {
            triggers.remove(index);
          }

          registered = false;
          registryRevisionSource.set(registryRevisionSource.get() + 1);
        });
      },
      spec: (): ElementSpec<TextButton> => ({
        neutral: TRIGGER_NEUTRAL,
        props: {
          Active: () => !triggerDisabled(),
          Selectable: () => !triggerDisabled(),
          // The name pairs the trigger with its panel, so it is wiring rather than appearance.
          Name: createTabsTriggerName(triggerOptions.value),
        },
        events: {
          Activated: activate,
          // Selection follows focus: reaching a trigger with the gamepad selects its tab.
          SelectionGained: activate,
          InputBegan: (_rbx: TextButton, inputObject: InputObject) => {
            if (triggerDisabled()) {
              return;
            }

            const direction = directionFor(inputObject.KeyCode);
            if (direction !== undefined) {
              moveSelection(triggerOptions.value, direction);
              return;
            }

            const keyCode = inputObject.KeyCode;
            if (keyCode !== Enum.KeyCode.Return && keyCode !== Enum.KeyCode.Space) {
              return;
            }

            setValue(triggerOptions.value);
          },
        },
      }),
    };
  }

  function createContent(value: string): TabsContentCore {
    return {
      value,
      selected: () => state.get() === value,
      spec: (): ElementSpec<Frame> => ({
        neutral: CONTENT_NEUTRAL,
        props: { Name: createTabsContentName(value) },
      }),
    };
  }

  return {
    value: state.get,
    setValue,
    orientation,
    moveSelection,
    syncSelection,
    registryRevision: () => registryRevisionSource.get(),
    listSpec: () => ({ neutral: LIST_NEUTRAL }),
    createTrigger,
    createContent,
  };
}
