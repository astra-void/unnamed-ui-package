import { createPopover } from "@lattice-ui/core-popover";
import { createVideReactivity, renderChildren } from "@lattice-ui/vide-runtime";
import { PopoverContext } from "./context";
import type { PopoverProps } from "./types";

export function PopoverRoot(props: PopoverProps) {
  // No focus mechanism is injected: the Vide layer has no focus scope yet, so the core's decision to
  // focus the trigger before opening has nowhere to land. Leaving it unset is the honest form of
  // that gap — the behavior is absent, not silently reimplemented here.
  const core = createPopover(createVideReactivity(), {
    open: props.open,
    defaultOpen: props.defaultOpen ?? false,
    modal: props.modal,
    onOpenChange: props.onOpenChange,
  });

  return PopoverContext(core, () => renderChildren(props.children));
}
