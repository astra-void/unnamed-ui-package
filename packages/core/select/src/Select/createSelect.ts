import {
  createActivationGuard,
  focusOrderedSelectionEntry,
  getFirstOrderedSelectionEntry,
  getOrderedSelectionEntries,
} from "@lattice-ui/core-focus";
import {
  createControllableState,
  type Derivable,
  type ElementSpec,
  type Reactivity,
  read,
} from "@lattice-ui/core-runtime";
import type {
  SelectCore,
  SelectItemCore,
  SelectItemOptions,
  SelectItemRegistration,
  SelectOptions,
  SelectTriggerCore,
  SelectTriggerOptions,
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

/** Select behavior, free of any UI framework. */
export function createSelect(rx: Reactivity, options: SelectOptions = {}): SelectCore {
  const openState = createControllableState<boolean>(rx, {
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: options.onOpenChange,
  });

  const valueState = createControllableState<string | undefined>(rx, {
    value: options.value,
    defaultValue: options.defaultValue,
    onChange: (nextValue) => {
      if (nextValue !== undefined) {
        options.onValueChange?.(nextValue);
      }
    },
  });

  const items: SelectItemRegistration[] = [];
  const registryRevisionSource = rx.source(0);
  let trigger: GuiObject | undefined;
  let content: GuiObject | undefined;

  function disabled() {
    return read(options.disabled ?? false) === true;
  }

  function orderedItems() {
    return getOrderedSelectionEntries(items);
  }

  function setOpen(nextOpen: boolean) {
    // A disabled select can be closed but never opened.
    if (disabled() && nextOpen) {
      return;
    }

    openState.set(nextOpen);
  }

  function setValue(nextValue: string) {
    if (disabled()) {
      return;
    }

    const selected = orderedItems().find((item) => item.value === nextValue);
    if (selected?.getDisabled() === true) {
      return;
    }

    valueState.set(nextValue);
  }

  function syncValue() {
    const current = valueState.get();
    if (current === undefined) {
      return;
    }

    const ordered = orderedItems();
    // An empty registry means the content is unmounted, not that the selection disappeared.
    if (ordered.size() === 0) {
      return;
    }

    const selected = ordered.find((item) => item.value === current);
    if (selected !== undefined && !selected.getDisabled()) {
      return;
    }

    valueState.set(ordered.find((item) => !item.getDisabled())?.value);
  }

  function focusSelectedItem() {
    const current = valueState.get();
    const selected = current !== undefined ? orderedItems().find((item) => item.value === current) : undefined;

    focusOrderedSelectionEntry(selected ?? getFirstOrderedSelectionEntry(items));
  }

  function createItem(itemRx: Reactivity, itemOptions: SelectItemOptions): SelectItemCore {
    nextItemId += 1;
    nextItemOrder += 1;
    const id = nextItemId;
    const order = nextItemOrder;

    // Pointer hover and managed focus are tracked apart so neither clears the other, on the item's
    // own reactivity so a highlight change re-renders the item rather than the list.
    const hoveredSource = itemRx.source(false);
    const focusedSource = itemRx.source(false);
    const claimActivation = createActivationGuard();
    let registered = false;

    function itemDisabled() {
      return read(itemOptions.disabled ?? false) === true;
    }

    function activate() {
      if (itemDisabled() || !claimActivation()) {
        return;
      }

      setValue(itemOptions.value);
      setOpen(false);
    }

    return {
      value: itemOptions.value,
      selected: () => valueState.get() === itemOptions.value,
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
        items.push({
          id,
          value: itemOptions.value,
          order,
          getGuiObject: itemOptions.getGuiObject,
          getDisabled: itemDisabled,
          getTextValue: itemOptions.getTextValue,
        });
        registryRevisionSource.set(registryRevisionSource.get() + 1);

        itemRx.cleanup(() => {
          const index = items.findIndex((entry) => entry.id === id);
          if (index >= 0) {
            items.remove(index);
          }

          registered = false;
          registryRevisionSource.set(registryRevisionSource.get() + 1);
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
          // `Activated` and the Return/Space `InputBegan` branch share the guarded path above, so
          // one gamepad or keyboard activation commits the value once.
          InputBegan: (_rbx: GuiObject, inputObject: InputObject) => {
            const keyCode = inputObject.KeyCode;
            if (keyCode !== Enum.KeyCode.Return && keyCode !== Enum.KeyCode.Space) {
              return;
            }

            activate();
          },
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
    open: openState.get,
    setOpen,
    value: valueState.get,
    setValue,
    disabled,
    required: () => read(options.required ?? false) === true,
    modal: () => read(options.modal ?? true) !== false,
    getItemText: (candidateValue) =>
      orderedItems()
        .find((item) => item.value === candidateValue)
        ?.getTextValue(),
    syncValue,
    registryRevision: () => registryRevisionSource.get(),
    getTrigger: () => trigger,
    getContent: () => content,
    setContent: (instance) => {
      content = instance;
    },
    getInsideRoots: () => [trigger],
    focusSelectedItem,
    focusTrigger: () => options.focusInstance?.(trigger),
    createItem,
    createTrigger: (triggerOptions: SelectTriggerOptions = {}): SelectTriggerCore => {
      // Both `Activated` and the Return/Space `InputBegan` branch route through this guarded
      // toggle, so a single gamepad or keyboard activation — which fires both — flips `open` once
      // instead of cancelling itself out.
      const claimActivation = createActivationGuard();

      function triggerDisabled() {
        return disabled() || read(triggerOptions.disabled ?? false) === true;
      }

      function toggleOpen() {
        if (triggerDisabled() || !claimActivation()) {
          return;
        }

        options.focusInstance?.(trigger);
        setOpen(!openState.get());
      }

      return {
        disabled: triggerDisabled,
        spec: (): ElementSpec<TextButton> => ({
          neutral: BUTTON_NEUTRAL,
          props: {
            Active: () => !triggerDisabled(),
            Selectable: () => !triggerDisabled(),
          },
          events: {
            Activated: toggleOpen,
            InputBegan: (_rbx: GuiObject, inputObject: InputObject) => {
              const keyCode = inputObject.KeyCode;
              if (keyCode !== Enum.KeyCode.Return && keyCode !== Enum.KeyCode.Space) {
                return;
              }

              toggleOpen();
            },
          },
          refs: [
            (instance) => {
              trigger = instance;
            },
          ],
        }),
      };
    },
    valueSpec: () => ({ neutral: LABEL_NEUTRAL }),
    contentSpec: () => ({ neutral: FRAME_NEUTRAL }),
    groupSpec: () => ({ neutral: FRAME_NEUTRAL }),
    separatorSpec: () => ({ neutral: FRAME_NEUTRAL }),
    labelSpec: () => ({ neutral: LABEL_NEUTRAL }),
  };
}
