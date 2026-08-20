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
import { type ComboboxOption, defaultComboboxFilter, resolveForcedComboboxValue } from "./logic";
import type {
  ComboboxCore,
  ComboboxFilterFn,
  ComboboxItemCore,
  ComboboxItemOptions,
  ComboboxItemRegistration,
  ComboboxOptions,
} from "./types";

// Roblox instance defaults are themselves a look. Neutralize only those; adapters spread them
// before consumer props so they stay overridable.
const BUTTON_NEUTRAL: Partial<WritableInstanceProperties<TextButton>> = {
  AutoButtonColor: false,
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

const INPUT_NEUTRAL: Partial<WritableInstanceProperties<TextBox>> = {
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

function toOptions(items: ComboboxItemRegistration[]): ComboboxOption[] {
  return items.map((item) => ({
    value: item.value,
    disabled: item.getDisabled(),
    textValue: item.getTextValue(),
  }));
}

/** Combobox behavior, free of any UI framework. */
export function createCombobox(rx: Reactivity, options: ComboboxOptions = {}): ComboboxCore {
  const openState = createControllableState<boolean>(rx, {
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: options.onOpenChange,
  });

  const valueState = createControllableState<string | undefined>(rx, {
    value: options.value,
    defaultValue: options.defaultValue,
    onChange: options.onValueChange,
  });

  const inputState = createControllableState<string>(rx, {
    value: options.inputValue,
    defaultValue: options.defaultInputValue ?? "",
    onChange: options.onInputValueChange,
  });

  // The query the list filters against while the popup is open. It is separate from the input value
  // so that reopening a settled combobox shows every option rather than only those matching the
  // label already in the box.
  const visibleQuerySource = rx.source("");
  const registryRevisionSource = rx.source(0);

  const items: ComboboxItemRegistration[] = [];
  // Items only exist while the popup is open, so their labels are cached: the closed-state input
  // sync and `Combobox.Value` both have to name a selection whose item has since unmounted.
  const itemTextCache: Record<string, string> = {};
  let anchor: GuiObject | undefined;
  let trigger: GuiObject | undefined;
  let content: GuiObject | undefined;
  let input: TextBox | undefined;

  // Set whenever the primitive writes the input itself. The echo that comes back from the TextBox is
  // then ignored, so a programmatic write never reads as the player typing.
  let programmaticInputValue: string | undefined;
  // The player cleared the box; committing that as "no selection" waits until the popup closes.
  let pendingClear = false;
  // Items only exist inside the content, so before the first open the registry is empty and
  // syncing the input would erase `defaultInputValue` and could not resolve `defaultValue`'s label.
  let hasOpened = false;
  let wasOpen = openState.get();

  function disabled() {
    return read(options.disabled ?? false) === true;
  }

  function readOnly() {
    return read(options.readOnly ?? false) === true;
  }

  function filterFn(): ComboboxFilterFn {
    return read(options.filterFn ?? defaultComboboxFilter) ?? defaultComboboxFilter;
  }

  function orderedItems() {
    return getOrderedSelectionEntries(items);
  }

  function getItemText(candidateValue: string) {
    const selected = orderedItems().find((item) => item.value === candidateValue);
    if (selected !== undefined) {
      const textValue = selected.getTextValue();
      itemTextCache[candidateValue] = textValue;
      return textValue;
    }

    // The item is gone with the closed popup; its label is not.
    return itemTextCache[candidateValue];
  }

  function setOpen(nextOpen: boolean) {
    // A disabled combobox can be closed but never opened.
    if (disabled() && nextOpen) {
      return;
    }

    openState.set(nextOpen);
  }

  function writeInput(nextInputValue: string) {
    programmaticInputValue = nextInputValue;
    inputState.set(nextInputValue);
  }

  function syncInputFromValue() {
    const current = valueState.get();
    writeInput(current !== undefined ? (getItemText(current) ?? "") : "");
  }

  function setValue(nextValue: string) {
    if (disabled()) {
      return;
    }

    const selected = orderedItems().find((item) => item.value === nextValue);
    if (selected?.getDisabled() === true) {
      return;
    }

    pendingClear = false;
    valueState.set(nextValue);
    writeInput(getItemText(nextValue) ?? nextValue);
  }

  function setInputValue(nextInputValue: string) {
    if (disabled() || readOnly()) {
      return;
    }

    // The echo of a write this primitive just made, not the player typing.
    if (programmaticInputValue !== undefined && nextInputValue === programmaticInputValue) {
      programmaticInputValue = undefined;
      return;
    }

    programmaticInputValue = undefined;
    pendingClear = nextInputValue === "";

    if (visibleQuerySource.get() !== nextInputValue) {
      visibleQuerySource.set(nextInputValue);
    }

    if (nextInputValue === inputState.get()) {
      return;
    }

    inputState.set(nextInputValue);
    // Typing opens the list: the player is searching.
    openState.set(true);
  }

  function syncForcedValue() {
    if (!openState.get()) {
      return;
    }

    const ordered = orderedItems();
    if (ordered.size() === 0) {
      return;
    }

    const current = valueState.get();
    const nextValue = resolveForcedComboboxValue(current, toOptions(ordered));
    if (nextValue !== undefined && nextValue !== current) {
      valueState.set(nextValue);
    }
  }

  function syncOpenState() {
    const open = openState.get();
    wasOpen = open;

    if (open) {
      hasOpened = true;
      return;
    }

    if (!hasOpened) {
      return;
    }

    const shouldClear = pendingClear;
    pendingClear = false;

    if (shouldClear && valueState.get() !== undefined) {
      // Clearing the box and closing means "no selection", which is only committed here so that a
      // half-typed query does not drop the selection mid-search.
      valueState.set(undefined);
      writeInput("");
    } else {
      syncInputFromValue();
    }

    if (visibleQuerySource.get() !== "") {
      visibleQuerySource.set("");
    }
  }

  function focusSelectedItem() {
    const current = valueState.get();
    const selected = current !== undefined ? orderedItems().find((item) => item.value === current) : undefined;

    focusOrderedSelectionEntry(selected ?? getFirstOrderedSelectionEntry(items));
  }

  function queryValue() {
    return openState.get() ? visibleQuerySource.get() : inputState.get();
  }

  function createItem(itemRx: Reactivity, itemOptions: ComboboxItemOptions): ComboboxItemCore {
    nextItemId += 1;
    nextItemOrder += 1;
    const id = nextItemId;
    const order = nextItemOrder;

    const hoveredSource = itemRx.source(false);
    const focusedSource = itemRx.source(false);
    const claimActivation = createActivationGuard();
    let registered = false;

    function itemDisabled() {
      return read(itemOptions.disabled ?? false) === true;
    }

    function visible() {
      return filterFn()(itemOptions.getTextValue(), queryValue());
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
      // An item filtered out of the query is hidden, so it never reads as highlighted.
      highlighted: () => (hoveredSource.get() || focusedSource.get()) && !itemDisabled() && visible(),
      visible,
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
        itemTextCache[itemOptions.value] = itemOptions.getTextValue();
        registryRevisionSource.set(registryRevisionSource.get() + 1);

        itemRx.cleanup(() => {
          const index = items.findIndex((entry) => entry.id === id);
          if (index >= 0) {
            items.remove(index);
          }

          // The cache entry stays: the label has to outlive the item that supplied it.
          registered = false;
          registryRevisionSource.set(registryRevisionSource.get() + 1);
        });
      },
      spec: (): ElementSpec<TextButton> => ({
        neutral: BUTTON_NEUTRAL,
        props: {
          Active: () => !itemDisabled(),
          Selectable: () => !itemDisabled() && visible(),
          Visible: visible,
        },
        events: {
          Activated: activate,
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
    inputValue: inputState.get,
    setInputValue,
    queryValue,
    syncInputFromValue,
    disabled,
    readOnly,
    required: () => read(options.required ?? false) === true,
    modal: () => read(options.modal ?? true) !== false,
    filterFn,
    getItemText,
    registryRevision: () => registryRevisionSource.get(),
    syncForcedValue,
    syncOpenState,

    getAnchor: () => anchor ?? trigger ?? input,
    getTrigger: () => trigger,
    getContent: () => content,
    getInput: () => input,
    setAnchor: (instance) => {
      anchor = instance;
    },
    setContent: (instance) => {
      content = instance;
    },
    setInput: (instance) => {
      input = instance;
    },
    getInsideRoots: () => [anchor, trigger, input],
    focusSelectedItem,
    focusTrigger: () => options.focusInstance?.(input ?? trigger),

    createItem,
    triggerSpec: (triggerOptions: { disabled?: Derivable<boolean | undefined> } = {}): ElementSpec<TextButton> => {
      function triggerDisabled() {
        return disabled() || read(triggerOptions.disabled ?? false) === true;
      }

      return {
        neutral: BUTTON_NEUTRAL,
        props: {
          Active: () => !triggerDisabled(),
          Selectable: false,
        },
        events: {
          Activated: () => {
            if (triggerDisabled()) {
              return;
            }

            setOpen(!openState.get());
          },
        },
        refs: [
          (instance) => {
            trigger = instance;
          },
        ],
      };
    },
    inputSpec: (): ElementSpec<TextBox> => ({
      neutral: INPUT_NEUTRAL,
      props: {
        Active: () => !disabled(),
        ClearTextOnFocus: false,
        Selectable: () => !disabled(),
        Text: () => inputState.get(),
        TextEditable: () => !disabled() && !readOnly(),
      },
      changes: {
        Text: ((textBox: TextBox) => {
          if (disabled() || readOnly()) {
            if (textBox.Text !== inputState.get()) {
              textBox.Text = inputState.get();
            }

            return;
          }

          setInputValue(textBox.Text);
        }) as Callback,
      },
      refs: [
        (instance) => {
          input = instance as TextBox | undefined;
        },
      ],
    }),
    valueSpec: () => ({ neutral: LABEL_NEUTRAL }),
    contentSpec: () => ({ neutral: FRAME_NEUTRAL }),
    groupSpec: () => ({ neutral: FRAME_NEUTRAL }),
    separatorSpec: () => ({ neutral: FRAME_NEUTRAL }),
    labelSpec: () => ({ neutral: LABEL_NEUTRAL }),
  };
}
