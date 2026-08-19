import {
  createProgressResponseRecipe,
  createResponseMotionBinding,
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
import { useProgressContext } from "./context";
import type { ProgressIndicatorProps } from "./types";

const OWN_PROPS = ["transition", "asChild", "children"] as const;

// The consumer's element fills the motion-owned host instead of re-applying the ratio itself.
const CHILD_FILL_PROPS = {
  Position: UDim2.fromScale(0, 0),
  Size: UDim2.fromScale(1, 1),
};

export function ProgressIndicator(props: ProgressIndicatorProps) {
  const core = useProgressContext();
  const policy = useMotionPolicy();
  const rx = createVideReactivity();
  const instance = Vide.source<Frame | undefined>(undefined);
  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);

  const config: ResponseMotionConfig = props.transition ?? createProgressResponseRecipe();

  createResponseMotionBinding<Frame>(rx, {
    getInstance: () => instance(),
    // The fill settles onto the current ratio rather than toggling, so there is no active state to
    // track — both of the core's states are the same target.
    active: true,
    properties: () => core.indicator.geometry(),
    config,
    disableAllMotion: () => policy().disableAllMotion,
  });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[ProgressIndicator] `asChild` requires a child instance.");
    }

    // The wrapper is ours — motion owns its geometry — so it keeps the neutral defaults, and the
    // consumer's instance only receives the passthrough and the fill geometry.
    const host = (
      <frame {...applyElementSpec(core.indicator.spec(), {})} action={(created: Frame) => instance(created)}>
        {applySlotProps(child as Frame, { ...passthrough, ...CHILD_FILL_PROPS })}
      </frame>
    );

    return host;
  }

  const merged = applyElementSpec(core.indicator.spec(), passthrough);
  merged.action = (created: Frame) => instance(created);

  return <frame {...merged}>{props.children}</frame>;
}
