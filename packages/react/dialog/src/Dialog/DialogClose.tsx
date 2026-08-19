import { applyElementSpec, getPassthroughProps, React, Slot, toSlotProps } from "@lattice-ui/react-runtime";
import { useDialogContext } from "./context";
import type { DialogCloseProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function DialogClose(props: DialogCloseProps) {
  const core = useDialogContext().core;
  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(core.closeSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[DialogClose] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
