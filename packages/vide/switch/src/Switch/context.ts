import type { SwitchCore } from "@lattice-ui/core-switch";
import { Vide } from "@lattice-ui/vide-runtime";

export const SwitchContext = Vide.context<SwitchCore>();

export function useSwitchContext(): SwitchCore {
  const core = SwitchContext() as SwitchCore | undefined;

  if (core === undefined) {
    error("[Switch] context is undefined. Render this inside <Switch.Root>.");
  }

  return core;
}
