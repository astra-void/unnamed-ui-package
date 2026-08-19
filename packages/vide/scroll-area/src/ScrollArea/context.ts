import type { ScrollAreaCore } from "@lattice-ui/core-scroll-area";
import { Vide } from "@lattice-ui/vide-runtime";

export const ScrollAreaContext = Vide.context<ScrollAreaCore>();

export function useScrollAreaContext(): ScrollAreaCore {
  const core = ScrollAreaContext() as ScrollAreaCore | undefined;

  if (core === undefined) {
    error("[ScrollArea] context is undefined. Render this inside <ScrollArea.Root>.");
  }

  return core;
}
