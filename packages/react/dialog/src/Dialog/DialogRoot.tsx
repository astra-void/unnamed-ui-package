import { createDialog } from "@lattice-ui/core-dialog";
import { focusGuiObject } from "@lattice-ui/react-focus";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { DialogContextProvider } from "./context";
import type { DialogProps } from "./types";

export function Dialog(props: DialogProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createDialog(rx, {
      open: () => propsRef.current.open,
      defaultOpen: propsRef.current.defaultOpen ?? false,
      modal: () => propsRef.current.modal,
      onOpenChange: (open) => propsRef.current.onOpenChange?.(open),
      focusInstance: focusGuiObject,
    }),
  );

  const open = core.open();
  const modal = core.modal();

  const contextValue = React.useMemo(() => ({ open, setOpen: core.setOpen, modal, core }), [core, modal, open]);

  return <DialogContextProvider value={contextValue}>{props.children}</DialogContextProvider>;
}
