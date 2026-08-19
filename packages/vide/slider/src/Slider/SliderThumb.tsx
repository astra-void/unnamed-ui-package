import { useFocusNode } from "@lattice-ui/vide-focus";
import { createResponseMotionBinding, createSliderThumbResponseRecipe, useMotionPolicy } from "@lattice-ui/vide-motion";
import {
  applyElementSpec,
  applySlotProps,
  createVideReactivity,
  getPassthroughProps,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useSliderContext } from "./context";
import type { SliderThumbProps } from "./types";

const OWN_PROPS = ["asChild", "children"] as const;

export function SliderThumb(props: SliderThumbProps) {
  const core = useSliderContext();
  const policy = useMotionPolicy();
  const rx = createVideReactivity();
  const instance = Vide.source<GuiObject | undefined>(undefined);

  useFocusNode({
    getGuiObject: () => instance(),
    disabled: () => core.disabled(),
    // Arrow keys along the value axis adjust the slider, so the navigation controller passes them
    // through; cross-axis directions move focus away.
    getCapturesDirectional: (direction) => core.capturesDirectional(direction),
  });

  createResponseMotionBinding<GuiObject>(rx, {
    getInstance: () => instance(),
    active: true,
    properties: () => core.thumbGeometry(),
    config: () => createSliderThumbResponseRecipe(core.isDragging()),
    disableAllMotion: () => policy().disableAllMotion,
  });

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(core.thumbSpec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[SliderThumb] `asChild` requires a child instance.");
    }

    const target = child as TextButton;
    instance(target);
    return applySlotProps(target, merged);
  }

  merged.action = (created: TextButton) => instance(created);

  return <textbutton {...merged}>{props.children}</textbutton>;
}
