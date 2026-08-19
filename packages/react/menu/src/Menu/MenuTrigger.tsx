import { useFocusNode } from "@lattice-ui/react-focus";
import {
  applyElementSpec,
  composeRefs,
  getPassthroughProps,
  React,
  Slot,
  toSlotProps,
} from "@lattice-ui/react-runtime";
import { useMenuContext } from "./context";
import type { MenuTriggerProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "children"] as const;

export function MenuTrigger(props: MenuTriggerProps) {
  const core = useMenuContext().core;
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
  const merged = applyElementSpec(core.triggerSpec({ disabled: () => propsRef.current.disabled }), passthrough, {
    neutral: props.asChild !== true,
  });
  merged.ref = composeRefs<Instance>(merged.ref as never, captureTrigger);

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[MenuTrigger] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
