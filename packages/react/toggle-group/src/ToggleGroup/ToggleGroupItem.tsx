import { useFocusNode } from "@lattice-ui/react-focus";
import {
  applyElementSpec,
  composeRefs,
  getPassthroughProps,
  React,
  Slot,
  toSlotProps,
} from "@lattice-ui/react-runtime";
import { useToggleGroupContext } from "./context";
import type { ToggleGroupItemProps } from "./types";

const OWN_PROPS = ["value", "disabled", "asChild", "children"] as const;

export function ToggleGroupItem(props: ToggleGroupItemProps) {
  const core = useToggleGroupContext().core;
  const propsRef = React.useRef(props);
  propsRef.current = props;

  // Built once: the item owns the activation guard that collapses the paired events of a single
  // gamepad or keyboard activation.
  const itemRef = React.useRef<GuiObject>();
  const item = React.useMemo(
    () =>
      core.createItem({
        value: props.value,
        disabled: () => propsRef.current.disabled,
      }),
    [core, props.value],
  );

  const setItemRef = React.useCallback((instance: Instance | undefined) => {
    itemRef.current = instance?.IsA("GuiObject") ? instance : undefined;
  }, []);

  useFocusNode({
    ref: itemRef,
    disabled: item.disabled(),
  });

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(item.spec(), passthrough, { neutral: props.asChild !== true });
  merged.ref = composeRefs<GuiObject>(merged.ref as never, setItemRef);

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[ToggleGroupItem] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
