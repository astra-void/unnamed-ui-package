import { createPresenceMotionBinding, type PresenceMotionConfig, useMotionPolicy } from "@lattice-ui/vide-motion";
import {
  applyElementSpec,
  applySlotProps,
  createVideReactivity,
  getPassthroughProps,
  type PassthroughProps,
  read,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useToastContext } from "./context";
import type { ToastRootProps } from "./types";

const OWN_PROPS = ["transition", "asChild", "visible", "onExitComplete", "children"] as const;

// An unstyled toast has nothing to animate, so there is no default recipe. Presence timing is still
// owned here; consumers opt into motion with `transition`.
const NO_MOTION: PresenceMotionConfig = {};

export function ToastRoot(props: ToastRootProps) {
  const core = useToastContext();
  const policy = useMotionPolicy();
  const rx = createVideReactivity();
  const instance = Vide.source<Frame | undefined>(undefined);
  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);

  const motion = createPresenceMotionBinding<Frame>(rx, {
    getInstance: () => instance(),
    present: () => read(props.visible ?? true) !== false,
    config: () => props.transition ?? NO_MOTION,
    disableAllMotion: () => policy().disableAllMotion,
    // The queue holds a toast until its exit reports back, which is what this tells it.
    onExitComplete: props.onExitComplete,
  });

  function render() {
    const merged: PassthroughProps<Frame> = applyElementSpec(core.rootSpec(), passthrough, {
      neutral: props.asChild !== true,
    });

    merged.Visible = () => motion.mounted() && (read(props.visible ?? true) !== false || motion.phase() !== "exited");

    if (props.asChild === true) {
      const child = resolveSlotInstance(props.children);
      if (child === undefined) {
        error("[ToastRoot] `asChild` requires a child instance.");
      }

      const target = child as Frame;
      instance(target);
      return applySlotProps(target, merged);
    }

    merged.action = (created: Frame) => instance(created);

    return <frame {...merged}>{props.children}</frame>;
  }

  return Vide.show(
    () => motion.mounted(),
    () => render(),
  );
}
