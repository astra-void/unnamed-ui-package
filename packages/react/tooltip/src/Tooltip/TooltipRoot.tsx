import { createTooltip } from "@lattice-ui/core-tooltip";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { TooltipContextProvider, useTooltipProviderContext } from "./context";
import type { TooltipProps } from "./types";

export function Tooltip(props: TooltipProps) {
  const providerContext = useTooltipProviderContext();
  const propsRef = React.useRef(props);
  propsRef.current = props;
  const providerRef = React.useRef(providerContext);
  providerRef.current = providerContext;

  const core = useLatticeCore((rx) =>
    createTooltip(rx, {
      open: () => propsRef.current.open,
      defaultOpen: propsRef.current.defaultOpen ?? false,
      delayDuration: () => propsRef.current.delayDuration,
      onOpenChange: (open) => propsRef.current.onOpenChange?.(open),
      // Through the provider the tree gave us, so the skip window is shared across a group.
      policy: {
        resolveOpenDelay: (requestedDelay) => providerRef.current.resolveOpenDelay(requestedDelay),
        markOpen: () => providerRef.current.markOpen(),
      },
    }),
  );

  const open = core.open();

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen: core.setOpen,
      openWithDelay: core.openWithDelay,
      close: core.close,
      core,
    }),
    [core, open],
  );

  return <TooltipContextProvider value={contextValue}>{props.children}</TooltipContextProvider>;
}
