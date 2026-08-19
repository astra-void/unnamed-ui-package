/**
 * The framework-free contract every Lattice UI adapter layer is built on.
 *
 * Nothing here imports a UI framework. Behavior cores are written against `Reactivity`, which the
 * `react` and `vide` layers each supply an implementation of, and describe what they render as an
 * `ElementSpec`, which each layer's `runtime` translates into that framework's shape.
 *
 * See docs/architecture/multi-framework.md.
 */

/**
 * A value a caller may supply either directly or as a getter.
 *
 * Adapters pass state in as getters: React closes over a ref it refreshes each render, Vide passes
 * its own source. Cores read them through `read`, never by assuming one form.
 */
export type Derivable<T> = T | (() => T);

/** Reactive state cell. Vide's `source()` is a getter/setter in one call; this splits the two. */
export interface Source<T> {
  get: () => T;
  set: (nextValue: T) => void;
}

/**
 * The reactivity primitives a core needs, injected rather than imported.
 *
 * Vide maps onto this almost verbatim. React backs it with an observable plus a subscription hook,
 * because a React component re-renders where a Vide component runs once and reacts through effects.
 */
export interface Reactivity {
  source: <T>(initial: T) => Source<T>;
  derive: <T>(compute: () => T) => () => T;
  effect: (run: () => void) => void;
  /** Registers teardown. Cores must use this rather than treating a ref callback as an unmount signal. */
  cleanup: (dispose: () => void) => void;
  batch: (run: () => void) => void;
  untrack: <T>(read: () => T) => T;
}

/** Instance properties that may be bound to state, so each one is derivable. */
export type DerivableProps<T extends Instance> = {
  [K in keyof WritableInstanceProperties<T>]?: Derivable<WritableInstanceProperties<T>[K]>;
};

/**
 * What a core wants rendered, described without reference to any framework.
 *
 * Adapters are responsible for the spread order Lattice UI guarantees: neutral defaults, then
 * consumer passthrough, then behavior props — with consumer event handlers composed with, never
 * replaced by, the ones a core supplies.
 */
export interface ElementSpec<T extends Instance = GuiObject> {
  /** Roblox instance defaults the primitive neutralizes. Always static; never appearance. */
  neutral?: Partial<WritableInstanceProperties<T>>;
  /** Behavior props, bound to core state where they derive from it. */
  props?: DerivableProps<T>;
  /** Signal handlers keyed by signal name, such as `Activated` or `InputBegan`. */
  events?: Record<string, Callback>;
  /** Property-change handlers keyed by property name, such as `AbsoluteSize`. */
  changes?: Record<string, Callback>;
  /**
   * Instance access callbacks.
   *
   * React invokes these with `undefined` on unmount; Vide's `action` only fires on creation. Treat
   * them as "the instance now exists" and put teardown in `Reactivity.cleanup`.
   */
  refs?: Array<(instance: T | undefined) => void>;
}

/** Resolves a `Derivable` to its current value. */
export function read<T>(value: Derivable<T>): T {
  if (typeIs(value, "function")) {
    return (value as () => T)();
  }

  return value as T;
}
