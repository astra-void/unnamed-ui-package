import type { SelectCore, SelectItemCore } from "@lattice-ui/core-select";
import { Vide } from "@lattice-ui/vide-runtime";

export const SelectContext = Vide.context<SelectCore>();
export const SelectItemContext = Vide.context<SelectItemCore>();

export function useSelectContext(): SelectCore {
  const core = SelectContext() as SelectCore | undefined;

  if (core === undefined) {
    error("[Select] context is undefined. Render this inside <Select.Root>.");
  }

  return core;
}

/** Per-item state consumers read to style the item; the primitive never paints it. */
export function useSelectItemContext(): SelectItemCore {
  const item = SelectItemContext() as SelectItemCore | undefined;

  if (item === undefined) {
    error("[Select] item context is undefined. Render this inside <Select.Item>.");
  }

  return item;
}
