import { createTabs } from "@lattice-ui/core-tabs";
import { createVideReactivity, read, renderChildren, Vide } from "@lattice-ui/vide-runtime";
import { TabsContext } from "./context";
import type { TabsProps } from "./types";

export function TabsRoot(props: TabsProps) {
  const rx = createVideReactivity();
  const core = createTabs(rx, {
    value: props.value,
    defaultValue: props.defaultValue,
    orientation: props.orientation,
    onValueChange: props.onValueChange,
  });

  // Selection settles onto an enabled tab when the controlled value moves. Registration and
  // disabling resolve it from inside the core.
  rx.effect(() => {
    read(props.value ?? undefined);
    core.registryRevision();

    Vide.untrack(() => {
      core.syncSelection();
    });
  });

  return TabsContext(core, () => renderChildren(props.children));
}
