import { createProgress } from "@lattice-ui/core-progress";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { ProgressContextProvider } from "./context";
import type { ProgressProps } from "./types";

export function ProgressRoot(props: ProgressProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createProgress(rx, {
      value: () => propsRef.current.value,
      defaultValue: propsRef.current.defaultValue ?? 0,
      max: () => propsRef.current.max,
      indeterminate: () => propsRef.current.indeterminate,
      onValueChange: (value) => propsRef.current.onValueChange?.(value),
    }),
  );

  const value = core.value();
  const max = core.max();
  const ratio = core.ratio();
  const indeterminate = core.indeterminate();

  const contextValue = React.useMemo(
    () => ({ value, max, ratio, indeterminate, core }),
    [core, indeterminate, max, ratio, value],
  );

  return <ProgressContextProvider value={contextValue}>{props.children}</ProgressContextProvider>;
}

export { ProgressRoot as Progress };
