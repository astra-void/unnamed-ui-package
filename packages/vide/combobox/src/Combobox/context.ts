import type { ComboboxCore, ComboboxItemCore } from "@lattice-ui/core-combobox";
import { Vide } from "@lattice-ui/vide-runtime";

export const ComboboxContext = Vide.context<ComboboxCore>();
export const ComboboxItemContext = Vide.context<ComboboxItemCore>();

export function useComboboxContext(): ComboboxCore {
  const core = ComboboxContext() as ComboboxCore | undefined;

  if (core === undefined) {
    error("[Combobox] context is undefined. Render this inside <Combobox.Root>.");
  }

  return core;
}

/** Per-item state consumers read to style the item; the primitive never paints it. */
export function useComboboxItemContext(): ComboboxItemCore {
  const item = ComboboxItemContext() as ComboboxItemCore | undefined;

  if (item === undefined) {
    error("[Combobox] item context is undefined. Render this inside <Combobox.Item>.");
  }

  return item;
}
