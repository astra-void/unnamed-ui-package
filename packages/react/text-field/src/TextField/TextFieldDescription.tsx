import { applyElementSpec, getPassthroughProps, React, Slot, toSlotProps } from "@lattice-ui/react-runtime";
import { useTextFieldContext } from "./context";
import type { TextFieldDescriptionProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function TextFieldDescription(props: TextFieldDescriptionProps) {
  // Renders nothing of its own, but must still be inside a `TextField.Root`.
  const core = useTextFieldContext().core;
  const passthrough = getPassthroughProps<TextLabel>(props, OWN_PROPS);
  const merged = applyElementSpec(core.descriptionSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[TextFieldDescription] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textlabel {...merged}>{props.children}</textlabel>;
}
