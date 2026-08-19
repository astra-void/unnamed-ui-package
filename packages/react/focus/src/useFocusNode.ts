import { createFocusNode, type NavDirection } from "@lattice-ui/core-focus";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { useFocusScopeId } from "./context";

export type UseFocusNodeOptions = {
  ref: React.MutableRefObject<GuiObject | undefined>;
  scopeId?: number;
  disabled?: boolean;
  getDisabled?: () => boolean;
  getVisible?: () => boolean | undefined;
  syncToRoblox?: boolean;
  // Return true for directions the focused widget consumes itself (text cursor,
  // slider value). The navigation controller passes those inputs through
  // instead of moving focus.
  getCapturesDirectional?: (direction: NavDirection) => boolean;
  // Called when managed focus enters or leaves this node. Drive a widget's
  // highlight from here instead of `SelectionGained`/`SelectionLost`.
  onFocusChange?: (focused: boolean) => void;
  // Runs on Enter/Space/ButtonA while this node is focused. Providing it makes
  // the navigation controller own the widget's keyboard activation; omit it to
  // leave activation to the engine's own `Activated` event.
  onActivate?: () => void;
};

/**
 * React binding for a focus node.
 *
 * Registration lives in `@lattice-ui/core-focus`; this hook keeps the options it reads current and
 * re-registers when the node's scope changes, since a node's scope is part of its identity.
 */
export function useFocusNode(options: UseFocusNodeOptions): React.MutableRefObject<number | undefined> {
  const inheritedScopeId = useFocusScopeId();
  const scopeId = options.scopeId ?? inheritedScopeId;

  const optionsRef = React.useRef(options);
  optionsRef.current = options;
  const nodeIdRef = React.useRef<number>();

  const core = useLatticeCore((rx) =>
    createFocusNode(rx, {
      getGuiObject: () => optionsRef.current.ref.current,
      disabled: () => optionsRef.current.disabled === true || optionsRef.current.getDisabled?.() === true,
      getVisible: () => optionsRef.current.getVisible?.(),
      syncToRoblox: () => optionsRef.current.syncToRoblox,
      getCapturesDirectional: (direction) => optionsRef.current.getCapturesDirectional?.(direction) === true,
      onFocusChange: (focused) => optionsRef.current.onFocusChange?.(focused),
      onActivate: () => optionsRef.current.onActivate?.(),
    }),
  );

  React.useEffect(() => {
    core.register(scopeId);
    nodeIdRef.current = core.nodeId();

    return () => {
      core.unregister();
      nodeIdRef.current = undefined;
    };
  }, [core, options.ref, scopeId]);

  return nodeIdRef;
}
