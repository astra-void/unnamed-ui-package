import { useFocusNode } from "@lattice-ui/vide-focus";
import {
  applyElementSpec,
  applySlotProps,
  createVideReactivity,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useTextareaContext } from "./context";
import type { TextareaInputProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "readOnly", "lineHeight", "children"] as const;

export function TextareaInput(props: TextareaInputProps) {
  const core = useTextareaContext();
  const rx = createVideReactivity();
  const input = core.createInput({
    disabled: props.disabled,
    readOnly: props.readOnly,
    lineHeight: props.lineHeight,
  });

  const instance = Vide.source<TextBox | undefined>(undefined);

  useFocusNode({
    getGuiObject: () => instance(),
    disabled: () => input.disabled(),
    // While editing, arrow keys move the text cursor across lines, so the navigation controller
    // passes them through instead of moving focus.
    getCapturesDirectional: () => input.focused(),
  });

  // The value can also change from outside, which resizes the box just as typing does.
  rx.effect(() => {
    core.value();

    Vide.untrack(() => {
      input.applyAutoResize();
    });
  });

  const passthrough = getPassthroughProps<TextBox>(props, OWN_PROPS);
  const merged = applyElementSpec(input.spec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[TextareaInput] `asChild` requires a child instance.");
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
