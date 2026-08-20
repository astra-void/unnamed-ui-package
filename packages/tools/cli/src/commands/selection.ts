import { usageError } from "../core/errors";
import type { FrameworkRegistry, Registry } from "../core/registry/schema";
import { didYouMean } from "../core/suggest";

export interface SelectionInput {
  names: string[];
  presets: string[];
}

/** Only the registry is needed, so selections can be validated before a CliContext exists. */
export interface SelectionSource {
  components: FrameworkRegistry;
}

export function resolveComponentSelection(source: SelectionSource, input: SelectionInput): string[] {
  const selected = new Set<string>();
  const registry = source.components;
  const componentNames = Object.keys(registry.packages);
  const presetNames = Object.keys(registry.presets).sort((left, right) => left.localeCompare(right));

  for (const name of input.names) {
    if (!registry.packages[name]) {
      // A component that exists but not for this framework is a different problem from a typo, and
      // suggesting a near-miss for it would send the reader looking for the wrong mistake.
      if (registry.unavailable.includes(name)) {
        throw usageError(
          `${name} has no ${registry.label} package yet.`,
          `It is available for other frameworks. Run \`lattice add --help\` to see what ${registry.label} ships.`,
        );
      }

      throw usageError(
        `Unknown component: ${name}`,
        didYouMean(name, componentNames),
        "Run `lattice add --help` for the full component list.",
      );
    }
    selected.add(name);
  }

  for (const preset of input.presets) {
    const presetMembers = registry.presets[preset];
    if (!presetMembers) {
      throw usageError(
        `Unknown preset: ${preset}`,
        didYouMean(preset, presetNames),
        `Available presets: ${presetNames.join(", ")}`,
      );
    }

    for (const member of presetMembers) {
      selected.add(member);
    }
  }

  const sorted = [...selected].sort((left, right) => left.localeCompare(right));
  if (sorted.length === 0) {
    throw usageError("No components selected. Provide component names or --preset.");
  }

  return sorted;
}

/**
 * Checks that a name is a component at all, before a package manager is detected.
 *
 * Detection can prompt or fail for reasons unrelated to the typo the reader actually made, so this
 * runs first. Whether the name ships for the project's framework is a question that needs the
 * project, and is answered by `resolveComponentSelection` once there is one.
 */
export function assertKnownComponentNames(registry: Registry, input: SelectionInput): void {
  const componentNames = Object.keys(registry.packages);
  const presetNames = Object.keys(registry.presets).sort((left, right) => left.localeCompare(right));

  for (const name of input.names) {
    if (!registry.packages[name]) {
      throw usageError(
        `Unknown component: ${name}`,
        didYouMean(name, componentNames),
        "Run `lattice add --help` for the full component list.",
      );
    }
  }

  for (const preset of input.presets) {
    if (!registry.presets[preset]) {
      throw usageError(
        `Unknown preset: ${preset}`,
        didYouMean(preset, presetNames),
        `Available presets: ${presetNames.join(", ")}`,
      );
    }
  }
}
