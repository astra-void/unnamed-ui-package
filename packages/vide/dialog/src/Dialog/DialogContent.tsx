import { createDismissableLayer, createPresence } from "@lattice-ui/core-layer";
import { FocusLayerProvider, FocusScope } from "@lattice-ui/vide-focus";
import { createPresenceMotionBinding, type PresenceMotionConfig, useMotionPolicy } from "@lattice-ui/vide-motion";
import {
  applyElementSpec,
  applySlotProps,
  createVideReactivity,
  getPassthroughProps,
  type PassthroughProps,
  read,
  resolveSlotInstance,
  usePortalContext,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useDialogContext } from "./context";
import type { DialogContentProps } from "./types";

const OWN_PROPS = ["asChild", "transition", "forceMount", "trapFocus", "children"] as const;

// An unstyled dialog has nothing to animate, so there is no default recipe. Presence timing is still
// owned here; consumers opt into motion with `transition`.
const NO_MOTION: PresenceMotionConfig = {};

export function DialogContent(props: DialogContentProps) {
  const core = useDialogContext();
  const portalContext = usePortalContext();
  const policy = useMotionPolicy();
  const rx = createVideReactivity();
  const contentInstance = Vide.source<Frame | undefined>(undefined);
  const canvas = Vide.source<Frame | undefined>(undefined);
  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);

  const layer = createDismissableLayer(rx, {
    initialEnabled: core.open(),
    modal: core.modal(),
    getContentBoundary: () => contentInstance(),
    getFallbackBoundary: () => canvas(),
    getInsideRoots: () => [core.getTrigger()],
    getPortalContainer: () => portalContext.container,
    onDismiss: () => core.setOpen(false),
  });

  const presence = createPresence(rx, { initialPresent: core.open() });

  const motion = createPresenceMotionBinding<Frame>(rx, {
    getInstance: () => contentInstance(),
    present: () => presence.isPresent(),
    config: () => props.transition ?? NO_MOTION,
    forceMount: props.forceMount,
    disableAllMotion: () => policy().disableAllMotion,
    onExitComplete: () => presence.completeExit(),
  });

  layer.start();

  rx.effect(() => {
    const open = core.open();
    layer.setEnabled(open);
    presence.setPresent(open);
  });

  function render() {
    const merged: PassthroughProps<Frame> = applyElementSpec(core.contentSpec(), passthrough, {
      neutral: props.asChild !== true,
    });

    merged.Visible = () => motion.mounted() && (motion.phase() !== "exited" || props.forceMount === true);

    if (props.asChild === true) {
      const child = resolveSlotInstance(props.children);
      if (child === undefined) {
        error("[DialogContent] `asChild` requires a child instance.");
      }

      const target = child as Frame;
      contentInstance(target);
      return applySlotProps(target, merged);
    }

    merged.action = (created: Frame) => contentInstance(created);

    return <frame {...merged}>{props.children}</frame>;
  }

  return (
    <screengui
      DisplayOrder={() => portalContext.displayOrderBase + layer.stackOrder()}
      IgnoreGuiInset={layer.ignoresGuiInset()}
      Parent={portalContext.container}
      ResetOnSpawn={false}
      ScreenInsets={layer.ignoresGuiInset() ? Enum.ScreenInsets.None : Enum.ScreenInsets.CoreUISafeInsets}
      ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
    >
      {Vide.show(
        () => layer.blocksOutsidePointer(),
        () => (
          <textbutton
            Active={true}
            AutoButtonColor={false}
            BackgroundTransparency={1}
            BorderSizePixel={0}
            Modal={true}
            Position={UDim2.fromScale(0, 0)}
            Selectable={false}
            Size={UDim2.fromScale(1, 1)}
            Text=""
            TextTransparency={1}
            ZIndex={0}
          />
        ),
      )}
      <frame
        action={(instance: Frame) => canvas(instance)}
        BackgroundTransparency={1}
        BorderSizePixel={0}
        Position={() => layer.contentWrapperPosition()}
        Size={UDim2.fromScale(1, 1)}
        ZIndex={1}
      >
        <FocusLayerProvider layerOrder={() => layer.stackOrder()}>
          {() => (
            <FocusScope
              active={() => core.open()}
              restoreFocus={true}
              trapped={() => read(props.trapFocus ?? undefined) ?? core.modal()}
            >
              {props.forceMount === true
                ? render()
                : Vide.show(
                    () => motion.mounted(),
                    () => render(),
                  )}
            </FocusScope>
          )}
        </FocusLayerProvider>
      </frame>
    </screengui>
  );
}
