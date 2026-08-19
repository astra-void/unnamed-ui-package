import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { usePopoverContext } from "./context";
import type { PopoverCloseProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function PopoverClose(props: PopoverCloseProps) {
  const core = usePopoverContext();
  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(core.closeSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[PopoverClose] `asChild` requires a child instance.");
    }

    return applySlotProps(child as TextButton, merged);
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
