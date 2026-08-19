import type { Reactivity } from "@lattice-ui/core-runtime";
import { DEFAULT_PRESENCE_EXIT_FALLBACK_MS } from "../internals/constants";

export interface PresenceOptions {
  initialPresent?: boolean;
  exitFallbackMs?: number;
  onExitComplete?: () => void;
}

export interface PresenceCore {
  /**
   * Pushes the current presence in.
   *
   * Presence is edge-triggered — becoming absent starts an exit — so the input is a source this core
   * owns rather than a getter it polls. A React adapter cannot hand over a getter that tracks: a
   * boolean crossing a context boundary is a plain value, and reading it records no dependency.
   */
  setPresent: (present: boolean) => void;
  /** Whether the subtree should exist at all, which stays true through the exit. */
  mounted: () => boolean;
  /** Whether the subtree is entering/present, as opposed to playing its exit. */
  isPresent: () => boolean;
  /** Ends the exit now. Motion calls this when its exit transition finishes. */
  completeExit: () => void;
}

function cancelTask(runningTask: thread | undefined, currentThread?: thread) {
  if (runningTask === undefined || runningTask === currentThread) {
    return;
  }

  const [hasStatus, status] = pcall(() => coroutine.status(runningTask));
  if (hasStatus && status === "dead") {
    return;
  }

  pcall(() => {
    task.cancel(runningTask);
  });
}

/**
 * Presence timing: keeps a subtree mounted through its exit, and gives up after a fallback so an
 * exit whose completion never arrives cannot strand the subtree forever.
 *
 * Ported from the React `Presence` component; the timing is the primitive's, the rendering is not.
 */
export function createPresence(rx: Reactivity, options: PresenceOptions = {}): PresenceCore {
  const initialPresent = options.initialPresent === true;
  const mountedSource = rx.source(initialPresent);
  const isPresentSource = rx.source(initialPresent);

  let present = initialPresent;
  let fallbackTask: thread | undefined;
  let exitRequest = 0;

  function completeExitFor(request?: number) {
    if (request !== undefined && request !== exitRequest) {
      return;
    }

    if (present) {
      return;
    }

    if (!mountedSource.get()) {
      return;
    }

    cancelTask(fallbackTask, coroutine.running());
    fallbackTask = undefined;

    mountedSource.set(false);
    options.onExitComplete?.();
  }

  function setPresent(nextPresent: boolean) {
    if (nextPresent === present && mountedSource.get() === nextPresent) {
      return;
    }

    present = nextPresent;

    if (nextPresent) {
      cancelTask(fallbackTask, coroutine.running());
      fallbackTask = undefined;
      exitRequest += 1;

      mountedSource.set(true);
      isPresentSource.set(true);
      return;
    }

    if (!mountedSource.get()) {
      return;
    }

    isPresentSource.set(false);
    cancelTask(fallbackTask, coroutine.running());

    const timeoutMs = options.exitFallbackMs ?? DEFAULT_PRESENCE_EXIT_FALLBACK_MS;
    exitRequest += 1;
    const request = exitRequest;
    fallbackTask = task.delay(timeoutMs / 1000, () => {
      completeExitFor(request);
    });
  }

  rx.cleanup(() => {
    cancelTask(fallbackTask, coroutine.running());
    fallbackTask = undefined;
  });

  return {
    setPresent,
    mounted: () => mountedSource.get(),
    isPresent: () => isPresentSource.get(),
    completeExit: () => {
      completeExitFor(undefined);
    },
  };
}
