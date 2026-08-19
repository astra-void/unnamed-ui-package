import {
  applyElementSpec,
  applySlotProps,
  createVideReactivity,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useScrollAreaContext } from "./context";
import type { ScrollAreaViewportProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

/** Measures the viewport and its canvas, and reports scrolling back to the core. */
function observe(core: ReturnType<typeof useScrollAreaContext>, viewport: ScrollingFrame) {
  function measure() {
    core.setMetrics({
      vertical: {
        viewportSize: viewport.AbsoluteSize.Y,
        contentSize: viewport.AbsoluteCanvasSize.Y,
        scrollPosition: viewport.CanvasPosition.Y,
      },
      horizontal: {
        viewportSize: viewport.AbsoluteSize.X,
        contentSize: viewport.AbsoluteCanvasSize.X,
        scrollPosition: viewport.CanvasPosition.X,
      },
    });
  }

  measure();

  const connections = [
    viewport.GetPropertyChangedSignal("AbsoluteSize").Connect(measure),
    viewport.GetPropertyChangedSignal("AbsoluteCanvasSize").Connect(measure),
    viewport.GetPropertyChangedSignal("CanvasPosition").Connect(() => {
      measure();
      core.notifyScrollActivity();
    }),
  ];

  return () => {
    for (const connection of connections) {
      connection.Disconnect();
    }
  };
}

export function ScrollAreaViewport(props: ScrollAreaViewportProps) {
  const core = useScrollAreaContext();
  const rx = createVideReactivity();
  const passthrough = getPassthroughProps<ScrollingFrame>(props, OWN_PROPS);
  const merged = applyElementSpec(core.viewportSpec(), passthrough, { neutral: props.asChild !== true });

  function attach(viewport: ScrollingFrame) {
    core.setViewport(viewport);
    rx.cleanup(observe(core, viewport));
  }

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[ScrollAreaViewport] `asChild` requires a child instance.");
    }

    const target = child as ScrollingFrame;
    attach(target);
    return applySlotProps(target, merged);
  }

  merged.action = (created: ScrollingFrame) => attach(created);

  return <scrollingframe {...merged}>{props.children}</scrollingframe>;
}
