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
import { useTextFieldContext } from "./context";
import type { TextFieldInputProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "readOnly", "children"] as const;

function toTextBox(instance: Instance | undefined) {
  if (!instance?.IsA("TextBox")) {
    return undefined;
  }

  return instance;
}

export function TextFieldInput(props: TextFieldInputProps) {
  const core = useTextFieldContext().core;
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const input = useLatticeCore(() =>
    core.createInput({
      disabled: () => propsRef.current.disabled,
      readOnly: () => propsRef.current.readOnly,
    }),
  );

  const focusRef = React.useRef<GuiObject>();

  useFocusNode({
    ref: focusRef,
    getDisabled: () => input.disabled(),
    // While the field is being edited, arrow keys move the text cursor, so the navigation controller
    // passes them through instead of moving focus.
    getCapturesDirectional: () => input.focused(),
  });

  const setInputRef = React.useCallback(
    (instance: Instance | undefined) => {
      const textBox = toTextBox(instance);
      input.setInstance(textBox);
      focusRef.current = textBox;
    },
    [input],
  );

  const passthrough = getPassthroughProps<TextBox>(props, OWN_PROPS);
  const merged = applyElementSpec(input.spec(), passthrough, { neutral: props.asChild !== true });
  merged.ref = composeRefs<Instance>(merged.ref as never, setInputRef);

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[TextFieldInput] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textbox {...merged}>{props.children}</textbox>;
}
