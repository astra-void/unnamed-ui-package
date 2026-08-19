import type { Reactivity } from "@lattice-ui/core-runtime";
import type { PresenceMotionConfig, PresenceMotionPhase } from "../core/types";
import { MotionHost } from "./host";
import { applyPresenceSnapshot, exitPresence, revealPresence } from "./presence";

const MAX_MOUNT_ATTEMPTS = 120;

export interface PresenceMotionInputs {
  present: boolean;
  config: PresenceMotionConfig;
  forceMount?: boolean;
  /** Leave undefined to let the core's own `markReady` decide. */
  ready?: boolean;
  disableAllMotion?: boolean;
}

export interface PresenceMotionCore<T extends Instance = Instance> {
  /**
   * Applies the inputs.
   *
   * Every input here is a plain value in React — a config object, a boolean prop — so the adapter
   * says when they changed rather than the core polling for it. See §3.5 of the architecture doc.
   */
  sync: (inputs: PresenceMotionInputs) => void;
  phase: () => PresenceMotionPhase;
  mounted: () => boolean;
  ready: () => boolean;
  markReady: () => void;
  onExitComplete: (handler: (() => void) | undefined) => void;
}

export interface PresenceMotionControllerOptions<T extends Instance = Instance> {
  /**
   * Where to read the instance from.
   *
   * A getter rather than a value: the mount-retry loop below runs on later frames and has to see the
   * instance that exists *then*, not the one that did when the sync started.
   */
  getInstance: () => T | undefined;
  onExitComplete?: () => void;
}

/**
 * The presence motion state machine, free of any UI framework.
 *
 * Ported from the React `usePresenceMotionController` hook with its generation counters intact: a
 * later `sync` invalidates the retries and completions still in flight from an earlier one, which is
 * what keeps a fast open/close/open from resolving an exit that no longer applies.
 */
export function createPresenceMotion<T extends Instance = Instance>(
  rx: Reactivity,
  options: PresenceMotionControllerOptions<T>,
): PresenceMotionCore<T> {
  const phaseSource = rx.source<PresenceMotionPhase>("exited");
  const markedReadySource = rx.source(true);

  let motionHost: MotionHost | undefined;
  let setupGeneration = 0;
  let completedExitGeneration: number | undefined;
  let hasEntered = false;
  let onExitCompleteHandler = options.onExitComplete;
  let lastInputs: PresenceMotionInputs = { present: false, config: {} };

  function setPhase(nextPhase: PresenceMotionPhase) {
    phaseSource.set(nextPhase);
  }

  function resolveReady(inputs: PresenceMotionInputs) {
    return inputs.ready !== undefined ? inputs.ready : markedReadySource.get();
  }

  function resolveMounted(inputs: PresenceMotionInputs) {
    return inputs.forceMount === true || inputs.present || phaseSource.get() !== "exited";
  }

  function sync(inputs: PresenceMotionInputs) {
    lastInputs = inputs;

    setupGeneration += 1;
    const generation = setupGeneration;
    const ready = resolveReady(inputs);
    const mounted = resolveMounted(inputs);
    let mountAttempts = 0;

    const completeExit = () => {
      if (setupGeneration !== generation) {
        return;
      }

      if (completedExitGeneration === generation) {
        return;
      }
      completedExitGeneration = generation;

      hasEntered = false;
      setPhase("exited");
      onExitCompleteHandler?.();
    };

    const completeReveal = () => {
      if (setupGeneration !== generation) {
        return;
      }

      setPhase("visible");
    };

    const applyMotion = () => {
      if (setupGeneration !== generation) {
        return;
      }

      const instance = options.getInstance();
      if (instance === undefined) {
        if (!inputs.present && phaseSource.get() !== "exited") {
          completeExit();
          return;
        }

        if (mounted && mountAttempts < MAX_MOUNT_ATTEMPTS) {
          mountAttempts += 1;
          task.delay(0, applyMotion);
        }
        return;
      }

      if (motionHost === undefined || motionHost.instance !== instance) {
        motionHost?.stop();
        motionHost = new MotionHost(instance, inputs.config.target);
        hasEntered = false;
      } else {
        motionHost.setTargetContract(inputs.config.target);
      }
      const motion = motionHost;

      if (inputs.present) {
        completedExitGeneration = undefined;
        const entering = !hasEntered || phaseSource.get() !== "visible";

        if (entering) {
          setPhase("mounted");
          applyPresenceSnapshot(motion, inputs.config.initial, "initial", inputs.config.target);
        }

        if (!ready) {
          setPhase("preparing");
          return;
        }

        setPhase("ready");
        hasEntered = true;

        const revealTarget = inputs.config.reveal?.target ?? inputs.config.target;

        if (!inputs.config.reveal) {
          completeReveal();
          return;
        }

        if (inputs.disableAllMotion === true) {
          applyPresenceSnapshot(motion, inputs.config.reveal.values, "reveal", revealTarget);
          completeReveal();
          return;
        }

        revealPresence(motion, inputs.config.reveal.values, inputs.config.reveal.intent, completeReveal, revealTarget);
        return;
      }

      if (phaseSource.get() === "exited" && !hasEntered) {
        if (inputs.forceMount === true) {
          applyPresenceSnapshot(
            motion,
            inputs.config.exit?.values ?? inputs.config.initial,
            "exited",
            inputs.config.exit?.target ?? inputs.config.target,
          );
        }
        return;
      }

      setPhase("exiting");

      if (!inputs.config.exit) {
        completeExit();
        return;
      }

      const exitTarget = inputs.config.exit.target ?? inputs.config.target;

      if (inputs.disableAllMotion === true) {
        applyPresenceSnapshot(motion, inputs.config.exit.values, "exit", exitTarget);
        completeExit();
        return;
      }

      exitPresence(motion, inputs.config.exit.values, inputs.config.exit.intent, completeExit, exitTarget);
    };

    applyMotion();
  }

  rx.cleanup(() => {
    setupGeneration += 1;
    motionHost?.stop();
    motionHost = undefined;
  });

  return {
    sync,
    phase: () => phaseSource.get(),
    mounted: () => resolveMounted(lastInputs),
    ready: () => resolveReady(lastInputs),
    markReady: () => {
      markedReadySource.set(true);
    },
    onExitComplete: (handler) => {
      onExitCompleteHandler = handler;
    },
  };
}
