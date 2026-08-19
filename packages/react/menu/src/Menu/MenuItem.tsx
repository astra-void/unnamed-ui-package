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
import { MenuItemContextProvider, useMenuContext } from "./context";
import type { MenuItemProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "onSelect", "children"] as const;

export function MenuItem(props: MenuItemProps) {
  const core = useMenuContext().core;
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const itemRef = React.useRef<GuiObject>();

  // Built once: the item owns its highlight state, its place in the ordered ring, and the
  // activation guard that collapses the pair the engine fires for a single selection.
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

  // Directional movement, Enter/Space activation and the highlight all come from the focus manager;
  // the engine's own selection events are never consulted.
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
    <MenuItemContextProvider value={itemContextValue}>
      {props.asChild ? (
        (() => {
          const child = props.children;
          if (!child) {
            error("[MenuItem] `asChild` requires a child element.");
          }

          // No neutral defaults here: the rendered element belongs to the consumer.
          return <Slot {...toSlotProps(merged)}>{child}</Slot>;
        })()
      ) : (
        <textbutton {...merged}>{props.children}</textbutton>
      )}
    </MenuItemContextProvider>
  );
}
