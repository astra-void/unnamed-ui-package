import { DEFAULT_DISPLAY_ORDER_BASE } from "@lattice-ui/core-layer";
import type Vide from "@rbxts/vide";
import VideRuntime from "./vide";

export interface PortalContextValue {
  container: BasePlayerGui;
  displayOrderBase: number;
}

export const PortalContext = VideRuntime.context<PortalContextValue>();

/** Read at the top level of a component, like every Vide context. */
export function usePortalContext(): PortalContextValue {
  const value = PortalContext() as PortalContextValue | undefined;

  if (value === undefined) {
    error("[PortalProvider] context is undefined. Wrap your UI in <PortalProvider>.");
  }

  return value;
}

export function PortalProvider(props: {
  container: BasePlayerGui;
  displayOrderBase?: number;
  children: () => Vide.Node;
}) {
  return PortalContext(
    {
      container: props.container,
      displayOrderBase: props.displayOrderBase ?? DEFAULT_DISPLAY_ORDER_BASE,
    },
    props.children,
  );
}

/**
 * Renders a subtree under a container of its own instead of under the caller's element.
 *
 * There is no portal machinery in Vide because none is needed: a component returns a real instance,
 * so a portal is that instance parented elsewhere. Returning `undefined` is what keeps the caller
 * from re-parenting it straight back, and the cleanup ties its lifetime to the current scope rather
 * than to the tree it is no longer part of.
 */
export function portal(node: Vide.Node, container: Instance): undefined {
  let resolved: unknown = node;

  if (typeIs(resolved, "function")) {
    resolved = (resolved as () => unknown)();
  }

  if (typeIs(resolved, "Instance")) {
    const instance = resolved as Instance;
    instance.Parent = container;
    VideRuntime.cleanup(instance);
  }

  return undefined;
}
