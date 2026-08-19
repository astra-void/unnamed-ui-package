import { createSwitch } from "@lattice-ui/core-switch";
import {
  applyElementSpec,
  getPassthroughProps,
  getSlotChild,
  React,
  Slot,
  toSlotProps,
  useLatticeCore,
} from "@lattice-ui/react-runtime";
import { SwitchContextProvider } from "./context";
import type { SwitchProps } from "./types";

const OWN_PROPS = ["checked", "defaultChecked", "onCheckedChange", "disabled", "asChild", "children"] as const;

export function SwitchRoot(props: SwitchProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createSwitch(rx, {
      checked: () => propsRef.current.checked,
      defaultChecked: propsRef.current.defaultChecked ?? false,
      disabled: () => propsRef.current.disabled,
      onCheckedChange: (checked) => propsRef.current.onCheckedChange?.(checked),
    }),
  );

  const checked = core.checked();
  const disabled = core.disabled();

  const contextValue = React.useMemo(
    () => ({ checked, setChecked: core.setChecked, disabled, core }),
    [checked, core, disabled],
  );

  const child = props.children;
  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(core.rootSpec(), passthrough, { neutral: props.asChild !== true });

  return (
    <SwitchContextProvider value={contextValue}>
      {props.asChild ? (
        (() => {
          if (getSlotChild(child) === undefined) {
            error("[Switch] `asChild` requires a child element.");
          }

          // No neutral defaults here: the rendered element belongs to the consumer.
          return <Slot {...toSlotProps(merged)}>{child}</Slot>;
        })()
      ) : (
        <textbutton {...merged}>{child}</textbutton>
      )}
    </SwitchContextProvider>
  );
}
