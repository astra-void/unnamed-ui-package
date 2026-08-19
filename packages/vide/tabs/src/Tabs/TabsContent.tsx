import { createPresenceMotionBinding, type PresenceMotionConfig, useMotionPolicy } from "@lattice-ui/vide-motion";
import {
  applyElementSpec,
  applySlotProps,
  createVideReactivity,
  getPassthroughProps,
  type PassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useTabsContext } from "./context";
import type { TabsContentProps } from "./types";

const OWN_PROPS = ["transition", "value", "asChild", "forceMount", "children"] as const;

// An unstyled panel has nothing to animate, so there is no default recipe. Presence timing is still
// owned here; consumers opt into motion with `transition`.
const NO_MOTION: PresenceMotionConfig = {};

export function TabsContent(props: TabsContentProps) {
  const core = useTabsContext();
  const content = core.createContent(props.value);
  const policy = useMotionPolicy();
  const rx = createVideReactivity();
  const instance = Vide.source<Frame | undefined>(undefined);
  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);

  const motion = createPresenceMotionBinding<Frame>(rx, {
    getInstance: () => instance(),
    present: () => content.selected(),
    config: () => props.transition ?? NO_MOTION,
    forceMount: props.forceMount,
    disableAllMotion: () => policy().disableAllMotion,
  });

  function render() {
    const merged: PassthroughProps<Frame> = applyElementSpec(content.spec(), passthrough, {
      neutral: props.asChild !== true,
    });

    merged.Visible = () => motion.mounted() && (content.selected() || motion.phase() !== "exited");

    if (props.asChild === true) {
      const child = resolveSlotInstance(props.children);
      if (child === undefined) {
        error("[TabsContent] `asChild` requires a child instance.");
      }

      const target = child as Frame;
      instance(target);
      return applySlotProps(target, merged);
    }

    merged.action = (created: Frame) => instance(created);

    return <frame {...merged}>{props.children}</frame>;
  }

  if (props.forceMount === true) {
    return render();
  }

  return Vide.show(
    () => motion.mounted(),
    () => render(),
  );
}
