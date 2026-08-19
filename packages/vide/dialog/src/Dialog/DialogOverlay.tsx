import { createPresence } from "@lattice-ui/core-layer";
import { createPresenceMotionBinding, type PresenceMotionConfig, useMotionPolicy } from "@lattice-ui/vide-motion";
import {
  applyElementSpec,
  applySlotProps,
  createVideReactivity,
  getPassthroughProps,
  type PassthroughProps,
  resolveSlotInstance,
  usePortalContext,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useDialogContext } from "./context";
import type { DialogOverlayProps } from "./types";

const OWN_PROPS = ["asChild", "forceMount", "children"] as const;

// An unstyled overlay has nothing to fade, so there is no default recipe. Presence timing is still
// owned here; consumers opt into motion by animating their own `asChild` overlay.
const NO_MOTION: PresenceMotionConfig = {};

export function DialogOverlay(props: DialogOverlayProps) {
  const core = useDialogContext();
  const portalContext = usePortalContext();
  const policy = useMotionPolicy();
  const rx = createVideReactivity();
  const instance = Vide.source<TextButton | undefined>(undefined);
  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);

  const presence = createPresence(rx, { initialPresent: core.open() });

  const motion = createPresenceMotionBinding<TextButton>(rx, {
    getInstance: () => instance(),
    present: () => presence.isPresent(),
    config: NO_MOTION,
    forceMount: props.forceMount,
    disableAllMotion: () => policy().disableAllMotion,
    onExitComplete: () => presence.completeExit(),
  });

  rx.effect(() => {
    presence.setPresent(core.open());
  });

  function render() {
    const merged: PassthroughProps<TextButton> = applyElementSpec(core.overlaySpec(), passthrough, {
      neutral: props.asChild !== true,
    });

    merged.Visible = () => motion.mounted() && motion.phase() !== "exited";

    if (props.asChild === true) {
      const child = resolveSlotInstance(props.children);
      if (child === undefined) {
        error("[DialogOverlay] `asChild` requires a child instance.");
      }

      const target = child as TextButton;
      instance(target);
      return applySlotProps(target, merged);
    }

    merged.action = (created: TextButton) => instance(created);
    merged.Size = UDim2.fromScale(1, 1);

    return <textbutton {...merged}>{props.children}</textbutton>;
  }

  // Its own ScreenGui below the dismissable layers, so the overlay dims what is behind the dialog
  // without covering the dialog itself.
  return (
    <screengui
      DisplayOrder={portalContext.displayOrderBase - 1}
      IgnoreGuiInset={true}
      Parent={portalContext.container}
      ResetOnSpawn={false}
      ScreenInsets={Enum.ScreenInsets.None}
      ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
    >
      {props.forceMount === true
        ? render()
        : Vide.show(
            () => motion.mounted(),
            () => render(),
          )}
    </screengui>
  );
}
