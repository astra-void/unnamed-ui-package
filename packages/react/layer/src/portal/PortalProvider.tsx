import { DEFAULT_DISPLAY_ORDER_BASE } from "@lattice-ui/core-layer";
import { createStrictContext, React } from "@lattice-ui/react-runtime";
import type { PortalContextValue, PortalProviderProps } from "./types";

const [PortalContextProvider, usePortalContext] = createStrictContext<PortalContextValue>("PortalProvider");

export function PortalProvider(props: PortalProviderProps) {
  const displayOrderBase = props.displayOrderBase ?? DEFAULT_DISPLAY_ORDER_BASE;
  const contextValue = React.useMemo(
    () => ({
      container: props.container,
      displayOrderBase,
    }),
    [displayOrderBase, props.container],
  );

  return <PortalContextProvider value={contextValue}>{props.children}</PortalContextProvider>;
}

export { usePortalContext };
