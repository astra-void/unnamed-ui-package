import { createCombobox } from "@lattice-ui/core-combobox";
import { focusGuiObject } from "@lattice-ui/react-focus";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { ComboboxContextProvider } from "./context";
import type { ComboboxProps } from "./types";

export function ComboboxRoot(props: ComboboxProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createCombobox(rx, {
      value: () => propsRef.current.value,
      defaultValue: propsRef.current.defaultValue,
      inputValue: () => propsRef.current.inputValue,
      defaultInputValue: propsRef.current.defaultInputValue ?? "",
      open: () => propsRef.current.open,
      defaultOpen: propsRef.current.defaultOpen ?? false,
      disabled: () => propsRef.current.disabled,
      readOnly: () => propsRef.current.readOnly,
      required: () => propsRef.current.required,
      filterFn: () => propsRef.current.filterFn,
      onValueChange: (value) => propsRef.current.onValueChange?.(value),
      onInputValueChange: (inputValue) => propsRef.current.onInputValueChange?.(inputValue),
      onOpenChange: (open) => propsRef.current.onOpenChange?.(open),
      focusInstance: focusGuiObject,
    }),
  );

  const open = core.open();
  const value = core.value();
  const inputValue = core.inputValue();
  const registryRevision = core.registryRevision();
  const disabled = core.disabled();
  const readOnly = core.readOnly();
  const required = core.required();

  // Forcing the value onto a selectable item waits for the registration batch: resolving after the
  // first item alone would hand the selection to it.
  React.useEffect(() => {
    core.syncForcedValue();
  }, [core, open, registryRevision, value]);

  // The open/close transition: arming on open, settling the input on close.
  React.useEffect(() => {
    core.syncOpenState();
  }, [core, open, value]);

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen: core.setOpen,
      value,
      setValue: core.setValue,
      inputValue,
      queryValue: core.queryValue(),
      setInputValue: core.setInputValue,
      syncInputFromValue: core.syncInputFromValue,
      disabled,
      readOnly,
      required,
      filterFn: core.filterFn(),
      getItemText: core.getItemText,
      core,
    }),
    [core, disabled, inputValue, open, readOnly, required, value],
  );

  return <ComboboxContextProvider value={contextValue}>{props.children}</ComboboxContextProvider>;
}

export { ComboboxRoot as Combobox };
