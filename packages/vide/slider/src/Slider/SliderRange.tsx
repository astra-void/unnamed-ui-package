import {
  createProgressResponseRecipe,
  createResponseMotionBinding,
  motionDrag,
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
import { useSliderContext } from "./context";
import type { SliderRangeProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function SliderRange(props: SliderRangeProps) {
  const core = useSliderContext();
  const policy = useMotionPolicy();
  const rx = createVideReactivity();
  const instance = Vide.source<Frame | undefined>(undefined);
  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);

  // Position and Size are the value mapping, not decoration, so motion owns them here.
  createResponseMotionBinding<Frame>(rx, {
    getInstance: () => instance(),
    active: true,
    properties: () => core.rangeGeometry(),
    config: () => createProgressResponseRecipe(core.isDragging() ? motionDrag.active : motionDrag.idle),
    disableAllMotion: () => policy().disableAllMotion,
  });

  const merged = applyElementSpec(core.rangeSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[SliderRange] `asChild` requires a child instance.");
    }

    const target = child as Frame;
    instance(target);
    return applySlotProps(target, merged);
  }

  merged.action = (created: Frame) => instance(created);

  return <frame {...merged}>{props.children}</frame>;
}
