import type { Derivable } from "@lattice-ui/vide-runtime";
import { Vide } from "@lattice-ui/vide-runtime";
import type VideTypes from "@rbxts/vide";

/**
 * The scope a node belongs to, and the layer order its scope sits at.
 *
 * The layer order is carried as a getter rather than a number: a dismissable layer's position in
 * the stack changes when it is promoted, and a Vide context value is read once.
 */
export const FocusScopeIdContext = Vide.context<number>();
export const FocusLayerOrderContext = Vide.context<() => number | undefined>();

export function FocusScopeProvider(props: { scopeId: number; children: () => VideTypes.Node }) {
  return FocusScopeIdContext(props.scopeId, props.children);
}

export function FocusLayerProvider(props: {
  layerOrder: Derivable<number | undefined>;
  children: () => VideTypes.Node;
}) {
  const layerOrder = props.layerOrder;

  return FocusLayerOrderContext(
    () => (typeIs(layerOrder, "function") ? (layerOrder as () => number | undefined)() : layerOrder),
    props.children,
  );
}

/** Read at the top level of a component, as always in Vide. */
export function useFocusScopeId(): number | undefined {
  return FocusScopeIdContext() as number | undefined;
}

export function useFocusLayerOrder(): () => number | undefined {
  const layerOrder = FocusLayerOrderContext() as (() => number | undefined) | undefined;

  return () => layerOrder?.();
}
