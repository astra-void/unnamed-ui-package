import { usageError } from "../errors";
import { getDependencyNames } from "../fs/patch";
import type { Registry } from "../registry/schema";
import { didYouMean } from "../suggest";
import type { PackageJson } from "./readPackageJson";

export type FrameworkSource = "flag" | "dependency" | "default";

export interface ResolvedFramework {
  framework: string;
  source: FrameworkSource;
}

/**
 * Which frameworks the project's dependencies point at.
 *
 * A project is on a framework if it depends on that framework itself or on any package from that
 * layer, which is what makes `lattice add` in an existing project need no flag.
 */
export function detectProjectFrameworks(registry: Registry, packageJson: PackageJson | undefined): string[] {
  if (!packageJson) {
    return [];
  }

  const installed = getDependencyNames(packageJson);
  const detected: string[] = [];

  for (const [name, framework] of Object.entries(registry.frameworks)) {
    const byPeer = framework.detect.some((packageName) => installed.has(packageName));
    const byLayer = [...installed].some((packageName) => packageName.startsWith(`@lattice-ui/${name}-`));

    if (byPeer || byLayer) {
      detected.push(name);
    }
  }

  return detected.sort((left, right) => left.localeCompare(right));
}

export function assertKnownFramework(registry: Registry, framework: string): string {
  if (registry.frameworks[framework]) {
    return framework;
  }

  const names = Object.keys(registry.frameworks).sort((left, right) => left.localeCompare(right));
  throw usageError(
    `Unknown framework: ${framework}`,
    didYouMean(framework, names),
    `Available frameworks: ${names.join(", ")}`,
  );
}

/**
 * Settles on one framework.
 *
 * An explicit flag always wins. Otherwise the project's own dependencies decide, and a project that
 * carries both layers is asked rather than guessed at — picking one would install into the wrong
 * half of a codebase that deliberately runs two.
 */
export function resolveFramework(
  registry: Registry,
  packageJson: PackageJson | undefined,
  requested: string | undefined,
): ResolvedFramework {
  if (requested !== undefined) {
    return { framework: assertKnownFramework(registry, requested), source: "flag" };
  }

  const detected = detectProjectFrameworks(registry, packageJson);

  if (detected.length === 1) {
    return { framework: detected[0], source: "dependency" };
  }

  if (detected.length > 1) {
    throw usageError(
      `This project depends on more than one framework: ${detected.join(", ")}.`,
      "Pass --framework to say which one this command is for.",
      `Example: --framework ${detected[0]}`,
    );
  }

  return { framework: registry.defaultFramework, source: "default" };
}

/** How the active framework was chosen, for the fields block of a command's output. */
export function describeFramework(ctx: { components: { label: string }; framework: ResolvedFramework }): string {
  const suffix =
    ctx.framework.source === "flag" ? "--framework" : ctx.framework.source === "dependency" ? "detected" : "default";

  return `${ctx.components.label} (${suffix})`;
}
