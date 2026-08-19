import { createScrollArea } from "@lattice-ui/core-scroll-area";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { ScrollAreaContextProvider } from "./context";
import type { ScrollAreaProps } from "./types";

export function ScrollAreaRoot(props: ScrollAreaProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createScrollArea(rx, {
      type: () => propsRef.current.type,
      scrollHideDelayMs: () => propsRef.current.scrollHideDelayMs,
    }),
  );

  const scrollType = core.type();
  const metrics = core.metrics();
  const showVerticalScrollbar = core.showScrollbar("vertical");
  const showHorizontalScrollbar = core.showScrollbar("horizontal");

  const viewportRef = React.useRef<ScrollingFrame>();
  const setViewport = React.useCallback(
    (instance: ScrollingFrame | undefined) => {
      viewportRef.current = instance;
      core.setViewport(instance);
    },
    [core],
  );

  const contextValue = React.useMemo(
    () => ({
      type: scrollType,
      scrollHideDelayMs: core.scrollHideDelayMs(),
      viewportRef,
      setViewport,
      vertical: metrics.vertical,
      horizontal: metrics.horizontal,
      setMetrics: core.setMetrics,
      setScrollPosition: core.setScrollPosition,
      notifyScrollActivity: core.notifyScrollActivity,
      showVerticalScrollbar,
      showHorizontalScrollbar,
      core,
    }),
    [
      core,
      metrics.horizontal,
      metrics.vertical,
      scrollType,
      setViewport,
      showHorizontalScrollbar,
      showVerticalScrollbar,
    ],
  );

  return <ScrollAreaContextProvider value={contextValue}>{props.children}</ScrollAreaContextProvider>;
}

export { ScrollAreaRoot as ScrollArea };
