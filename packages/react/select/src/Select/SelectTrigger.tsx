import { useFocusNode } from "@lattice-ui/react-focus";
import {
  applyElementSpec,
  composeRefs,
  getPassthroughProps,
  React,
  Slot,
  toSlotProps,
  useLatticeCore,
} from "@lattice-ui/react-runtime";
import { useSelectContext } from "./context";
import type { SelectTriggerProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "children"] as const;

export function SelectTrigger(props: SelectTriggerProps) {
  const core = useSelectContext().core;
  const propsRef = React.useRef(props);
  propsRef.current = props;

  // The core owns the trigger instance; focus navigation registers through a React ref, so the
  // instance is mirrored into one here rather than duplicated as state.
  const triggerRef = React.useRef<GuiObject>();
  const captureTrigger = React.useCallback((instance: Instance | undefined) => {
    triggerRef.current = instance?.IsA("GuiObject") === true ? instance : undefined;
  }, []);

  // Built once: the trigger owns the activation guard that collapses the paired events of a single
  // gamepad or keyboard activation.
  const trigger = useLatticeCore(() => core.createTrigger({ disabled: () => propsRef.current.disabled }));

  useFocusNode({
    ref: triggerRef,
    getDisabled: () => trigger.disabled(),
  });

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(trigger.spec(), passthrough, { neutral: props.asChild !== true });
  merged.ref = composeRefs<Instance>(merged.ref as never, captureTrigger);

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[SelectTrigger] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
