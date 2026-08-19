import { createActivationGuard } from "@lattice-ui/core-focus";
import { createControllableState, type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import type { ToggleGroupCore, ToggleGroupItemCore, ToggleGroupItemOptions, ToggleGroupOptions } from "./types";

// Roblox instance defaults are themselves a look. Neutralize only those; adapters spread them
// before consumer props so they stay overridable.
const ROOT_NEUTRAL: Partial<WritableInstanceProperties<Frame>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
};

const ITEM_NEUTRAL: Partial<WritableInstanceProperties<TextButton>> = {
  AutoButtonColor: false,
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

/** Drops duplicates and non-strings, so a caller's array cannot corrupt the pressed set. */
function normalizeValues(value: unknown): string[] {
  if (!typeIs(value, "table")) {
    return [];
  }

  const nextValues: string[] = [];
  const seenValues: Record<string, true> = {};

  for (const entry of value as unknown[]) {
    if (!typeIs(entry, "string")) {
      continue;
    }

    if (seenValues[entry]) {
      continue;
    }

    seenValues[entry] = true;
    nextValues.push(entry);
  }

  return nextValues;
}

/** Toggle group behavior, free of any UI framework. */
export function createToggleGroup(rx: Reactivity, options: ToggleGroupOptions): ToggleGroupCore {
  const single = createControllableState<string | undefined>(rx, {
    value: () => (options.type === "single" ? read(options.value ?? undefined) : undefined),
    defaultValue: options.type === "single" ? options.defaultValue : undefined,
    onChange: (nextValue) => {
      if (options.type === "single") {
        options.onValueChange?.(nextValue);
      }
    },
  });

  const multiple = createControllableState<string[]>(rx, {
    value: () => {
      if (options.type !== "multiple") {
        return undefined;
      }

      const current = read(options.values ?? undefined);
      return current !== undefined ? normalizeValues(current) : undefined;
    },
    defaultValue: options.type === "multiple" ? normalizeValues(options.defaultValues ?? []) : [],
    onChange: (nextValues) => {
      if (options.type === "multiple") {
        options.onValuesChange?.(normalizeValues(nextValues));
      }
    },
  });

  function disabled() {
    return read(options.disabled ?? false) === true;
  }

  function isPressed(itemValue: string) {
    if (options.type === "single") {
      return single.get() === itemValue;
    }

    return multiple.get().includes(itemValue);
  }

  function toggleValue(itemValue: string) {
    if (disabled()) {
      return;
    }

    if (options.type === "single") {
      single.set(single.get() === itemValue ? undefined : itemValue);
      return;
    }

    const currentValues = normalizeValues(multiple.get());
    const nextValues = currentValues.includes(itemValue)
      ? currentValues.filter((value) => value !== itemValue)
      : [...currentValues, itemValue];

    multiple.set(nextValues);
  }

  function isItemDisabled(itemOptions: ToggleGroupItemOptions) {
    return disabled() || read(itemOptions.disabled ?? false) === true;
  }

  function createItem(itemOptions: ToggleGroupItemOptions): ToggleGroupItemCore {
    // One gamepad or keyboard activation fires both `Activated` and an `InputBegan` carrying
    // Return/Space. Both routes share this guard so the item flips once instead of flipping and
    // immediately flipping back — which is why it is created per item, not per render.
    const claimActivation = createActivationGuard();

    function itemDisabled() {
      return isItemDisabled(itemOptions);
    }

    function toggle() {
      if (itemDisabled() || !claimActivation()) {
        return;
      }

      toggleValue(itemOptions.value);
    }

    return {
      disabled: itemDisabled,
      pressed: () => isPressed(itemOptions.value),
      spec: (): ElementSpec<TextButton> => ({
        neutral: ITEM_NEUTRAL,
        props: {
          Active: () => !itemDisabled(),
          Selectable: () => !itemDisabled(),
        },
        events: {
          Activated: toggle,
          InputBegan: (_rbx: TextButton, inputObject: InputObject) => {
            const keyCode = inputObject.KeyCode;
            if (keyCode !== Enum.KeyCode.Return && keyCode !== Enum.KeyCode.Space) {
              return;
            }

            toggle();
          },
        },
      }),
    };
  }

  return {
    type: () => options.type,
    disabled,
    isPressed,
    toggleValue,
    rootSpec: () => ({ neutral: ROOT_NEUTRAL }),
    createItem,
  };
}
