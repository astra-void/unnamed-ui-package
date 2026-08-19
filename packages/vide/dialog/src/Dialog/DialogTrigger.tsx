import { useFocusNode } from "@lattice-ui/vide-focus";
import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useDialogContext } from "./context";
import type { DialogTriggerProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "children"] as const;

export function DialogTrigger(props: DialogTriggerProps) {
  const core = useDialogContext();

  // A focus node so closing has somewhere to restore to, but out of Roblox's own selection sweep.
  useFocusNode({
    getGuiObject: core.getTrigger,
    disabled: props.disabled,
    syncToRoblox: false,
  });

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(core.triggerSpec({ disabled: props.disabled }), passthrough, {
    neutral: props.asChild !== true,
  });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[DialogTrigger] `asChild` requires a child instance.");
    }

    return applySlotProps(child as TextButton, merged);
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
