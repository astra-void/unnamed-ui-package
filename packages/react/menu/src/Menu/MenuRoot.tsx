import { createMenu } from "@lattice-ui/core-menu";
import { focusGuiObject } from "@lattice-ui/react-focus";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { MenuContextProvider } from "./context";
import type { MenuProps } from "./types";

export function Menu(props: MenuProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createMenu(rx, {
      open: () => propsRef.current.open,
      defaultOpen: propsRef.current.defaultOpen ?? false,
      modal: () => propsRef.current.modal,
      onOpenChange: (open) => propsRef.current.onOpenChange?.(open),
      focusInstance: focusGuiObject,
    }),
  );

  const open = core.open();
  const modal = core.modal();

  // Opening moves focus onto the first enabled item. Items register as they mount, so this runs
  // again on the commit after they arrive.
  React.useEffect(() => {
    if (!open) {
      return;
    }

    core.focusFirstItem();
  }, [core, open]);

  const wasOpenRef = React.useRef(open);
  React.useEffect(() => {
    if (wasOpenRef.current && !open) {
      // Once now and once deferred: the content is still tearing down in this frame, and focus set
      // before it goes lands back on nothing.
      core.restoreTriggerFocus();
      task.defer(() => core.restoreTriggerFocus());
    }

    wasOpenRef.current = open;
  }, [core, open]);

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen: core.setOpen,
      modal,
      focusFirstItem: core.focusFirstItem,
      restoreTriggerFocus: core.restoreTriggerFocus,
      core,
    }),
    [core, modal, open],
  );

  return <MenuContextProvider value={contextValue}>{props.children}</MenuContextProvider>;
}
