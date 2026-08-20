import { createContextMenu } from "@lattice-ui/core-context-menu";
import { focusGuiObject } from "@lattice-ui/vide-focus";
import { createVideReactivity, Vide } from "@lattice-ui/vide-runtime";
import { ContextMenuContext } from "./context";
import type { ContextMenuProps } from "./types";

export function ContextMenuRoot(props: ContextMenuProps) {
  const rx = createVideReactivity();
  const core = createContextMenu(rx, {
    open: props.open,
    defaultOpen: props.defaultOpen ?? false,
    modal: props.modal,
    onOpenChange: props.onOpenChange,
    focusInstance: focusGuiObject,
  });

  let wasOpen = core.open();

  rx.effect(() => {
    const open = core.open();

    Vide.untrack(() => {
      if (open) {
        // Items register as they are created, so this runs after the content exists.
        core.focusFirstItem();
      } else if (wasOpen) {
        // Once now and once deferred: the content is still tearing down this frame, and focus set
        // before it goes lands back on nothing.
        core.restoreTriggerFocus();
        task.defer(() => core.restoreTriggerFocus());
      }

      wasOpen = open;
    });
  });

  return ContextMenuContext(core, () => props.children);
}

export { ContextMenuRoot as Menu };
