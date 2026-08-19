import {
  createPresenceMotion,
  createResponseMotion,
  type MotionStateTargets,
  type PresenceMotionConfig,
  type PresenceMotionCore,
  type ResponseMotionConfig,
  type ResponseMotionCore,
} from "@lattice-ui/core-motion";
import { type Derivable, type Reactivity, read, Vide } from "@lattice-ui/vide-runtime";

export interface PresenceMotionBindingOptions<T extends Instance = Instance> {
  getInstance: () => T | undefined;
  present: Derivable<boolean>;
  config?: Derivable<PresenceMotionConfig | undefined>;
  forceMount?: Derivable<boolean | undefined>;
  ready?: Derivable<boolean | undefined>;
  disableAllMotion?: () => boolean;
  onExitComplete?: () => void;
}

/**
 * Drives the presence motion core from Vide sources.
 *
 * The effect tracks the inputs and nothing else: `sync` reads the machine's own phase to decide
 * whether the subtree is mounted, and writes it right after — tracked, that read would make every
 * phase change re-enter `sync` and never settle. Untracking the call is what keeps the effect's
 * dependencies to the inputs a caller actually passed.
 */
export function createPresenceMotionBinding<T extends Instance = Instance>(
  rx: Reactivity,
  options: PresenceMotionBindingOptions<T>,
): PresenceMotionCore<T> {
  const core = createPresenceMotion<T>(rx, {
    getInstance: options.getInstance,
    onExitComplete: options.onExitComplete,
  });

  rx.effect(() => {
    const inputs = {
      present: read(options.present),
      config: read(options.config ?? undefined) ?? {},
      forceMount: read(options.forceMount ?? false) === true,
      ready: read(options.ready ?? undefined),
      disableAllMotion: options.disableAllMotion?.() ?? false,
    };

    Vide.untrack(() => {
      core.sync(inputs);
    });
  });

  return core;
}

export interface ResponseMotionBindingOptions<T extends Instance = Instance> {
  getInstance: () => T | undefined;
  active: Derivable<boolean>;
  properties: Derivable<MotionStateTargets>;
  config?: Derivable<ResponseMotionConfig | undefined>;
  disableAllMotion?: () => boolean;
}

/**
 * Drives the response motion core from Vide sources.
 *
 * Same shape as the presence binding, and untracked for the same reason: `sync` reaches into a host
 * whose reads are none of this effect's business.
 */
export function createResponseMotionBinding<T extends Instance = Instance>(
  rx: Reactivity,
  options: ResponseMotionBindingOptions<T>,
): ResponseMotionCore<T> {
  const core = createResponseMotion<T>(rx, { getInstance: options.getInstance });

  rx.effect(() => {
    const inputs = {
      active: read(options.active),
      properties: read(options.properties),
      config: read(options.config ?? undefined),
      disableAllMotion: options.disableAllMotion?.() ?? false,
    };

    Vide.untrack(() => {
      core.sync(inputs);
    });
  });

  return core;
}
