import { createActivationGuard } from "@lattice-ui/core-focus";
import { createControllableState, type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import { nextAccordionValues, normalizeAccordionValue } from "./state";
import type { AccordionCore, AccordionItemCore, AccordionItemOptions, AccordionOptions } from "./types";

// Roblox instance defaults are themselves a look. Neutralize only those; adapters spread them
// before consumer props so they stay overridable.
const FRAME_NEUTRAL: Partial<WritableInstanceProperties<Frame>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
};

const TRIGGER_NEUTRAL: Partial<WritableInstanceProperties<TextButton>> = {
  AutoButtonColor: false,
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

/** Accordion behavior, free of any UI framework. */
export function createAccordion(rx: Reactivity, options: AccordionOptions = {}): AccordionCore {
  const accordionType = options.type ?? "single";

  const state = createControllableState<string | string[]>(rx, {
    value: options.value,
    defaultValue: options.defaultValue ?? (accordionType === "single" ? "" : []),
    onChange: options.onValueChange,
  });

  function openValues() {
    return normalizeAccordionValue(accordionType, state.get());
  }

  function isOpen(value: string) {
    return openValues().includes(value);
  }

  function toggleItem(candidateValue: string) {
    const collapsible = read(options.collapsible ?? false) === true;
    const nextValues = nextAccordionValues(accordionType, openValues(), candidateValue, collapsible);

    // Single mode stores a bare string, so the caller gets back the shape it gave.
    if (accordionType === "single") {
      state.set(nextValues[0] ?? "");
      return;
    }

    state.set(nextValues);
  }

  function createItem(itemOptions: AccordionItemOptions): AccordionItemCore {
    // One gamepad or keyboard activation fires both `Activated` and an `InputBegan` carrying
    // Return/Space. Both routes share this guard, so the section opens once instead of opening and
    // immediately closing again.
    const claimActivation = createActivationGuard();

    function itemDisabled() {
      return read(itemOptions.disabled ?? false) === true;
    }

    function toggle() {
      if (itemDisabled() || !claimActivation()) {
        return;
      }

      toggleItem(itemOptions.value);
    }

    return {
      value: itemOptions.value,
      open: () => isOpen(itemOptions.value),
      disabled: itemDisabled,
      itemSpec: () => ({ neutral: FRAME_NEUTRAL }),
      headerSpec: () => ({ neutral: FRAME_NEUTRAL }),
      triggerSpec: (): ElementSpec<TextButton> => ({
        neutral: TRIGGER_NEUTRAL,
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
      contentSpec: () => ({ neutral: FRAME_NEUTRAL }),
    };
  }

  return {
    type: () => accordionType,
    openValues,
    toggleItem,
    isOpen,
    createItem,
  };
}
