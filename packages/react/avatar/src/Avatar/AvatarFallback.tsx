import { applyElementSpec, getPassthroughProps, React, Slot, toSlotProps } from "@lattice-ui/react-runtime";
import { useAvatarContext } from "./context";
import type { AvatarFallbackProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function AvatarFallback(props: AvatarFallbackProps) {
  const core = useAvatarContext().core;
  const passthrough = getPassthroughProps<TextLabel>(props, OWN_PROPS);
  const merged = applyElementSpec(core.fallbackSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[AvatarFallback] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textlabel {...merged}>{props.children}</textlabel>;
}
