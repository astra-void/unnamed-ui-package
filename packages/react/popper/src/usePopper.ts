import { createPopper } from "@lattice-ui/core-popper";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import type { UsePopperOptions, UsePopperResult } from "./types";

/**
 * React binding for `@lattice-ui/core-popper`.
 *
 * Everything that measures, observes and computes lives in the core; this hook exists to hand it
 * React's refs as getters, to start it on mount, and to expose its state as the plain values a
 * render pass wants.
 */
export function usePopper(options: UsePopperOptions): UsePopperResult {
  const optionsRef = React.useRef(options);
  optionsRef.current = options;

  const core = useLatticeCore((rx) =>
    createPopper(rx, {
      getAnchor: () => optionsRef.current.getAnchor?.() ?? optionsRef.current.anchorRef?.current,
      getContent: () => optionsRef.current.getContent?.() ?? optionsRef.current.contentRef?.current,
      enabled: () => optionsRef.current.enabled,
      placement: () => optionsRef.current.placement,
      sideOffset: () => optionsRef.current.sideOffset,
      alignOffset: () => optionsRef.current.alignOffset,
      collisionPadding: () => optionsRef.current.collisionPadding,
    }),
  );

  // Layout effect, as before: measurement should settle in the same commit the content mounted in
  // rather than a frame later.
  React.useLayoutEffect(() => {
    core.start();
  }, [core]);

  // Positioning options are plain props: nothing about them is reactive, so React's dependency list
  // is what tells the core they changed. The core's own Heartbeat would catch it a frame later.
  React.useLayoutEffect(() => {
    core.sync();
  }, [core, options.alignOffset, options.collisionPadding, options.enabled, options.placement, options.sideOffset]);

  const position = core.position();
  const anchorPoint = core.anchorPoint();
  const placement = core.placement();
  const contentSize = core.contentSize();
  const isPositioned = core.isPositioned();
  const update = core.update;

  // The core only writes a source when the value actually changed, so these identities are stable
  // across renders and this memo keeps the result object stable for consumers' dependency arrays.
  return React.useMemo(
    () => ({ position, anchorPoint, placement, contentSize, isPositioned, update }),
    [anchorPoint, contentSize, isPositioned, placement, position, update],
  );
}
