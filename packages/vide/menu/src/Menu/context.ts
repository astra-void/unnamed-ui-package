import type { MenuCore, MenuItemCore } from "@lattice-ui/core-menu";
import { Vide } from "@lattice-ui/vide-runtime";

export const MenuContext = Vide.context<MenuCore>();
export const MenuItemContext = Vide.context<MenuItemCore>();

export function useMenuContext(): MenuCore {
  const core = MenuContext() as MenuCore | undefined;

  if (core === undefined) {
    error("[Menu] context is undefined. Render this inside <Menu.Root>.");
  }

  return core;
}

/** Per-item state consumers read to style the item; the primitive never paints it. */
export function useMenuItemContext(): MenuItemCore {
  const item = MenuItemContext() as MenuItemCore | undefined;

  if (item === undefined) {
    error("[Menu] item context is undefined. Render this inside <Menu.Item>.");
  }

  return item;
}
