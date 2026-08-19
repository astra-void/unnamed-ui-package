import type { PresenceMotionConfig } from "@lattice-ui/core-motion";
import { createPresenceMotionBinding, useMotionPolicy } from "@lattice-ui/vide-motion";
import {
  applyElementSpec,
  applySlotProps,
  createVideReactivity,
  getPassthroughProps,
  type PassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useCheckboxContext } from "./context";
import type { CheckboxIndicatorProps } from "./types";

const OWN_PROPS = ["transition", "forceMount", "asChild", "children"] as const;

// An unstyled indicator has nothing to animate, so there is no default recipe. Presence timing is
// still owned here; consumers opt into motion with `transition`.
const NO_MOTION: PresenceMotionConfig = {};

export function CheckboxIndicator(props: CheckboxIndicatorProps) {
  // Read at the top level, then close over it: the render body below runs inside `show`, which is a
  // scope of its own where the context is no longer resolvable.
  const core = useCheckboxContext();
  const policy = useMotionPolicy();
  const rx = createVideReactivity();
  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);

  const instance = Vide.source<Frame | undefined>(undefined);

  const motion = createPresenceMotionBinding<Frame>(rx, {
    getInstance: () => instance(),
    present: () => core.indicator.present(),
    config: () => props.transition ?? NO_MOTION,
    forceMount: props.forceMount,
    disableAllMotion: () => policy().disableAllMotion,
  });

  function render() {
    const merged: PassthroughProps<Frame> = applyElementSpec(core.indicator.spec(), passthrough, {
      neutral: props.asChild !== true,
    });

    merged.Visible = () => motion.mounted() && (core.indicator.present() || motion.phase() !== "exited");

    if (props.asChild === true) {
      const child = resolveSlotInstance(props.children);
      if (child === undefined) {
        error("[CheckboxIndicator] `asChild` requires a child instance.");
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

  // The motion core keeps the indicator mounted through its exit, so `show` follows that rather than
  // the checked state directly — otherwise an exit transition would be cut off at its first frame.
  return Vide.show(
    () => motion.mounted(),
    () => render(),
  );
}
