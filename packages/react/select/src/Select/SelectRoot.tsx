import { createSelect } from "@lattice-ui/core-select";
import { focusGuiObject } from "@lattice-ui/react-focus";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { SelectContextProvider } from "./context";
import type { SelectProps } from "./types";

export function SelectRoot(props: SelectProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createSelect(rx, {
      value: () => propsRef.current.value,
      defaultValue: propsRef.current.defaultValue,
      open: () => propsRef.current.open,
      defaultOpen: propsRef.current.defaultOpen ?? false,
      disabled: () => propsRef.current.disabled,
      required: () => propsRef.current.required,
      onValueChange: (value) => propsRef.current.onValueChange?.(value),
      onOpenChange: (open) => propsRef.current.onOpenChange?.(open),
      focusInstance: focusGuiObject,
    }),
  );

  const open = core.open();
  const value = core.value();
  const registryRevision = core.registryRevision();
  const disabled = core.disabled();
  const required = core.required();

  // The controlled value can move onto an item that is disabled or gone; registration resolves the
  // same thing from inside the core.
  React.useEffect(() => {
    core.syncValue();
  }, [core, registryRevision, value]);

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen: core.setOpen,
      value,
      setValue: core.setValue,
      disabled,
      required,
      getItemText: core.getItemText,
      core,
    }),
    [core, disabled, open, required, value],
  );

  return <SelectContextProvider value={contextValue}>{props.children}</SelectContextProvider>;
}
