import { createFocusNode, type FocusNodeCore, type FocusNodeOptions } from "@lattice-ui/core-focus";
import { createVideReactivity } from "@lattice-ui/vide-runtime";
import { useFocusScopeId } from "./context";

export type UseFocusNodeOptions = FocusNodeOptions & { scopeId?: number };

/**
 * Registers a focus node for the surrounding scope.
 *
 * Call it at the top level of a component: it reads the scope from context, and Vide resolves
 * context from the providing component's call stack.
 */
export function useFocusNode(options: UseFocusNodeOptions): FocusNodeCore {
  const scopeId = options.scopeId ?? useFocusScopeId();
  const core = createFocusNode(createVideReactivity(), options);

  core.register(scopeId);

  return core;
}
