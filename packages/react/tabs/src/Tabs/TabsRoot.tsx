import { createTabs } from "@lattice-ui/core-tabs";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { TabsContextProvider } from "./context";
import type { TabsProps } from "./types";

export function TabsRoot(props: TabsProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createTabs(rx, {
      value: () => propsRef.current.value,
      defaultValue: propsRef.current.defaultValue,
      orientation: () => propsRef.current.orientation,
      onValueChange: (value) => propsRef.current.onValueChange?.(value),
    }),
  );

  const value = core.value();
  const orientation = core.orientation();

  // Selection settles onto an enabled tab whenever the controlled value moves: registration and
  // disabling already resolve it from inside the core.
  React.useEffect(() => {
    core.syncSelection();
  }, [core, value]);

  const contextValue = React.useMemo(
    () => ({ value, orientation, setValue: core.setValue, moveSelection: core.moveSelection, core }),
    [core, orientation, value],
  );

  return <TabsContextProvider value={contextValue}>{props.children}</TabsContextProvider>;
}
