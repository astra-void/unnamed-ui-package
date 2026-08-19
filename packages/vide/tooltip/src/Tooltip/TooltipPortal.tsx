import { PortalProvider, portal, usePortalContext } from "@lattice-ui/vide-runtime";
import type { TooltipPortalProps } from "./types";

export function TooltipPortal(props: TooltipPortalProps) {
  const portalContext = usePortalContext();
  const container = props.container ?? portalContext.container;
  const displayOrderBase = props.displayOrderBase ?? portalContext.displayOrderBase;

  // Re-provide before rendering so the content underneath sees the overridden container and base,
  // exactly as it would through the React layer's nested PortalProvider.
  return PortalProvider({
    container,
    displayOrderBase,
    children: () => portal(props.children, container),
  });
}
