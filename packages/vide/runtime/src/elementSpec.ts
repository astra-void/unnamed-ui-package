import type { ElementSpec } from "@lattice-ui/core-runtime";
import { composeCallbacks, type PassthroughProps } from "./props";

export interface ApplyElementSpecOptions {
  /**
   * Whether to apply the primitive's neutral Roblox defaults. Off under `asChild`: the rendered
   * element belongs to the consumer, so a primitive has no business neutralizing its defaults.
   */
  neutral?: boolean;
}

/**
 * Translates a core's `ElementSpec` into props for the instance Vide creates.
 *
 * Spread order is the guarantee this function exists to keep: neutral defaults, then consumer
 * passthrough, then behavior. Derivable behavior props are passed through as the getters the core
 * produced — binding them is exactly what Vide does with a function-valued prop, so unlike the
 * React layer nothing is resolved here.
 */
export function applyElementSpec<T extends Instance>(
  spec: ElementSpec<T>,
  passthrough: PassthroughProps<T>,
  options: ApplyElementSpecOptions = {},
): PassthroughProps<T> {
  const merged: Record<string, unknown> = {};

  if (options.neutral !== false && spec.neutral !== undefined) {
    for (const [key, value] of pairs(spec.neutral as Record<string, unknown>)) {
      merged[key as string] = value;
    }
  }

  for (const [key, value] of pairs(passthrough as unknown as Record<string, unknown>)) {
    merged[key as string] = value;
  }

  if (spec.props !== undefined) {
    for (const [key, value] of pairs(spec.props as Record<string, unknown>)) {
      merged[key as string] = value;
    }
  }

  if (spec.events !== undefined) {
    for (const [eventName, handler] of pairs(spec.events as Record<string, Callback>)) {
      const key = eventName as string;
      merged[key] = composeCallbacks(merged[key], handler);
    }
  }

  if (spec.changes !== undefined) {
    // Vide spells a property-change handler as a `<Prop>Changed` prop, which it turns into a
    // `changed()` action internally.
    for (const [propertyName, handler] of pairs(spec.changes as Record<string, Callback>)) {
      const key = `${propertyName as string}Changed`;
      merged[key] = composeCallbacks(merged[key], handler);
    }
  }

  const refs = spec.refs;
  if (refs !== undefined && refs[0] !== undefined) {
    // Vide's `action` fires once, when the instance is created, and never with `undefined` — which
    // is why a core registers teardown through `Reactivity.cleanup` instead of on a ref callback.
    const consumerAction = merged.action;
    const specRefs = refs as Array<(instance: T | undefined) => void>;

    merged.action = (instance: T) => {
      if (typeIs(consumerAction, "function")) {
        (consumerAction as Callback)(instance);
      }

      for (const ref of specRefs) {
        ref(instance);
      }
    };
  }

  return merged as PassthroughProps<T>;
}
