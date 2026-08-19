import { useFocusNode } from "@lattice-ui/react-focus";
import {
  applyElementSpec,
  composeRefs,
  getPassthroughProps,
  React,
  Slot,
  toSlotProps,
} from "@lattice-ui/react-runtime";
import { RadioGroupItemContextProvider, useRadioGroupContext } from "./context";
import type { RadioGroupItemProps } from "./types";

const OWN_PROPS = ["value", "disabled", "asChild", "children"] as const;

export function RadioGroupItem(props: RadioGroupItemProps) {
  const core = useRadioGroupContext().core;
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const itemRef = React.useRef<GuiObject>();

  // Built once, so the item keeps its identity and its place in the group's ordered ring across
  // renders. The ring is what arrow-key movement steps through.
  const item = React.useMemo(
    () =>
      core.createItem({
        value: props.value,
        disabled: () => propsRef.current.disabled,
        getGuiObject: () => itemRef.current,
      }),
    [core, props.value],
  );

  React.useEffect(() => {
    item.register();
  }, [item]);

  useFocusNode({
    ref: itemRef,
    getDisabled: () => item.disabled(),
  });

  const setItemRef = React.useCallback((instance: Instance | undefined) => {
    itemRef.current = instance?.IsA("GuiObject") === true ? instance : undefined;
  }, []);

  const checked = item.checked();
  const disabled = item.disabled();

  const itemContextValue = React.useMemo(() => ({ checked, disabled, item }), [checked, disabled, item]);

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(item.spec(), passthrough, { neutral: props.asChild !== true });
  merged.ref = composeRefs<GuiObject>(merged.ref as never, setItemRef);

  return (
    <RadioGroupItemContextProvider value={itemContextValue}>
      {props.asChild ? (
        (() => {
          const child = props.children;
          if (!child) {
            error("[RadioGroupItem] `asChild` requires a child element.");
          }

          // No neutral defaults here: the rendered element belongs to the consumer.
          return <Slot {...toSlotProps(merged)}>{child}</Slot>;
        })()
      ) : (
        <textbutton {...merged}>{props.children}</textbutton>
      )}
    </RadioGroupItemContextProvider>
  );
}
