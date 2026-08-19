import { createControllableState, type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import type { DialogCore, DialogOptions, DialogTriggerOptions } from "./types";

// Roblox instance defaults are themselves a look. Neutralize only those; adapters spread them
// before consumer props so they stay overridable.
const BUTTON_NEUTRAL: Partial<WritableInstanceProperties<TextButton>> = {
  AutoButtonColor: false,
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

const CONTENT_NEUTRAL: Partial<WritableInstanceProperties<Frame>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
};

/** Dialog behavior, free of any UI framework. */
export function createDialog(rx: Reactivity, options: DialogOptions = {}): DialogCore {
  const state = createControllableState<boolean>(rx, {
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: options.onOpenChange,
  });

  let trigger: GuiObject | undefined;

  return {
    open: state.get,
    setOpen: (open: boolean) => {
      state.set(open);
    },
    modal: () => read(options.modal ?? true) !== false,
    getTrigger: () => trigger,
    setTrigger: (instance) => {
      trigger = instance;
    },
    triggerSpec: (triggerOptions: DialogTriggerOptions = {}): ElementSpec<TextButton> => {
      function disabled() {
        return read(triggerOptions.disabled ?? false) === true;
      }

      return {
        neutral: BUTTON_NEUTRAL,
        props: {
          Active: () => !disabled(),
          // The trigger is reached through focus navigation, not Roblox's own selection sweep.
          Selectable: false,
        },
        events: {
          Activated: () => {
            if (disabled()) {
              return;
            }

            // Focus before opening: closing restores focus to wherever it was, and that has to be
            // the trigger rather than whatever the pointer last touched.
            options.focusInstance?.(trigger);
            state.set(true);
          },
        },
        refs: [
          (instance) => {
            trigger = instance;
          },
        ],
      };
    },
    closeSpec: (): ElementSpec<TextButton> => ({
      neutral: BUTTON_NEUTRAL,
      props: { Active: true, Selectable: false },
      events: {
        Activated: () => {
          state.set(false);
        },
      },
    }),
    // A fully transparent overlay still hit-tests, which is what keeps it blocking input; the dim
    // colour and its transparency are appearance and belong to the consumer.
    overlaySpec: (): ElementSpec<TextButton> => ({
      neutral: BUTTON_NEUTRAL,
      props: {
        Active: () => state.get(),
        Selectable: false,
      },
      events: {
        Activated: () => {
          state.set(false);
        },
      },
    }),
    contentSpec: () => ({ neutral: CONTENT_NEUTRAL }),
  };
}
