import { createSpinner } from "@lattice-ui/core-progress";
import {
  applyElementSpec,
  applySlotProps,
  createVideReactivity,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import type { SpinnerProps } from "./types";

const OWN_PROPS = ["spinning", "speedDegPerSecond", "asChild", "children"] as const;

export function Spinner(props: SpinnerProps) {
  const core = createSpinner(createVideReactivity(), {
    spinning: props.spinning,
    speedDegPerSecond: props.speedDegPerSecond,
  });

  core.start();

  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);
  const merged = applyElementSpec(core.spec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[Spinner] `asChild` requires a child instance.");
    }

    const target = child as Frame;
    core.setInstance(target);
    return applySlotProps(target, merged);
  }

  merged.action = (created: Frame) => core.setInstance(created);

  return <frame {...merged}>{props.children}</frame>;
}
