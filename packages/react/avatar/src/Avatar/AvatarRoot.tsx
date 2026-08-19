import { createAvatar } from "@lattice-ui/core-avatar";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { AvatarContextProvider } from "./context";
import type { AvatarProps } from "./types";

export function AvatarRoot(props: AvatarProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createAvatar(rx, {
      src: () => propsRef.current.src,
      delayMs: () => propsRef.current.delayMs,
    }),
  );

  // The reveal delay re-arms on a source or timing change, which the core cannot observe from a
  // plain prop. Declared after the image's own effects run, so a "loaded" reported in this commit
  // survives — resetting over it would leave a cached texture blank forever.
  React.useEffect(() => {
    core.syncSource();
  }, [core, props.delayMs, props.src]);

  const status = core.status();
  const delayElapsed = core.delayElapsed();

  const contextValue = React.useMemo(
    () => ({ src: props.src, status, setStatus: core.setStatus, delayElapsed, core }),
    [core, delayElapsed, props.src, status],
  );

  return <AvatarContextProvider value={contextValue}>{props.children}</AvatarContextProvider>;
}

export { AvatarRoot as Avatar };
