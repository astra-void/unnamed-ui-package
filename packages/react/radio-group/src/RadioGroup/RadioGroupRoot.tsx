import { createRadioGroup } from "@lattice-ui/core-radio-group";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { RadioGroupContextProvider } from "./context";
import type { RadioGroupProps } from "./types";

export function RadioGroupRoot(props: RadioGroupProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createRadioGroup(rx, {
      value: () => propsRef.current.value,
      defaultValue: propsRef.current.defaultValue,
      disabled: () => propsRef.current.disabled,
      required: () => propsRef.current.required,
      orientation: () => propsRef.current.orientation,
      onValueChange: (value) => propsRef.current.onValueChange?.(value),
    }),
  );

  const value = core.value();
  const disabled = core.disabled();
  const required = core.required();
  const orientation = core.orientation();

  const contextValue = React.useMemo(
    () => ({
      value,
      setValue: core.setValue,
      disabled,
      required,
      orientation,
      moveSelection: core.moveSelection,
      core,
    }),
    [core, disabled, orientation, required, value],
  );

  return <RadioGroupContextProvider value={contextValue}>{props.children}</RadioGroupContextProvider>;
}
