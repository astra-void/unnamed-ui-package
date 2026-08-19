import type { TabsCore } from "@lattice-ui/core-tabs";
import { Vide } from "@lattice-ui/vide-runtime";

export const TabsContext = Vide.context<TabsCore>();

export function useTabsContext(): TabsCore {
  const core = TabsContext() as TabsCore | undefined;

  if (core === undefined) {
    error("[Tabs] context is undefined. Render this inside <Tabs.Root>.");
  }

  return core;
}
