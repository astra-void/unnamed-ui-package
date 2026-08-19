// Through the layer's motion package, not core-motion directly: a value import that another
// dependency's declarations already resolved lands under that package's node_modules, where
// roblox-ts computes a scope of "..".
import {
  createResponseMotionBinding,
  motionSettle,
  motionTargets,
  type ResponseMotionConfig,
  useMotionPolicy,
} from "@lattice-ui/vide-motion";
import {
  applyElementSpec,
  applySlotProps,
  createVideReactivity,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useSwitchContext } from "./context";
import type { SwitchThumbProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

const MOTION_CONFIG: ResponseMotionConfig = {
  target: motionTargets.layout("switch thumb response"),
  settle: { duration: motionSettle.toggle, tempo: "swift", tone: "responsive" },
};

export function SwitchThumb(props: SwitchThumbProps) {
  const core = useSwitchContext();
  const policy = useMotionPolicy();
  const rx = createVideReactivity();
  const instance = Vide.source<Frame | undefined>(undefined);

  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);
  // Motion owns the thumb's placement under the `layout` contract, so these are dropped rather than
  // written and then silently clobbered on the next frame.
  passthrough.AnchorPoint = undefined;
  passthrough.Position = undefined;

  createResponseMotionBinding<Frame>(rx, {
    getInstance: () => instance(),
    active: () => core.checked(),
    properties: () => core.thumb.geometry(),
    config: MOTION_CONFIG,
    disableAllMotion: () => policy().disableAllMotion,
  });

  const merged = applyElementSpec(core.thumb.spec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[SwitchThumb] `asChild` requires a child instance.");
    }

    // Motion animates the consumer's instance directly here: Vide has no element to clone, so there
    // is no wrapper to keep the animated properties off it.
    const target = child as Frame;
    instance(target);
    return applySlotProps(target, merged);
  }

  merged.action = (created: Frame) => instance(created);

  return <frame {...merged}>{props.children}</frame>;
}
