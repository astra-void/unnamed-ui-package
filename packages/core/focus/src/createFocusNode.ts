import { type Derivable, type Reactivity, read } from "@lattice-ui/core-runtime";
import { type NavDirection, registerFocusNode, unregisterFocusNode } from "./focusManager";

export interface FocusNodeOptions {
  /** The instance this node stands for. A getter, because the adapter's ref fills in after mount. */
  getGuiObject: () => GuiObject | undefined;
  disabled?: Derivable<boolean | undefined>;
  getVisible?: () => boolean | undefined;
  syncToRoblox?: Derivable<boolean | undefined>;
  /**
   * Return true for directions the focused widget consumes itself (text cursor, slider value). The
   * navigation controller passes those inputs through instead of moving focus.
   */
  getCapturesDirectional?: (direction: NavDirection) => boolean;
  /**
   * Called when managed focus enters or leaves this node. Drive a widget's highlight from here
   * rather than from `SelectionGained`/`SelectionLost`.
   */
  onFocusChange?: (focused: boolean) => void;
  /**
   * Runs on Enter/Space/ButtonA while this node is focused. Providing it makes the navigation
   * controller own the widget's keyboard activation; omit it to leave activation to the engine's
   * own `Activated` event.
   */
  onActivate?: () => void;
}

export interface FocusNodeCore {
  nodeId: () => number | undefined;
  /**
   * Registers the node in a scope, replacing any previous registration.
   *
   * Re-registration rather than a setter: a node's scope is part of its identity in the manager,
   * and a node that moves between scopes is a different node to it.
   */
  register: (scopeId: number | undefined) => void;
  unregister: () => void;
}

/** A focus node's registration, free of any UI framework. */
export function createFocusNode(rx: Reactivity, options: FocusNodeOptions): FocusNodeCore {
  let nodeId: number | undefined;

  function unregister() {
    if (nodeId === undefined) {
      return;
    }

    unregisterFocusNode(nodeId);
    nodeId = undefined;
  }

  function register(scopeId: number | undefined) {
    unregister();

    nodeId = registerFocusNode({
      scopeId,
      getGuiObject: options.getGuiObject,
      getDisabled: () => read(options.disabled ?? false) === true,
      getVisible: () => options.getVisible?.(),
      getSyncToRoblox: () => read(options.syncToRoblox ?? true) !== false,
      getCapturesDirectional: (direction) => options.getCapturesDirectional?.(direction) === true,
      onFocusChange: (focused) => options.onFocusChange?.(focused),
      activate: () => {
        const activate = options.onActivate;
        if (activate === undefined) {
          return false;
        }

        activate();
        return true;
      },
    });
  }

  rx.cleanup(unregister);

  return {
    nodeId: () => nodeId,
    register,
    unregister,
  };
}
