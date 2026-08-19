import {
  createActivationGuard,
  focusOrderedSelectionEntry,
  getFirstOrderedSelectionEntry,
} from "@lattice-ui/core-focus";
import {
  createControllableState,
  type Derivable,
  type ElementSpec,
  type Reactivity,
  read,
} from "@lattice-ui/core-runtime";
import type {
  MenuCore,
  MenuItemCore,
  MenuItemOptions,
  MenuItemRegistration,
  MenuOptions,
  MenuSelectEvent,
} from "./types";

// Roblox instance defaults are themselves a look. Neutralize only those; adapters spread them
// before consumer props so they stay overridable.
const BUTTON_NEUTRAL: Partial<WritableInstanceProperties<TextButton>> = {
  AutoButtonColor: false,
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

const FRAME_NEUTRAL: Partial<WritableInstanceProperties<Frame>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
};

const LABEL_NEUTRAL: Partial<WritableInstanceProperties<TextLabel>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

let nextItemId = 0;
let nextItemOrder = 0;

function createMenuSelectEvent(): MenuSelectEvent {
  const event: MenuSelectEvent = {
    defaultPrevented: false,
    preventDefault: () => {
      event.defaultPrevented = true;
    },
  };

  return event;
}

/** Menu behavior, free of any UI framework. */
export function createMenu(rx: Reactivity, options: MenuOptions = {}): MenuCore {
  const state = createControllableState<boolean>(rx, {
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: options.onOpenChange,
  });

  const items: MenuItemRegistration[] = [];
  let trigger: GuiObject | undefined;
  let content: GuiObject | undefined;

  function focusFirstItem() {
    focusOrderedSelectionEntry(getFirstOrderedSelectionEntry(items));
  }

  function restoreTriggerFocus() {
    options.focusInstance?.(trigger);
  }

  function createItem(itemRx: Reactivity, itemOptions: MenuItemOptions): MenuItemCore {
    nextItemId += 1;
    nextItemOrder += 1;
    const id = nextItemId;
    const order = nextItemOrder;

    // Pointer hover and managed focus are tracked apart so neither clears the other: the item reads
    // highlighted while either one is on it.
    const hoveredSource = itemRx.source(false);
    const focusedSource = itemRx.source(false);
    // A click and a keyboard or gamepad activation both land on the same path — the mouse through
    // `Activated`, the keyboard through the focus node's `onActivate` — and the engine still fires
    // the pair for one selection.
    const claimActivation = createActivationGuard();
    let registered = false;

    function itemDisabled() {
      return read(itemOptions.disabled ?? false) === true;
    }

    function activate() {
      if (itemDisabled() || !claimActivation()) {
        return;
      }

      const event = createMenuSelectEvent();
      itemOptions.onSelect?.(event);

      if (!event.defaultPrevented) {
        state.set(false);
      }
    }

    return {
      disabled: itemDisabled,
      highlighted: () => (hoveredSource.get() || focusedSource.get()) && !itemDisabled(),
      setFocused: (focused) => {
        focusedSource.set(focused);
      },
      activate,
      register: () => {
        if (registered) {
          return;
        }

        registered = true;
        items.push({ id, order, getGuiObject: itemOptions.getGuiObject, getDisabled: itemDisabled });

        itemRx.cleanup(() => {
          const index = items.findIndex((entry) => entry.id === id);
          if (index >= 0) {
            items.remove(index);
          }

          registered = false;
        });
      },
      spec: (): ElementSpec<TextButton> => ({
        neutral: BUTTON_NEUTRAL,
        props: {
          Active: () => !itemDisabled(),
          Selectable: () => !itemDisabled(),
        },
        events: {
          Activated: activate,
          MouseEnter: () => {
            hoveredSource.set(true);
          },
          MouseLeave: () => {
            hoveredSource.set(false);
          },
        },
      }),
    };
  }

  return {
    open: state.get,
    setOpen: (open: boolean) => {
      state.set(open);
    },
    modal: () => read(options.modal ?? true) !== false,
    getTrigger: () => trigger,
    getContent: () => content,
    getInsideRoots: () => [trigger],
    setTrigger: (instance) => {
      trigger = instance;
    },
    setContent: (instance) => {
      content = instance;
    },
    focusFirstItem,
    restoreTriggerFocus,
    createItem,
    triggerSpec: (triggerOptions: { disabled?: Derivable<boolean | undefined> } = {}): ElementSpec<TextButton> => {
      function disabled() {
        return read(triggerOptions.disabled ?? false) === true;
      }

      return {
        neutral: BUTTON_NEUTRAL,
        props: {
          Active: () => !disabled(),
          // Reached through focus navigation, not Roblox's own selection sweep.
          Selectable: false,
        },
        events: {
          Activated: () => {
            if (disabled()) {
              return;
            }

            options.focusInstance?.(trigger);
            state.set(!state.get());
          },
        },
        refs: [
          (instance) => {
            trigger = instance;
          },
        ],
      };
    },
    contentSpec: () => ({ neutral: FRAME_NEUTRAL }),
    groupSpec: () => ({ neutral: FRAME_NEUTRAL }),
    separatorSpec: () => ({ neutral: FRAME_NEUTRAL }),
    labelSpec: () => ({ neutral: LABEL_NEUTRAL }),
  };
}
