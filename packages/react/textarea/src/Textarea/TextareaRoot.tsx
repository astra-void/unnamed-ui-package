import { createTextarea } from "@lattice-ui/core-textarea";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { TextareaContextProvider } from "./context";
import type { TextareaProps } from "./types";

export function TextareaRoot(props: TextareaProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createTextarea(rx, {
      value: () => propsRef.current.value,
      defaultValue: propsRef.current.defaultValue ?? "",
      disabled: () => propsRef.current.disabled,
      readOnly: () => propsRef.current.readOnly,
      required: () => propsRef.current.required,
      invalid: () => propsRef.current.invalid,
      name: () => propsRef.current.name,
      autoResize: () => propsRef.current.autoResize,
      minRows: () => propsRef.current.minRows,
      maxRows: () => propsRef.current.maxRows,
      onValueChange: (value) => propsRef.current.onValueChange?.(value),
      onValueCommit: (value) => propsRef.current.onValueCommit?.(value),
    }),
  );

  const value = core.value();
  const disabled = core.disabled();
  const readOnly = core.readOnly();
  const required = core.required();
  const invalid = core.invalid();
  const autoResize = core.autoResize();
  const minRows = core.minRows();
  const maxRows = core.maxRows();

  const contextValue = React.useMemo(
    () => ({
      value,
      setValue: core.setValue,
      commitValue: core.commitValue,
      disabled,
      readOnly,
      required,
      invalid,
      name: props.name,
      autoResize,
      minRows,
      maxRows,
      core,
    }),
    [autoResize, core, disabled, invalid, maxRows, minRows, props.name, readOnly, required, value],
  );

  return <TextareaContextProvider value={contextValue}>{props.children}</TextareaContextProvider>;
}
