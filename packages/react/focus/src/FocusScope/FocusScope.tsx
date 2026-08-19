import { createFocusScope } from "@lattice-ui/core-focus";
import { getSlotChild, React, Slot, useLatticeCore } from "@lattice-ui/react-runtime";
import { FocusScopeProvider, useFocusLayerOrder, useFocusScopeId } from "../context";
import type { FocusScopeProps } from "./types";

/**
 * React binding for a focus scope.
 *
 * Registration, the scope's settings and holding the navigation binds open live in
 * `@lattice-ui/core-focus`; what stays here is the element the scope covers and the context that
 * tells descendants which scope they belong to.
 */
export function FocusScope(props: FocusScopeProps) {
  const parentScopeId = useFocusScopeId();
  const layerOrder = useFocusLayerOrder();
  const active = props.active ?? true;

  const propsRef = React.useRef(props);
  propsRef.current = props;
  const layerOrderRef = React.useRef(layerOrder);
  layerOrderRef.current = layerOrder;

  const core = useLatticeCore((rx) =>
    createFocusScope(rx, {
      parentScopeId,
      active: () => propsRef.current.active,
      trapped: () => propsRef.current.trapped,
      restoreFocus: () => propsRef.current.restoreFocus,
      layerOrder: () => layerOrderRef.current,
      navStrategy: () => propsRef.current.navStrategy,
      navOrientation: () => propsRef.current.navOrientation,
      navWrap: () => propsRef.current.navWrap,
    }),
  );

  const setScopeRoot = React.useCallback(
    (instance: Instance | undefined) => {
      core.setRoot(instance);
    },
    [core],
  );

  React.useEffect(() => {
    core.start();
  }, [core]);

  // Every scope setting the manager reads through a getter still has to be pushed at, because a
  // changed prop is not something the core can observe: `sync` is what re-reads them and what
  // retains or releases navigation on the active edge.
  React.useEffect(() => {
    core.sync();
  }, [
    active,
    core,
    layerOrder,
    props.navOrientation,
    props.navStrategy,
    props.navWrap,
    props.restoreFocus,
    props.trapped,
  ]);

  const content = props.asChild ? (
    (() => {
      const child = props.children;
      if (getSlotChild(child) === undefined) {
        error("[FocusScope] `asChild` requires a child element.");
      }

      return <Slot ref={setScopeRoot}>{child}</Slot>;
    })()
  ) : (
    <frame
      BackgroundTransparency={1}
      BorderSizePixel={0}
      Position={UDim2.fromScale(0, 0)}
      Size={UDim2.fromScale(1, 1)}
      ref={setScopeRoot}
    >
      {props.children}
    </frame>
  );

  return <FocusScopeProvider scopeId={core.scopeId}>{content}</FocusScopeProvider>;
}
