import { createCombobox } from "@lattice-ui/core-combobox";
import { focusGuiObject } from "@lattice-ui/vide-focus";
import { createVideReactivity, renderChildren, Vide } from "@lattice-ui/vide-runtime";
import { ComboboxContext } from "./context";
import type { ComboboxProps } from "./types";

export function ComboboxRoot(props: ComboboxProps) {
  const rx = createVideReactivity();
  const core = createCombobox(rx, {
    value: props.value,
    defaultValue: props.defaultValue,
    inputValue: props.inputValue,
    defaultInputValue: props.defaultInputValue ?? "",
    readOnly: props.readOnly,
    filterFn: props.filterFn,
    onInputValueChange: props.onInputValueChange,
    open: props.open,
    defaultOpen: props.defaultOpen ?? false,
    disabled: props.disabled,
    required: props.required,
    onValueChange: props.onValueChange,
    onOpenChange: props.onOpenChange,
    focusInstance: focusGuiObject,
  });

  let wasOpen = core.open();

  // Settle the value once a registration batch has landed, never per item: resolving after the
  // first alone would hand the selection to it.
  rx.effect(() => {
    core.registryRevision();
    core.value();
    core.open();

    Vide.untrack(() => {
      core.syncForcedValue();
    });
  });

  rx.effect(() => {
    const open = core.open();

    Vide.untrack(() => {
      // Arming on open, settling the input on close.
      core.syncOpenState();

      if (open) {
        // Items register as they are created, so this runs after the content exists.
        core.focusSelectedItem();
      } else if (wasOpen) {
        // Once now and once deferred: the content is still tearing down this frame, and focus set
        // before it goes lands back on nothing.
        core.focusTrigger();
        task.defer(() => core.focusTrigger());
      }

      wasOpen = open;
    });
  });

  return ComboboxContext(core, () => renderChildren(props.children));
}

export { ComboboxRoot as Combobox };
