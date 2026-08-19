import { createPopover } from "@lattice-ui/core-popover";
import { focusGuiObject } from "@lattice-ui/react-focus";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { PopoverContextProvider } from "./context";
import type { PopoverProps } from "./types";

export function Popover(props: PopoverProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createPopover(rx, {
      open: () => propsRef.current.open,
      defaultOpen: propsRef.current.defaultOpen ?? false,
      modal: () => propsRef.current.modal,
      onOpenChange: (open) => propsRef.current.onOpenChange?.(open),
      focusInstance: focusGuiObject,
    }),
  );

  const open = core.open();
  const modal = core.modal();

  const contextValue = React.useMemo(() => ({ core, open, modal }), [core, modal, open]);

  return <PopoverContextProvider value={contextValue}>{props.children}</PopoverContextProvider>;
}
