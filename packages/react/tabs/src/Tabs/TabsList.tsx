import {
  applyElementSpec,
  getPassthroughProps,
  getSlotChild,
  React,
  Slot,
  toSlotProps,
} from "@lattice-ui/react-runtime";
import { useTabsContext } from "./context";
import type { TabsListProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function TabsList(props: TabsListProps) {
  const core = useTabsContext().core;
  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);
  const merged = applyElementSpec(core.listSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild) {
    const child = props.children;
    if (getSlotChild(child) === undefined) {
      error("[TabsList] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <frame {...merged}>{props.children}</frame>;
}
