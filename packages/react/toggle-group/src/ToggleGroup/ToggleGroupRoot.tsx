import { createToggleGroup } from "@lattice-ui/core-toggle-group";
import {
  applyElementSpec,
  getPassthroughProps,
  getSlotChild,
  React,
  Slot,
  toSlotProps,
  useLatticeCore,
} from "@lattice-ui/react-runtime";
import { ToggleGroupContextProvider } from "./context";
import type { ToggleGroupProps } from "./types";

const OWN_PROPS = ["type", "value", "defaultValue", "onValueChange", "disabled", "asChild", "children"] as const;

export function ToggleGroupRoot(props: ToggleGroupProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createToggleGroup(rx, {
      type: propsRef.current.type,
      disabled: () => propsRef.current.disabled,
      value: () => {
        const current = propsRef.current;
        return current.type === "single" ? current.value : undefined;
      },
      defaultValue: props.type === "single" ? props.defaultValue : undefined,
      onValueChange: (value) => {
        const current = propsRef.current;
        if (current.type === "single") {
          current.onValueChange?.(value);
        }
      },
      values: () => {
        const current = propsRef.current;
        return current.type === "multiple" ? current.value : undefined;
      },
      defaultValues: props.type === "multiple" ? (props.defaultValue ?? []) : [],
      onValuesChange: (values) => {
        const current = propsRef.current;
        if (current.type === "multiple") {
          current.onValueChange?.(values);
        }
      },
    }),
  );

  const disabled = core.disabled();

  const contextValue = React.useMemo(
    () => ({
      type: core.type(),
      disabled,
      isPressed: core.isPressed,
      toggleValue: core.toggleValue,
      core,
    }),
    [core, disabled],
  );

  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);
  const merged = applyElementSpec(core.rootSpec(), passthrough, { neutral: props.asChild !== true });

  const groupNode = props.asChild ? (
    (() => {
      const child = props.children;
      if (getSlotChild(child) === undefined) {
        error("[ToggleGroup] `asChild` requires a child element.");
      }

      // No neutral defaults here: the rendered element belongs to the consumer.
      return <Slot {...toSlotProps(merged)}>{child}</Slot>;
    })()
  ) : (
    <frame {...merged}>{props.children}</frame>
  );

  return <ToggleGroupContextProvider value={contextValue}>{groupNode}</ToggleGroupContextProvider>;
}
