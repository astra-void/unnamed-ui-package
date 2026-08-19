import type { Reactivity, Source } from "./contract";

type Subscriber = () => void;

/**
 * The effect currently running, so a source read inside it records a dependency. Module state is
 * fine here: reactive work is synchronous, and Roblox scripts are single-threaded per VM.
 */
let activeSubscriber: Subscriber | undefined;

export interface StandaloneReactivity extends Reactivity {
  /** Runs every registered cleanup. Adapters call this when the owning component unmounts. */
  dispose: () => void;
}

export interface StandaloneReactivityOptions {
  /**
   * Called after any source changes.
   *
   * Vide does not need this — its effects drive the instance tree directly. React does: state
   * living outside React is invisible to it until something schedules a render, and this is what
   * the React adapter hooks up to that.
   */
  onChange?: () => void;
}

/**
 * A small synchronous reactivity implementation for adapters whose framework has none of its own.
 *
 * `Reactivity` exists so cores never import a framework; this is the fallback implementation of it,
 * used by the React layer (wrapped with a re-render notification) and by tests, while Vide supplies
 * its own.
 */
export function createStandaloneReactivity(options: StandaloneReactivityOptions = {}): StandaloneReactivity {
  // Reassigned rather than emptied in place: `Array.clear()` exists in roblox-ts's types but not in
  // the JS runtime the vitest harness runs this same source under, and `size()` / `length` have no
  // spelling the two agree on.
  let disposers: Array<() => void> = [];

  function source<T>(initial: T): Source<T> {
    let value = initial;
    const subscribers = new Set<Subscriber>();

    return {
      get: () => {
        if (activeSubscriber !== undefined) {
          subscribers.add(activeSubscriber);
        }

        return value;
      },
      set: (nextValue: T) => {
        if (nextValue === value) {
          return;
        }

        value = nextValue;

        // Snapshot first: a subscriber may add or drop subscriptions as it runs.
        const pending: Subscriber[] = [];
        for (const subscriber of subscribers) {
          pending.push(subscriber);
        }
        for (const subscriber of pending) {
          subscriber();
        }

        options.onChange?.();
      },
    };
  }

  return {
    source,
    // No memoization: a getter that recomputes is always correct, and cores derive from a handful
    // of sources. Vide's `derive` memoizes; nothing may depend on which of the two it gets.
    derive: <T>(compute: () => T) => compute,
    effect: (run: () => void) => {
      const wrapped = () => {
        const previous = activeSubscriber;
        activeSubscriber = wrapped;
        run();
        activeSubscriber = previous;
      };

      wrapped();
    },
    cleanup: (dispose: () => void) => {
      disposers.push(dispose);
    },
    batch: (run: () => void) => {
      run();
    },
    untrack: <T>(read: () => T): T => {
      const previous = activeSubscriber;
      activeSubscriber = undefined;
      const value = read();
      activeSubscriber = previous;

      return value;
    },
    dispose: () => {
      const pending = disposers;
      disposers = [];

      for (const dispose of pending) {
        dispose();
      }
    },
  };
}
