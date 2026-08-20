import { useFocusNode } from "@lattice-ui/vide-focus";
import {
  applyElementSpec,
  applySlotProps,
  createVideReactivity,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { ContextMenuItemContext, useContextMenuContext } from "./context";
import type { ContextMenuItemProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "onSelect", "children"] as const;

export function ContextMenuItem(props: ContextMenuItemProps) {
  const core = useContextMenuContext();
  const rx = createVideReactivity();
  const instance = Vide.source<GuiObject | undefined>(undefined);

  // On this component's own reactivity, so a hover or focus change updates this item rather than
  // the menu that contains it.
  const item = core.createItem(rx, {
    disabled: props.disabled,
    onSelect: props.onSelect,
    getGuiObject: () => instance(),
  });

  item.register();

  // Directional movement, Enter/Space activation and the highlight all come from the focus manager;
  // the engine's own selection events are never consulted.
  useFocusNode({
    getGuiObject: () => instance(),
    disabled: () => item.disabled(),
    onFocusChange: item.setFocused,
    onActivate: item.activate,
  });

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(item.spec(), passthrough, { neutral: props.asChild !== true });

  return ContextMenuItemContext(item, () => {
    if (props.asChild === true) {
      const child = resolveSlotInstance(props.children);
      if (child === undefined) {
        error("[ContextMenuItem] `asChild` requires a child instance.");
      }

      const target = child as TextButton;
      instance(target);
      return applySlotProps(target, merged);
    }

    merged.action = (created: TextButton) => instance(created);

    return <textbutton {...merged}>{props.children}</textbutton>;
  });
}
