import { type ElementSpec, read } from "@lattice-ui/core-runtime";
import { composeEvents, type PassthroughProps } from "./props";
import { composeRefs } from "./refs";

export interface ApplyElementSpecOptions {
  /**
   * Whether to apply the primitive's neutral Roblox defaults. Off under `asChild`: the rendered
   * element belongs to the consumer, so a primitive has no business neutralizing its defaults.
   */
  neutral?: boolean;
}

function hasEntries(record: Record<string, unknown> | undefined): boolean {
  if (record === undefined) {
    return false;
  }

  return next(record)[0] !== undefined;
}

/**
 * Translates a core's `ElementSpec` into props for the element React renders.
 *
 * Spread order is the guarantee this function exists to keep: neutral defaults, then consumer
 * passthrough, then behavior — so consumers can override a default but never the behavior. Consumer
 * event handlers are composed with the core's rather than replaced.
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
      merged[key as string] = read(value as never);
    }
  }

  if (hasEntries(spec.events as Record<string, unknown> | undefined)) {
    merged.Event = composeEvents(merged.Event, spec.events as Record<string, Callback>);
  }

  if (hasEntries(spec.changes as Record<string, unknown> | undefined)) {
    merged.Change = composeEvents(merged.Change, spec.changes as Record<string, Callback>);
  }

  const refs = spec.refs;
  if (refs !== undefined && refs[0] !== undefined) {
    // A React ref also fires with `undefined` on unmount, which a core must not read as teardown —
    // that is what `Reactivity.cleanup` is for. Passing it through unchanged keeps the two honest.
    merged.ref = composeRefs<T>(merged.ref as never, ...(refs as Array<(instance: T | undefined) => void>));
  }

  return merged as PassthroughProps<T>;
}
