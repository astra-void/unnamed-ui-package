import { createSelect } from "@lattice-ui/core-select";
import { focusGuiObject } from "@lattice-ui/vide-focus";
import { createVideReactivity, Vide } from "@lattice-ui/vide-runtime";
import { SelectContext } from "./context";
import type { SelectProps } from "./types";

export function SelectRoot(props: SelectProps) {
  const rx = createVideReactivity();
  const core = createSelect(rx, {
    value: props.value,
    defaultValue: props.defaultValue,
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

    Vide.untrack(() => {
      core.syncValue();
    });
  });

  rx.effect(() => {
    const open = core.open();

    Vide.untrack(() => {
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

  return SelectContext(core, () => props.children);
}

export { SelectRoot as Select };
