import { type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import {
  clearToasts,
  enqueueToast,
  finalizeToast,
  getVisibleToasts,
  pruneExpiredToasts,
  type ToastRecord,
} from "./queue";
import type { ToastCore, ToastOptions, ToastProviderOptions } from "./types";

const RunService = game.GetService("RunService");

// Roblox instance defaults are themselves a look. Neutralize only those; adapters spread them
// before consumer props so they stay overridable.
const FRAME_NEUTRAL: Partial<WritableInstanceProperties<Frame>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
};

const LABEL_NEUTRAL: Partial<WritableInstanceProperties<TextLabel>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

const BUTTON_NEUTRAL: Partial<WritableInstanceProperties<TextButton>> = {
  AutoButtonColor: false,
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

const DEFAULT_DURATION_MS = 4000;
const DEFAULT_MAX_VISIBLE = 3;

function nowMs() {
  return math.floor(os.clock() * 1000);
}

/** Toast queue behavior, free of any UI framework. */
export function createToast(rx: Reactivity, options: ToastProviderOptions = {}): ToastCore {
  const queueSource = rx.source<ToastRecord[]>([]);

  let idSequence = 0;
  let connection: RBXScriptConnection | undefined;

  function defaultDurationMs() {
    return math.max(0, read(options.defaultDurationMs ?? DEFAULT_DURATION_MS) ?? DEFAULT_DURATION_MS);
  }

  function maxVisible() {
    return math.max(1, read(options.maxVisible ?? DEFAULT_MAX_VISIBLE) ?? DEFAULT_MAX_VISIBLE);
  }

  function remove(id: string) {
    const currentQueue = queueSource.get();
    const index = currentQueue.findIndex((toast) => toast.id === id);
    if (index < 0) {
      return;
    }

    const toast = currentQueue[index];
    if (toast === undefined || toast.exiting) {
      return;
    }

    // A toast still waiting its turn was never on screen, so it has no exit to play.
    if (index >= maxVisible()) {
      queueSource.set(currentQueue.filter((entry) => entry.id !== id));
      return;
    }

    const nextQueue = [...currentQueue];
    nextQueue[index] = { ...toast, exiting: true, exitStartedAtMs: nowMs() };
    queueSource.set(nextQueue);
  }

  return {
    toasts: () => queueSource.get(),
    visibleToasts: () => getVisibleToasts(queueSource.get(), maxVisible()),
    defaultDurationMs,
    maxVisible,
    enqueue: (toastOptions: ToastOptions = {}) => {
      idSequence += 1;
      const id = toastOptions.id ?? `toast-${idSequence}`;

      queueSource.set(
        enqueueToast(queueSource.get(), {
          id,
          title: toastOptions.title,
          description: toastOptions.description,
          durationMs: toastOptions.durationMs,
          createdAtMs: nowMs(),
        }),
      );

      return id;
    },
    remove,
    finalize: (id: string) => {
      queueSource.set(finalizeToast(queueSource.get(), id));
    },
    clear: () => {
      queueSource.set(clearToasts(queueSource.get(), nowMs(), maxVisible()));
    },
    start: () => {
      if (connection !== undefined) {
        return;
      }

      // A sweep rather than a timer per toast: durations are read from the record each frame, so a
      // toast whose duration changes while it is up expires against the new one.
      connection = RunService.Heartbeat.Connect(() => {
        if (queueSource.get().size() === 0) {
          return;
        }

        queueSource.set(pruneExpiredToasts(queueSource.get(), nowMs(), maxVisible(), defaultDurationMs()));
      });

      rx.cleanup(() => {
        connection?.Disconnect();
        connection = undefined;
      });
    },
    viewportSpec: () => ({ neutral: FRAME_NEUTRAL }),
    rootSpec: () => ({ neutral: FRAME_NEUTRAL }),
    titleSpec: () => ({ neutral: LABEL_NEUTRAL }),
    descriptionSpec: () => ({ neutral: LABEL_NEUTRAL }),
    actionSpec: () => ({
      neutral: BUTTON_NEUTRAL,
      props: { Active: true, Selectable: true },
    }),
    closeSpec: (id: string): ElementSpec<TextButton> => ({
      neutral: BUTTON_NEUTRAL,
      props: { Active: true, Selectable: true },
      events: {
        Activated: () => {
          remove(id);
        },
      },
    }),
  };
}
