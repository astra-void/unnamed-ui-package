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
import { SelectItemContextProvider, useSelectContext } from "./context";
import type { SelectItemProps } from "./types";

const OWN_PROPS = ["value", "disabled", "textValue", "asChild", "children"] as const;

export function SelectItem(props: SelectItemProps) {
  const core = useSelectContext().core;
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const itemRef = React.useRef<GuiObject>();

  // On this component's own reactivity, so a hover or focus change re-renders this item rather than
  // the list that contains it.
  const item = useLatticeCore((rx) =>
    core.createItem(rx, {
      value: props.value,
      disabled: () => propsRef.current.disabled,
      getTextValue: () => propsRef.current.textValue ?? propsRef.current.value,
      getGuiObject: () => itemRef.current,
    }),
  );

  React.useEffect(() => {
    item.register();
  }, [item]);

  const setItemRef = React.useCallback((instance: Instance | undefined) => {
    itemRef.current = instance?.IsA("GuiObject") === true ? instance : undefined;
  }, []);

  useFocusNode({
    ref: itemRef,
    getDisabled: () => item.disabled(),
    onFocusChange: item.setFocused,
    onActivate: item.activate,
  });

  const highlighted = item.highlighted();
  const disabled = item.disabled();

  // Highlight is tracked, never painted: consumers read it here and style however they like.
  const itemContextValue = React.useMemo(() => ({ highlighted, disabled }), [disabled, highlighted]);

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(item.spec(), passthrough, { neutral: props.asChild !== true });
  merged.ref = composeRefs<GuiObject>(merged.ref as never, setItemRef);

  return (
    <SelectItemContextProvider value={itemContextValue}>
      {props.asChild ? (
        (() => {
          const child = props.children;
          if (!child) {
            error("[SelectItem] `asChild` requires a child element.");
          }

          // No neutral defaults here: the rendered element belongs to the consumer.
          return <Slot {...toSlotProps(merged)}>{child}</Slot>;
        })()
      ) : (
        <textbutton {...merged}>{props.children}</textbutton>
      )}
    </SelectItemContextProvider>
  );
}
