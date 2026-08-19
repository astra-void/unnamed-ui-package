import { type Derivable, type Reactivity, read } from "./contract";

export interface ControllableStateOptions<T> {
  /** The controlled value. `undefined` means uncontrolled; pass a getter so it stays live. */
  value?: Derivable<T | undefined>;
  defaultValue: T;
  onChange?: (next: T) => void;
}

export interface ControllableState<T> {
  get: () => T;
  set: (nextValue: T | ((previous: T) => T)) => void;
  isControlled: () => boolean;
}

function isUpdater<T>(value: T | ((previous: T) => T)): value is (previous: T) => T {
  return typeIs(value, "function");
}

/**
 * Controlled/uncontrolled state with the semantics every Lattice UI primitive relies on.
 *
 * Ported from the React `useControllableState` hook so both layers get the same behavior — notably
 * that a controlled parent which rejects a change keeps receiving `onChange` on every attempt,
 * rather than having the second attempt swallowed by a stale internal value.
 *
 * `onChange` is captured once. Adapters whose callbacks are re-created every render (React) must
 * pass a stable wrapper that dispatches to the current one.
 */
export function createControllableState<T>(rx: Reactivity, options: ControllableStateOptions<T>): ControllableState<T> {
  const inner = rx.source(options.defaultValue);

  function readControlled(): T | undefined {
    return options.value === undefined ? undefined : read(options.value);
  }

  function isControlled() {
    return readControlled() !== undefined;
  }

  function get(): T {
    const controlled = readControlled();

    return controlled !== undefined ? controlled : inner.get();
  }

  function set(nextValue: T | ((previous: T) => T)) {
    const current = get();
    const computed = isUpdater(nextValue) ? nextValue(current) : nextValue;

    if (computed === current) {
      return;
    }

    // Only uncontrolled state advances: writing the source makes the new value visible to a
    // second updater in the same frame. In controlled mode the parent may reject the change, and
    // advancing anything here would make every retry hit the equality check above and silently
    // swallow `onChange`.
    if (!isControlled()) {
      inner.set(computed);
    }

    options.onChange?.(computed);
  }

  return { get, set, isControlled };
}
