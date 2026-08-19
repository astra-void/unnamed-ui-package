import { createTextField } from "@lattice-ui/core-text-field";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { TextFieldContextProvider } from "./context";
import type { TextFieldProps } from "./types";

export function TextFieldRoot(props: TextFieldProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createTextField(rx, {
      value: () => propsRef.current.value,
      defaultValue: propsRef.current.defaultValue ?? "",
      disabled: () => propsRef.current.disabled,
      readOnly: () => propsRef.current.readOnly,
      required: () => propsRef.current.required,
      invalid: () => propsRef.current.invalid,
      name: () => propsRef.current.name,
      onValueChange: (value) => propsRef.current.onValueChange?.(value),
      onValueCommit: (value) => propsRef.current.onValueCommit?.(value),
    }),
  );

  const value = core.value();
  const disabled = core.disabled();
  const readOnly = core.readOnly();
  const required = core.required();
  const invalid = core.invalid();

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
      core,
    }),
    [core, disabled, invalid, props.name, readOnly, required, value],
  );

  return <TextFieldContextProvider value={contextValue}>{props.children}</TextFieldContextProvider>;
}
