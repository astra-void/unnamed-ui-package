import { createScrollArea } from "@lattice-ui/core-scroll-area";
import { createVideReactivity } from "@lattice-ui/vide-runtime";
import { ScrollAreaContext } from "./context";
import type { ScrollAreaProps } from "./types";

export function ScrollAreaRoot(props: ScrollAreaProps) {
  const core = createScrollArea(createVideReactivity(), {
    type: props.type,
    scrollHideDelayMs: props.scrollHideDelayMs,
  });

  return ScrollAreaContext(core, () => props.children);
}

export { ScrollAreaRoot as ScrollArea };
