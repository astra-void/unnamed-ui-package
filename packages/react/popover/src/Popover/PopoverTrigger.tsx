import { useFocusNode } from "@lattice-ui/react-focus";
import {
  applyElementSpec,
  composeRefs,
  getPassthroughProps,
  getSlotChild,
  React,
  Slot,
  toSlotProps,
} from "@lattice-ui/react-runtime";
import { usePopoverContext } from "./context";
import type { PopoverTriggerProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "children"] as const;

export function PopoverTrigger(props: PopoverTriggerProps) {
  const core = usePopoverContext().core;
  const propsRef = React.useRef(props);
  propsRef.current = props;

  // The core owns the trigger instance, but focus navigation registers through a React ref, so the
  // instance is mirrored into one here rather than duplicated as state.
  const triggerRef = React.useRef<GuiObject>();
  const captureTrigger = React.useCallback((instance: Instance | undefined) => {
    triggerRef.current = instance?.IsA("GuiObject") === true ? instance : undefined;
  }, []);

  useFocusNode({
    ref: triggerRef,
    disabled: props.disabled === true,
    syncToRoblox: false,
  });

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const spec = core.triggerSpec({ disabled: () => propsRef.current.disabled });
  const merged = applyElementSpec(spec, passthrough, { neutral: props.asChild !== true });
  merged.ref = composeRefs<Instance>(merged.ref as never, captureTrigger);

  if (props.asChild) {
    const child = props.children;
    if (getSlotChild(child) === undefined) {
      error("[PopoverTrigger] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
