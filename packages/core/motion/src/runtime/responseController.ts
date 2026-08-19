import type { Reactivity } from "@lattice-ui/core-runtime";
import type { MotionStateTargets, ResponseMotionConfig } from "../core/types";
import { MotionHost } from "./host";
import { settleResponse } from "./response";

const MAX_MOUNT_ATTEMPTS = 120;

export interface ResponseMotionInputs {
  active: boolean;
  properties: MotionStateTargets;
  config?: ResponseMotionConfig;
  disableAllMotion?: boolean;
}

export interface ResponseMotionCore<T extends Instance = Instance> {
  /** See `PresenceMotionCore.sync`: the inputs are plain values, so the adapter says when they moved. */
  sync: (inputs: ResponseMotionInputs) => void;
}

export interface ResponseMotionControllerOptions<T extends Instance = Instance> {
  /** A getter, because the mount-retry loop below runs on later frames. */
  getInstance: () => T | undefined;
}

/**
 * Response motion: settles an instance onto whichever of two states is active.
 *
 * Unlike presence there is no phase to track — the first application snaps into place and every
 * later one settles — so the only state worth keeping is which host is being driven.
 */
export function createResponseMotion<T extends Instance = Instance>(
  rx: Reactivity,
  options: ResponseMotionControllerOptions<T>,
): ResponseMotionCore<T> {
  let motionHost: MotionHost | undefined;
  let isFirstApplication = true;
  let setupGeneration = 0;

  function sync(inputs: ResponseMotionInputs) {
    setupGeneration += 1;
    const generation = setupGeneration;
    let mountAttempts = 0;

    const applyMotion = () => {
      if (setupGeneration !== generation) {
        return;
      }

      const instance = options.getInstance();
      if (instance === undefined) {
        if (mountAttempts < MAX_MOUNT_ATTEMPTS) {
          mountAttempts += 1;
          task.delay(0, applyMotion);
        }
        return;
      }

      if (motionHost === undefined || motionHost.instance !== instance) {
        motionHost?.stop();
        motionHost = new MotionHost(instance, inputs.config?.target);
        isFirstApplication = true;
      } else {
        motionHost.setTargetContract(inputs.config?.target);
      }

      const motion = motionHost;
      const goals = inputs.active ? inputs.properties.active : inputs.properties.inactive;

      if (isFirstApplication) {
        isFirstApplication = false;
        motion.sync(goals, "response", "initial", inputs.config?.target);
        return;
      }

      if (inputs.disableAllMotion === true) {
        motion.sync(goals, "response", "settle", inputs.config?.target);
        return;
      }

      settleResponse(motion, goals, inputs.config?.settle, inputs.config?.target);
    };

    applyMotion();
  }

  rx.cleanup(() => {
    setupGeneration += 1;
    motionHost?.stop();
    motionHost = undefined;
  });

  return { sync };
}
