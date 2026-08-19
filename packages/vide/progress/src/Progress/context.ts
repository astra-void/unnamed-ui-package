import type { ProgressCore } from "@lattice-ui/core-progress";
import { Vide } from "@lattice-ui/vide-runtime";

export const ProgressContext = Vide.context<ProgressCore>();

export function useProgressContext(): ProgressCore {
  const core = ProgressContext() as ProgressCore | undefined;

  if (core === undefined) {
    error("[Progress] context is undefined. Render this inside <Progress.Root>.");
  }

  return core;
}
