import { applyElementSpec, getPassthroughProps, React, Slot, toSlotProps } from "@lattice-ui/react-runtime";
import { useTextareaContext } from "./context";
import type { TextareaDescriptionProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function TextareaDescription(props: TextareaDescriptionProps) {
  // Renders nothing of its own, but must still be inside a `Textarea.Root`.
  const core = useTextareaContext().core;
  const passthrough = getPassthroughProps<TextLabel>(props, OWN_PROPS);
  const merged = applyElementSpec(core.descriptionSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[TextareaDescription] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textlabel {...merged}>{props.children}</textlabel>;
}
