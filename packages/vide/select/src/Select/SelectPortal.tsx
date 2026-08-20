import { PortalProvider, portal, usePortalContext } from "@lattice-ui/vide-runtime";
import type { SelectPortalProps } from "./types";

export function SelectPortal(props: SelectPortalProps) {
  const portalContext = usePortalContext();
  const container = props.container ?? portalContext.container;
  const displayOrderBase = props.displayOrderBase ?? portalContext.displayOrderBase;

  // Re-provide before rendering so the content underneath sees the overridden container and base.
  return PortalProvider({
    container,
    displayOrderBase,
    children: () => portal(props.children, container),
  });
}
