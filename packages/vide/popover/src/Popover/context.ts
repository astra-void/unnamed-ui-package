import type { PopoverCore } from "@lattice-ui/core-popover";
import { Vide } from "@lattice-ui/vide-runtime";

export const PopoverContext = Vide.context<PopoverCore>();

/** Read at the top level of a component; Vide resolves context from the provider's call stack. */
export function usePopoverContext(): PopoverCore {
  const core = PopoverContext() as PopoverCore | undefined;

  if (core === undefined) {
    error("[Popover] context is undefined. Render this inside <Popover.Root>.");
  }

  return core;
}
