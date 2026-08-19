/**
 * Every prop except the ones a primitive owns.
 *
 * The filtering is framework-free; only the resulting type differs per layer, so each layer's
 * `runtime` re-exports this behind its own `PassthroughProps` type.
 */
export function omitOwnProps(props: object, ownKeys: readonly string[]): Record<string, unknown> {
  const rest: Record<string, unknown> = {};

  for (const [key, value] of pairs(props as Record<string, unknown>)) {
    if (!typeIs(key, "string")) {
      continue;
    }

    if (ownKeys.includes(key)) {
      continue;
    }

    rest[key] = value;
  }

  return rest;
}
