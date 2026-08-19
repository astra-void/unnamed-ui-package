import { useFocusNode } from "@lattice-ui/vide-focus";
import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { RadioGroupItemContext, useRadioGroupContext } from "./context";
import type { RadioGroupItemProps } from "./types";

const OWN_PROPS = ["value", "disabled", "asChild", "children"] as const;

export function RadioGroupItem(props: RadioGroupItemProps) {
  const core = useRadioGroupContext();
  const instance = Vide.source<GuiObject | undefined>(undefined);

  const item = core.createItem({
    value: props.value,
    disabled: props.disabled,
    getGuiObject: () => instance(),
  });

  item.register();

  useFocusNode({
    getGuiObject: () => instance(),
    disabled: () => item.disabled(),
  });

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(item.spec(), passthrough, { neutral: props.asChild !== true });

  return RadioGroupItemContext(item, () => {
    if (props.asChild === true) {
      const child = resolveSlotInstance(props.children);
      if (child === undefined) {
        error("[RadioGroupItem] `asChild` requires a child instance.");
      }

      const target = child as TextButton;
      instance(target);
      return applySlotProps(target, merged);
    }

    merged.action = (created: TextButton) => instance(created);

    return <textbutton {...merged}>{props.children}</textbutton>;
  });
}
