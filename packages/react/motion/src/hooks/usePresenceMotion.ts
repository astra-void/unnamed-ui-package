import { createPresenceMotion, type PresenceMotionConfig, type PresenceMotionPhase } from "@lattice-ui/core-motion";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { useMotionPolicy } from "../core/policy";

export interface PresenceMotionControllerOptions {
  present: boolean;
  config: PresenceMotionConfig;
  ready?: boolean;
  forceMount?: boolean;
  onExitComplete?: () => void;
}

export interface PresenceMotionController<T extends Instance = Instance> {
  ref: React.MutableRefObject<T | undefined>;
  phase: PresenceMotionPhase;
  mounted: boolean;
  ready: boolean;
  present: boolean;
  isExiting: boolean;
  isVisible: boolean;
  markReady: () => void;
}

/**
 * React binding for the presence motion core.
 *
 * The state machine — phases, the mount-retry loop, the generation counters that keep a stale exit
 * from resolving — lives in `@lattice-ui/core-motion`. What is React here is the ref the consumer
 * writes into and the dependency list that tells the core its inputs moved.
 */
export function usePresenceMotionController<T extends Instance = Instance>(
  options: PresenceMotionControllerOptions,
): PresenceMotionController<T> {
  const ref = React.useRef<T>();
  const policy = useMotionPolicy();
  const optionsRef = React.useRef(options);
  optionsRef.current = options;

  const core = useLatticeCore((rx) =>
    createPresenceMotion<T>(rx, {
      getInstance: () => ref.current,
      onExitComplete: () => optionsRef.current.onExitComplete?.(),
    }),
  );

  const phase = core.phase();
  const mounted = options.forceMount === true || options.present || phase !== "exited";

  React.useLayoutEffect(() => {
    core.sync({
      present: options.present,
      config: options.config,
      forceMount: options.forceMount,
      ready: options.ready,
      disableAllMotion: policy.disableAllMotion,
    });
  }, [core, mounted, options.config, options.forceMount, options.present, options.ready, policy.disableAllMotion]);

  return {
    ref,
    phase,
    mounted,
    ready: core.ready(),
    present: options.present,
    isExiting: phase === "exiting",
    isVisible: phase === "ready" || phase === "visible",
    markReady: core.markReady,
  };
}

export function usePresenceMotion<T extends Instance = Instance>(
  present: boolean,
  config: PresenceMotionConfig,
  onExitComplete?: () => void,
): React.MutableRefObject<T | undefined> {
  return usePresenceMotionController<T>({
    present,
    config,
    forceMount: true,
    onExitComplete,
  }).ref;
}
