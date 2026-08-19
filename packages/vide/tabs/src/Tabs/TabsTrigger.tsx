import { useFocusNode } from "@lattice-ui/vide-focus";
import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useTabsContext } from "./context";
import type { TabsTriggerProps } from "./types";

const OWN_PROPS = ["value", "disabled", "asChild", "children"] as const;

export function TabsTrigger(props: TabsTriggerProps) {
  const core = useTabsContext();
  const instance = Vide.source<GuiObject | undefined>(undefined);

  const trigger = core.createTrigger({
    value: props.value,
    disabled: props.disabled,
    getGuiObject: () => instance(),
  });

  trigger.register();

  useFocusNode({
    getGuiObject: () => instance(),
    disabled: () => trigger.disabled(),
  });

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(trigger.spec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[TabsTrigger] `asChild` requires a child instance.");
    }

    const target = child as TextButton;
    instance(target);
    return applySlotProps(target, merged);
  }

  merged.action = (created: TextButton) => instance(created);

  return <textbutton {...merged}>{props.children}</textbutton>;
}
