import { useFocusNode } from "@lattice-ui/react-focus";
import {
  applyElementSpec,
  composeRefs,
  getPassthroughProps,
  React,
  Slot,
  toSlotProps,
} from "@lattice-ui/react-runtime";
import { useDialogContext } from "./context";
import type { DialogTriggerProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "children"] as const;

export function DialogTrigger(props: DialogTriggerProps) {
  const core = useDialogContext().core;
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
    if (!child) {
      error("[DialogTrigger] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
