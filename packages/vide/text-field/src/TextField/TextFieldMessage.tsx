import {
  applyElementSpec,
  applySlotProps,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useTextFieldContext } from "./context";
import type { TextFieldMessageProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function TextFieldMessage(props: TextFieldMessageProps) {
  // Renders nothing of its own, but must still be inside a `TextField.Root`.
  const core = useTextFieldContext();
  const passthrough = getPassthroughProps<TextLabel>(props, OWN_PROPS);
  const merged = applyElementSpec(core.messageSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[TextFieldMessage] `asChild` requires a child instance.");
    }

    // No neutral defaults here: the rendered instance belongs to the consumer.
    return applySlotProps(child as TextLabel, merged);
  }

  return <textlabel {...merged}>{props.children}</textlabel>;
}
