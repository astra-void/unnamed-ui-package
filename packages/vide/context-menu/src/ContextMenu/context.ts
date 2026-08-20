import type { ContextMenuCore, ContextMenuItemCore } from "@lattice-ui/core-context-menu";
import { Vide } from "@lattice-ui/vide-runtime";

export const ContextMenuContext = Vide.context<ContextMenuCore>();
export const ContextMenuItemContext = Vide.context<ContextMenuItemCore>();

export function useContextMenuContext(): ContextMenuCore {
  const core = ContextMenuContext() as ContextMenuCore | undefined;

  if (core === undefined) {
    error("[ContextMenu] context is undefined. Render this inside <ContextMenu.Root>.");
  }

  return core;
}

/** Per-item state consumers read to style the item; the primitive never paints it. */
export function useContextMenuItemContext(): ContextMenuItemCore {
  const item = ContextMenuItemContext() as ContextMenuItemCore | undefined;

  if (item === undefined) {
    error("[ContextMenu] item context is undefined. Render this inside <ContextMenu.Item>.");
  }

  return item;
}
