import { omitOwnProps } from "@lattice-ui/core-runtime";
import type Vide from "@rbxts/vide";

/**
 * Instance props a consumer passes through a primitive onto the element it renders.
 *
 * Unlike the React layer, every property here may also be a getter: Vide binds a function-valued
 * prop to the instance and re-applies it when its dependencies change.
 */
export type PassthroughProps<T extends Instance = GuiObject> = Vide.InstanceAttributes<T>;

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
