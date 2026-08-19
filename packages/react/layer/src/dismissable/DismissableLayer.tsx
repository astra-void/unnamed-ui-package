import { createDismissableLayer } from "@lattice-ui/core-layer";
import { FocusLayerProvider } from "@lattice-ui/react-focus";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { Portal } from "../portal/Portal";
import { usePortalContext } from "../portal/PortalProvider";
import type { DismissableLayerProps } from "./types";

/**
 * React binding for the dismissable layer core.
 *
 * Stack registration, promotion on open and the outside-pointer test live in
 * `@lattice-ui/core-layer`; what remains here is the ScreenGui, the optional input blocker and the
 * canvas the content sits on.
 */
export function DismissableLayer(props: DismissableLayerProps) {
  const enabled = props.enabled ?? true;
  const portalContext = usePortalContext();
  const contentWrapperRef = React.useRef<Frame>();

  const propsRef = React.useRef(props);
  propsRef.current = props;
  const containerRef = React.useRef(portalContext.container);
  containerRef.current = portalContext.container;

  const core = useLatticeCore((rx) =>
    createDismissableLayer(rx, {
      initialEnabled: propsRef.current.enabled ?? true,
      modal: propsRef.current.modal,
      disableOutsidePointerEvents: propsRef.current.disableOutsidePointerEvents,
      getContentBoundary: () => propsRef.current.contentBoundaryRef?.current,
      getFallbackBoundary: () => contentWrapperRef.current,
      getInsideRoots: () =>
        propsRef.current.insideRoots?.() ?? (propsRef.current.insideRefs ?? []).map((ref) => ref.current),
      getPortalContainer: () => containerRef.current,
      onDismiss: () => propsRef.current.onDismiss?.(),
      onPointerDownOutside: (event) => propsRef.current.onPointerDownOutside?.(event),
      onInteractOutside: (event) => propsRef.current.onInteractOutside?.(event),
    }),
  );

  React.useEffect(() => {
    core.start();
  }, [core]);

  React.useEffect(() => {
    core.setEnabled(enabled);
  }, [core, enabled]);

  const stackOrder = core.stackOrder();
  const layerIgnoresGuiInset = core.ignoresGuiInset();

  return (
    <Portal>
      {/* Stable key: keying by stackOrder destroyed and recreated the whole
          subtree one commit after every mount/open (stackOrder starts at 0 and
          changes once registration resolves). DisplayOrder is a plain prop and
          updates in place. */}
      <screengui
        key="Layer"
        DisplayOrder={portalContext.displayOrderBase + stackOrder}
        IgnoreGuiInset={layerIgnoresGuiInset}
        ResetOnSpawn={false}
        ScreenInsets={layerIgnoresGuiInset ? Enum.ScreenInsets.None : Enum.ScreenInsets.CoreUISafeInsets}
        ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
      >
        {core.blocksOutsidePointer() ? (
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
        ) : undefined}
        <frame
          BackgroundTransparency={1}
          BorderSizePixel={0}
          Position={core.contentWrapperPosition()}
          Size={UDim2.fromScale(1, 1)}
          ref={contentWrapperRef}
          ZIndex={1}
        >
          <FocusLayerProvider layerOrder={stackOrder}>{props.children}</FocusLayerProvider>
        </frame>
      </screengui>
    </Portal>
  );
}
