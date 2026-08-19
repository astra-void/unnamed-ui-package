import { createPresence } from "@lattice-ui/core-layer";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import type { PresenceProps } from "./types";

/**
 * React binding for the presence core.
 *
 * The timing — staying mounted through an exit, and the fallback that ends one that never reports
 * completion — lives in `@lattice-ui/core-layer`. This component pushes `present` in and renders.
 */
export function Presence(props: PresenceProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createPresence(rx, {
      initialPresent: propsRef.current.present,
      exitFallbackMs: propsRef.current.exitFallbackMs,
      onExitComplete: () => propsRef.current.onExitComplete?.(),
    }),
  );

  React.useEffect(() => {
    core.setPresent(props.present);
  }, [core, props.present]);

  if (!core.mounted()) {
    return undefined;
  }

  const render = props.render ?? props.children;
  if (!render) {
    return undefined;
  }

  return render({
    isPresent: core.isPresent(),
    onExitComplete: core.completeExit,
  });
}
