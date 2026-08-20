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
import { ContextMenuItemContextProvider, useContextMenuContext } from "./context";
import type { ContextMenuItemProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "onSelect", "children"] as const;

export function ContextMenuItem(props: ContextMenuItemProps) {
  const core = useContextMenuContext().core;
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const itemRef = React.useRef<GuiObject>();

  // On this component's own reactivity, so a hover or focus change re-renders this item rather
  // than the menu that contains it.
  const item = useLatticeCore((rx) =>
    core.createItem(rx, {
      disabled: () => propsRef.current.disabled,
      onSelect: (event) => propsRef.current.onSelect?.(event),
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
    <ContextMenuItemContextProvider value={itemContextValue}>
      {props.asChild ? (
        (() => {
          const child = props.children;
          if (!child) {
            error("[ContextMenuItem] `asChild` requires a child element.");
          }

          // No neutral defaults here: the rendered element belongs to the consumer.
          return <Slot {...toSlotProps(merged)}>{child}</Slot>;
        })()
      ) : (
        <textbutton {...merged}>{props.children}</textbutton>
      )}
    </ContextMenuItemContextProvider>
  );
}
