import { createCheckbox } from "@lattice-ui/core-checkbox";
import {
  applyElementSpec,
  getPassthroughProps,
  getSlotChild,
  React,
  Slot,
  toSlotProps,
  useLatticeCore,
} from "@lattice-ui/react-runtime";
import { CheckboxContextProvider } from "./context";
import type { CheckboxProps } from "./types";

const OWN_PROPS = [
  "checked",
  "defaultChecked",
  "onCheckedChange",
  "disabled",
  "required",
  "asChild",
  "children",
] as const;

export function CheckboxRoot(props: CheckboxProps) {
  // The core reads its inputs through getters, so it always sees this render's props rather than
  // the ones it was built with. Assigning during render matches how the primitives already keep
  // callbacks current, and the core never reads a getter while React is rendering.
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createCheckbox(rx, {
      checked: () => propsRef.current.checked,
      defaultChecked: propsRef.current.defaultChecked ?? false,
      disabled: () => propsRef.current.disabled,
      required: () => propsRef.current.required,
      // Stable wrapper: the core captures `onChange` once, but a consumer's handler is a fresh
      // closure on every render.
      onCheckedChange: (checked) => propsRef.current.onCheckedChange?.(checked),
    }),
  );

  const checked = core.checked();
  const disabled = core.disabled();
  const required = core.required();

  const contextValue = React.useMemo(
    () => ({
      checked,
      setChecked: core.setChecked,
      disabled,
      required,
    }),
    [checked, core, disabled, required],
  );

  const child = props.children;
  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const spec = core.rootSpec();

  return (
    <CheckboxContextProvider value={contextValue}>
      {props.asChild ? (
        (() => {
          if (getSlotChild(child) === undefined) {
            error("[Checkbox] `asChild` requires a child element.");
          }

          // No neutral defaults here: the rendered element belongs to the consumer.
          return <Slot {...toSlotProps(applyElementSpec(spec, passthrough, { neutral: false }))}>{child}</Slot>;
        })()
      ) : (
        <textbutton {...applyElementSpec(spec, passthrough)}>{child}</textbutton>
      )}
    </CheckboxContextProvider>
  );
}
