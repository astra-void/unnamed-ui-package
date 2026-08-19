import { useFocusNode } from "@lattice-ui/react-focus";
import {
  applyElementSpec,
  composeRefs,
  getPassthroughProps,
  React,
  Slot,
  toSlotProps,
} from "@lattice-ui/react-runtime";
import { useTabsContext } from "./context";
import type { TabsTriggerProps } from "./types";

const OWN_PROPS = ["value", "disabled", "asChild", "children"] as const;

function toGuiObject(instance: Instance | undefined) {
  if (!instance?.IsA("GuiObject")) {
    return undefined;
  }

  return instance;
}

export function TabsTrigger(props: TabsTriggerProps) {
  const core = useTabsContext().core;
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const triggerRef = React.useRef<GuiObject>();

  // Built once, so the trigger keeps its place in the ordered ring the arrow keys step through.
  const trigger = React.useMemo(
    () =>
      core.createTrigger({
        value: props.value,
        disabled: () => propsRef.current.disabled,
        getGuiObject: () => triggerRef.current,
      }),
    [core, props.value],
  );

  React.useEffect(() => {
    trigger.register();
  }, [trigger]);

  // A trigger becoming disabled can hand selection on, which the core resolves when asked.
  React.useEffect(() => {
    core.syncSelection();
  }, [core, props.disabled]);

  useFocusNode({
    ref: triggerRef,
    getDisabled: () => trigger.disabled(),
  });

  const setTriggerRef = React.useCallback((instance: Instance | undefined) => {
    triggerRef.current = toGuiObject(instance);
  }, []);

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(trigger.spec(), passthrough, { neutral: props.asChild !== true });
  merged.ref = composeRefs<GuiObject>(merged.ref as never, setTriggerRef);

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[TabsTrigger] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
