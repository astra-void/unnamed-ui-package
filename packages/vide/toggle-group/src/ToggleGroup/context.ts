import type { ToggleGroupCore } from "@lattice-ui/core-toggle-group";
import { Vide } from "@lattice-ui/vide-runtime";

export const ToggleGroupContext = Vide.context<ToggleGroupCore>();

export function useToggleGroupContext(): ToggleGroupCore {
  const core = ToggleGroupContext() as ToggleGroupCore | undefined;

  if (core === undefined) {
    error("[ToggleGroup] context is undefined. Render this inside <ToggleGroup.Root>.");
  }

  return core;
}
