import type { CheckboxCore } from "@lattice-ui/core-checkbox";
import { Vide } from "@lattice-ui/vide-runtime";

export const CheckboxContext = Vide.context<CheckboxCore>();

/**
 * Reads the checkbox core.
 *
 * Call this at the top level of a component. Vide resolves context from the call stack of the
 * component that provided it, so a read deferred into an effect, a `show` body or a new thread gets
 * the default value instead.
 */
export function useCheckboxContext(): CheckboxCore {
  const core = CheckboxContext() as CheckboxCore | undefined;

  if (core === undefined) {
    error("[Checkbox] context is undefined. Render this inside <Checkbox.Root>.");
  }

  return core;
}
