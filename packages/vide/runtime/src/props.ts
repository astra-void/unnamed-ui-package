import { omitOwnProps } from "@lattice-ui/core-runtime";
import type VideTypes from "@rbxts/vide";
import Vide from "./vide";

/**
 * Instance props a consumer passes through a primitive onto the element it renders.
 *
 * Unlike the React layer, every property here may also be a getter: Vide binds a function-valued
 * prop to the instance and re-applies it when its dependencies change.
 */
export type PassthroughProps<T extends Instance = GuiObject> = VideTypes.InstanceAttributes<T>;

/** Every prop except the ones the primitive owns, ready to apply to the rendered instance. */
export function getPassthroughProps<T extends Instance = GuiObject>(
  props: object,
  ownKeys: readonly string[],
): PassthroughProps<T> {
  return omitOwnProps(props, ownKeys) as PassthroughProps<T>;
}

/**
 * Runs both callbacks, the consumer's first.
 *
 * Vide has no event table: handlers are plain props, so composing them is a matter of wrapping the
 * two functions rather than merging a table as the React layer does.
 */
export function composeCallbacks(consumer: unknown, own: Callback): Callback {
  if (!typeIs(consumer, "function")) {
    return own;
  }

  const consumerCallback = consumer as Callback;

  return (...args: unknown[]) => {
    consumerCallback(...args);
    own(...args);
  };
}

/**
 * Binds a props table that is recomputed from reactive state, so every value in it stays live.
 *
 * Vide sets a concrete prop value once and binds a function-valued one, which makes spreading a
 * table that was computed from the theme a snapshot: the instance keeps whatever the theme said at
 * the moment the component ran, and a component runs exactly once. Wrapping each value in a getter
 * over one shared `derive` is what turns that table back into bindings — resolved once per change,
 * not once per property.
 *
 * Function values are handed through untouched. A function is already what Vide wants: an event
 * handler, an `action`, or a derivable the consumer passed in.
 *
 * The key set is the one the first resolution produced. A prop that disappears from a later
 * resolution keeps its first value rather than being cleared, because there is no correct value to
 * write to an instance property that a caller has stopped mentioning.
 */
export function bindDerivedProps<T extends Instance = GuiObject>(
  resolve: () => Record<string, unknown>,
): PassthroughProps<T> {
  const resolved = Vide.derive(resolve);
  const initial = Vide.untrack(resolved);
  const bound: Record<string, unknown> = {};

  for (const [rawKey, initialValue] of pairs(initial)) {
    const key = rawKey as string;

    if (typeIs(initialValue, "function")) {
      bound[key] = initialValue;
      continue;
    }

    bound[key] = () => {
      const nextValue = resolved()[key];
      return nextValue === undefined ? initialValue : nextValue;
    };
  }

  return bound as PassthroughProps<T>;
}

/**
 * Evaluates a component's children in the caller's scope.
 *
 * A context provider that renders no element of its own has to call its children itself. Vide's
 * `context(value, fn)` runs `fn` inside the new scope and returns its result, so returning the
 * children function instead of calling it hands the caller a closure that will run somewhere else
 * entirely — and a context set here is not in that scope's chain.
 */
export function renderChildren(children: VideTypes.Node): VideTypes.Node {
  return typeIs(children, "function") ? (children as () => VideTypes.Node)() : children;
}
