import { useFocusNode } from "@lattice-ui/vide-focus";
import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useComboboxContext } from "./context";
import type { ComboboxInputProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function ComboboxInput(props: ComboboxInputProps) {
  const core = useComboboxContext();
  const instance = Vide.source<TextBox | undefined>(undefined);

  useFocusNode({
    getGuiObject: () => instance(),
    disabled: () => core.disabled(),
    // The list is open while the player is typing, so arrow keys belong to the list rather than to
    // focus movement — the caret stays where it is.
    getCapturesDirectional: () => core.open(),
  });

  const passthrough = getPassthroughProps<TextBox>(props, OWN_PROPS);
  const merged = applyElementSpec(core.inputSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[ComboboxInput] `asChild` requires a child instance.");
    }

    const target = child as TextBox;
    instance(target);
    core.setInput(target);
    return applySlotProps(target, merged);
  }

  merged.action = (created: TextBox) => {
    instance(created);
    core.setInput(created);
  };

  return <textbox {...merged}>{props.children}</textbox>;
}
