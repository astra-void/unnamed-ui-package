import { useFocusNode } from "@lattice-ui/react-focus";
import {
  applyElementSpec,
  composeRefs,
  getPassthroughProps,
  React,
  Slot,
  toSlotProps,
} from "@lattice-ui/react-runtime";
import { useComboboxContext } from "./context";
import type { ComboboxInputProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

function toTextBox(instance: Instance | undefined) {
  if (!instance?.IsA("TextBox")) {
    return undefined;
  }

  return instance;
}

export function ComboboxInput(props: ComboboxInputProps) {
  const core = useComboboxContext().core;
  const focusRef = React.useRef<GuiObject>();

  useFocusNode({
    ref: focusRef,
    getDisabled: () => core.disabled(),
    // The list is open while the player is typing, so arrow keys belong to the list rather than to
    // focus movement — the caret stays where it is.
    getCapturesDirectional: () => core.open(),
  });

  const setInputRef = React.useCallback(
    (instance: Instance | undefined) => {
      const textBox = toTextBox(instance);
      core.setInput(textBox);
      focusRef.current = textBox;
    },
    [core],
  );

  const passthrough = getPassthroughProps<TextBox>(props, OWN_PROPS);
  const merged = applyElementSpec(core.inputSpec(), passthrough, { neutral: props.asChild !== true });
  merged.ref = composeRefs<Instance>(merged.ref as never, setInputRef);

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[ComboboxInput] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textbox {...merged}>{props.children}</textbox>;
}
