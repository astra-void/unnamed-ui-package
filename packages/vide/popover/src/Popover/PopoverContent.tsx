import { createDismissableLayer, createPresence } from "@lattice-ui/core-layer";
import type { PresenceMotionConfig } from "@lattice-ui/core-motion";
import { createPopper } from "@lattice-ui/core-popper";
import { createPresenceMotionBinding, useMotionPolicy } from "@lattice-ui/vide-motion";
import {
  applyElementSpec,
  applySlotProps,
  createVideReactivity,
  getPassthroughProps,
  resolveSlotInstance,
  usePortalContext,
  Vide,
} from "@lattice-ui/vide-runtime";
import { usePopoverContext } from "./context";
import type { PopoverContentProps } from "./types";

const OWN_PROPS = [
  "asChild",
  "transition",
  "forceMount",
  "placement",
  "sideOffset",
  "alignOffset",
  "collisionPadding",
  "children",
] as const;

// Off-screen until the popper has measured, so the content never flashes at the origin.
const HIDDEN_POSITION = UDim2.fromOffset(-9999, -9999);
const ZERO_SIZE = UDim2.fromOffset(0, 0);

// An unstyled popover has nothing to animate, so there is no default entrance recipe. Presence
// timing is still owned here; consumers opt into motion with `transition`.
const NO_MOTION: PresenceMotionConfig = {};

export function PopoverContent(props: PopoverContentProps) {
  const core = usePopoverContext();
  const portalContext = usePortalContext();
  const policy = useMotionPolicy();
  const rx = createVideReactivity();
  const contentInstance = Vide.source<Frame | undefined>(undefined);
  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);

  // The layer's own full-screen canvas, used as the dismissal boundary until real content exists.
  const canvas = Vide.source<Frame | undefined>(undefined);

  const layer = createDismissableLayer(rx, {
    initialEnabled: core.open(),
    modal: core.modal(),
    getContentBoundary: core.getContent,
    getFallbackBoundary: () => canvas(),
    getInsideRoots: core.getInsideRoots,
    getPortalContainer: () => portalContext.container,
    onDismiss: () => {
      core.setOpen(false);
    },
  });

  const popper = createPopper(rx, {
    getAnchor: core.getAnchor,
    getContent: core.getContent,
    enabled: () => core.open(),
    placement: props.placement,
    sideOffset: props.sideOffset,
    alignOffset: props.alignOffset,
    collisionPadding: props.collisionPadding,
  });

  const presence = createPresence(rx, { initialPresent: core.open() });

  // Motion drives the exit: `presence` keeps the subtree alive until the transition reports back, and
  // its fallback timeout is what ends an exit that never does.
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

  // Open state is a source here, so pushing it into the edge-triggered cores is a plain effect —
  // where the React adapter needs a dependency array to notice the same change.
  rx.effect(() => {
    const open = core.open();
    layer.setEnabled(open);
    presence.setPresent(open);
  });

  function renderContent() {
    const merged = applyElementSpec(core.contentSpec(), passthrough, { neutral: props.asChild !== true });

    merged.Visible = () => motion.mounted() && (motion.phase() !== "exited" || props.forceMount === true);

    if (props.asChild === true) {
      const child = resolveSlotInstance(props.children);
      if (child === undefined) {
        error("[PopoverContent] `asChild` requires a child instance.");
      }

      // AutomaticSize is left to the child too: under `asChild` the consumer owns that element's
      // layout, so the primitive contributes measurement only through the wrapper below.
      const target = child as Frame;
      contentInstance(target);
      return applySlotProps(target, merged);
    }

    merged.action = (created: Frame) => contentInstance(created);

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
