import { useFocusNode } from "@lattice-ui/vide-focus";
import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useTextFieldContext } from "./context";
import type { TextFieldInputProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "readOnly", "children"] as const;

export function TextFieldInput(props: TextFieldInputProps) {
  const core = useTextFieldContext();
  const input = core.createInput({ disabled: props.disabled, readOnly: props.readOnly });
  const instance = Vide.source<TextBox | undefined>(undefined);

  useFocusNode({
    getGuiObject: () => instance(),
    disabled: () => input.disabled(),
    // While the field is being edited, arrow keys move the text cursor, so the navigation controller
    // passes them through instead of moving focus.
    getCapturesDirectional: () => input.focused(),
  });

  const passthrough = getPassthroughProps<TextBox>(props, OWN_PROPS);
  const merged = applyElementSpec(input.spec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[TextFieldInput] `asChild` requires a child instance.");
    }

    const target = child as TextBox;
    instance(target);
    input.setInstance(target);
    return applySlotProps(target, merged);
  }

  merged.action = (created: TextBox) => {
    instance(created);
    input.setInstance(created);
  };

  return <textbox {...merged}>{props.children}</textbox>;
}
