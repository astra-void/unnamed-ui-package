import { createContextMenu } from "@lattice-ui/core-context-menu";
import { focusGuiObject } from "@lattice-ui/react-focus";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { ContextMenuContextProvider } from "./context";
import type { ContextMenuProps } from "./types";

export function ContextMenu(props: ContextMenuProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createContextMenu(rx, {
      open: () => propsRef.current.open,
      defaultOpen: propsRef.current.defaultOpen ?? false,
      modal: () => propsRef.current.modal,
      onOpenChange: (open) => propsRef.current.onOpenChange?.(open),
      focusInstance: focusGuiObject,
    }),
  );

  const open = core.open();
  const modal = core.modal();
  const anchorPosition = core.anchorPosition();

  // Opening moves focus onto the first enabled item; items register as they mount.
  React.useEffect(() => {
    if (!open) {
      return;
    }

    core.focusFirstItem();
  }, [core, open]);

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen: core.setOpen,
      modal,
      anchorPosition,
      openAtPosition: core.openAtPosition,
      core,
    }),
    [anchorPosition, core, modal, open],
  );

  return <ContextMenuContextProvider value={contextValue}>{props.children}</ContextMenuContextProvider>;
}
