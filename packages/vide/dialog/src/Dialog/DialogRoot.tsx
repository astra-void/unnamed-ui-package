import { createDialog } from "@lattice-ui/core-dialog";
import { focusGuiObject } from "@lattice-ui/vide-focus";
import { createVideReactivity } from "@lattice-ui/vide-runtime";
import { DialogContext } from "./context";
import type { DialogProps } from "./types";

export function DialogRoot(props: DialogProps) {
  const core = createDialog(createVideReactivity(), {
    open: props.open,
    defaultOpen: props.defaultOpen ?? false,
    modal: props.modal,
    onOpenChange: props.onOpenChange,
    focusInstance: focusGuiObject,
  });

  return DialogContext(core, () => props.children);
}

export { DialogRoot as Dialog };
