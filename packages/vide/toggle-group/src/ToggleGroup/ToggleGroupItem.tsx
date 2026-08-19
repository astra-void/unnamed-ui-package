import { useFocusNode } from "@lattice-ui/vide-focus";
import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useToggleGroupContext } from "./context";
import type { ToggleGroupItemProps } from "./types";

const OWN_PROPS = ["value", "disabled", "asChild", "children"] as const;

export function ToggleGroupItem(props: ToggleGroupItemProps) {
  const core = useToggleGroupContext();
  // Built once, which is what keeps the item's activation guard stable across the paired events of
  // one gamepad or keyboard activation.
  const item = core.createItem({ value: props.value, disabled: props.disabled });

  const instance = Vide.source<GuiObject | undefined>(undefined);

  useFocusNode({
    getGuiObject: () => instance(),
    disabled: () => item.disabled(),
  });

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(item.spec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[ToggleGroupItem] `asChild` requires a child instance.");
    }

    const target = child as TextButton;
    instance(target);
    return applySlotProps(target, merged);
  }

  merged.action = (created: TextButton) => instance(created);

  return <textbutton {...merged}>{props.children}</textbutton>;
}
