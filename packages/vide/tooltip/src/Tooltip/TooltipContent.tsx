import { createDismissableLayer, createPresence } from "@lattice-ui/core-layer";
import { createPopper } from "@lattice-ui/core-popper";
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
import { useTooltipContext } from "./context";
import type { TooltipContentProps } from "./types";

const OWN_PROPS = [
  "transition",
  "asChild",
  "forceMount",
  "placement",
  "sideOffset",
  "alignOffset",
  "collisionPadding",
  "children",
] as const;

// Off-screen until the popper has measured, so the tooltip never flashes at the origin.
const HIDDEN_POSITION = UDim2.fromOffset(-9999, -9999);
const ZERO_SIZE = UDim2.fromOffset(0, 0);

// An unstyled tooltip has nothing to animate, so there is no default recipe. Presence timing is
// still owned here; consumers opt into motion with `transition`.
const NO_MOTION: PresenceMotionConfig = {};

export function TooltipContent(props: TooltipContentProps) {
  const core = useTooltipContext();
  const portalContext = usePortalContext();
  const policy = useMotionPolicy();
  const rx = createVideReactivity();
  const contentInstance = Vide.source<Frame | undefined>(undefined);
  const canvas = Vide.source<Frame | undefined>(undefined);
  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);

  // A tooltip dismisses on an outside press but never blocks it: it is not modal, and the press it
  // dismissed on should still reach whatever it landed on.
  const layer = createDismissableLayer(rx, {
    initialEnabled: core.open(),
    getContentBoundary: core.getContent,
    getFallbackBoundary: () => canvas(),
    getInsideRoots: () => [core.getTrigger()],
    getPortalContainer: () => portalContext.container,
    onDismiss: () => core.close(),
  });

  const popper = createPopper(rx, {
    getAnchor: core.getTrigger,
    getContent: core.getContent,
    enabled: () => core.open(),
    placement: props.placement,
    sideOffset: props.sideOffset,
    alignOffset: props.alignOffset,
    collisionPadding: props.collisionPadding,
  });

  const presence = createPresence(rx, { initialPresent: core.open() });

  const motion = createPresenceMotionBinding<Frame>(rx, {
    getInstance: () => contentInstance(),
    present: () => presence.isPresent(),
    config: () => props.transition ?? NO_MOTION,
    ready: () => popper.isPositioned(),
    forceMount: props.forceMount,
    disableAllMotion: () => policy().disableAllMotion,
    onExitComplete: () => presence.completeExit(),
  });

  layer.start();
  popper.start();

  rx.effect(() => {
    const open = core.open();
    layer.setEnabled(open);
    presence.setPresent(open);
  });

  function renderContent() {
    const merged: PassthroughProps<Frame> = applyElementSpec(core.contentSpec(), passthrough, {
      neutral: props.asChild !== true,
    });

    // The content measures itself so the popper can position it: measurement, not appearance.
    merged.AutomaticSize = Enum.AutomaticSize.XY;
    merged.Visible = () => motion.mounted() && (motion.phase() !== "exited" || props.forceMount === true);

    if (props.asChild === true) {
      const child = resolveSlotInstance(props.children);
      if (child === undefined) {
        error("[TooltipContent] `asChild` requires a child instance.");
      }

      const target = child as Frame;
      contentInstance(target);
      core.setContent(target);
      return applySlotProps(target, merged);
    }

    merged.action = (created: Frame) => {
      contentInstance(created);
      core.setContent(created);
    };

    return <frame {...merged}>{props.children}</frame>;
  }

  function renderPositioned() {
    return (
      <frame
        AnchorPoint={() => popper.anchorPoint()}
        BackgroundTransparency={1}
        BorderSizePixel={0}
        Position={() => (popper.isPositioned() ? popper.position() : HIDDEN_POSITION)}
        Size={() => {
          if (!popper.isPositioned()) {
            return ZERO_SIZE;
          }

          const size = popper.contentSize();
          return UDim2.fromOffset(size.X, size.Y);
        }}
      >
        {renderContent()}
      </frame>
    );
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
      <frame
        action={(instance: Frame) => canvas(instance)}
        BackgroundTransparency={1}
        BorderSizePixel={0}
        Position={() => layer.contentWrapperPosition()}
        Size={UDim2.fromScale(1, 1)}
        ZIndex={1}
      >
        {props.forceMount === true
          ? renderPositioned()
          : Vide.show(
              () => presence.mounted(),
              () => renderPositioned(),
            )}
      </frame>
    </screengui>
  );
}
