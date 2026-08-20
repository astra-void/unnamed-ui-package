import type { Derivable, ElementSpec } from "@lattice-ui/core-runtime";
import type { ToastRecord } from "./queue";

export interface ToastOptions {
  id?: string;
  title?: string;
  description?: string;
  durationMs?: number;
}

export interface ToastProviderOptions {
  defaultDurationMs?: Derivable<number | undefined>;
  /** How many toasts show at once; the rest wait their turn. */
  maxVisible?: Derivable<number | undefined>;
}

export interface ToastCore {
  toasts: () => ToastRecord[];
  visibleToasts: () => ToastRecord[];
  defaultDurationMs: () => number;
  maxVisible: () => number;
  enqueue: (options?: ToastOptions) => string;
  /** Starts a toast's exit, or drops it outright if it never became visible. */
  remove: (id: string) => void;
  /** Ends an exit, which is what the motion completion reports. */
  finalize: (id: string) => void;
  clear: () => void;
  /** Starts the expiry sweep. Idempotent; stops through the reactivity's cleanup. */
  start: () => void;
  viewportSpec: () => ElementSpec<Frame>;
  rootSpec: () => ElementSpec<Frame>;
  titleSpec: () => ElementSpec<TextLabel>;
  descriptionSpec: () => ElementSpec<TextLabel>;
  actionSpec: () => ElementSpec<TextButton>;
  closeSpec: (id: string) => ElementSpec<TextButton>;
}
