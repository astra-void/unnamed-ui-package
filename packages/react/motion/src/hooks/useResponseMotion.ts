import { createResponseMotion, type MotionStateTargets, type ResponseMotionConfig } from "@lattice-ui/core-motion";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { useMotionPolicy } from "../core/policy";

/**
 * React binding for the response motion core.
 *
 * The host handling and the mount-retry loop live in `@lattice-ui/core-motion`; the dependency list
 * here is what tells the core that the active state, the targets or the policy moved.
 */
export function useResponseMotion<T extends Instance = Instance>(
  active: boolean,
  properties: MotionStateTargets,
  config?: ResponseMotionConfig,
): React.MutableRefObject<T | undefined> {
  const ref = React.useRef<T>();
  const policy = useMotionPolicy();

  const core = useLatticeCore((rx) => createResponseMotion<T>(rx, { getInstance: () => ref.current }));

  React.useLayoutEffect(() => {
    core.sync({ active, properties, config, disableAllMotion: policy.disableAllMotion });
  }, [active, config, core, policy.disableAllMotion, properties]);

  return ref;
}
