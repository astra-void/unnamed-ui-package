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
import { useTextareaContext } from "./context";
import type { TextareaInputProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "readOnly", "lineHeight", "children"] as const;

function toTextBox(instance: Instance | undefined) {
  if (!instance?.IsA("TextBox")) {
    return undefined;
  }

  return instance;
}

export function TextareaInput(props: TextareaInputProps) {
  const textareaContext = useTextareaContext();
  const core = textareaContext.core;
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const input = useLatticeCore(() =>
    core.createInput({
      disabled: () => propsRef.current.disabled,
      readOnly: () => propsRef.current.readOnly,
      lineHeight: () => propsRef.current.lineHeight,
    }),
  );

  const focusRef = React.useRef<GuiObject>();

  useFocusNode({
    ref: focusRef,
    getDisabled: () => input.disabled(),
    // While editing, arrow keys move the text cursor across lines, so the navigation controller
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

  // The value can also change from outside, which resizes the box just as typing does.
  React.useEffect(() => {
    input.applyAutoResize();
  }, [input, textareaContext.value]);

  const passthrough = getPassthroughProps<TextBox>(props, OWN_PROPS);
  const merged = applyElementSpec(input.spec(), passthrough, { neutral: props.asChild !== true });
  merged.ref = composeRefs<Instance>(merged.ref as never, setInputRef);

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[TextareaInput] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textbox {...merged}>{props.children}</textbox>;
}
