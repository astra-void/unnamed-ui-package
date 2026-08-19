import { PortalProvider, portal, usePortalContext } from "@lattice-ui/vide-runtime";
import type { PopoverPortalProps } from "./types";

export function PopoverPortal(props: PopoverPortalProps) {
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
