import * as path from "node:path";
import { projectNotFoundError } from "./core/errors";
import { createLogger, type Logger } from "./core/logger";
import { detectPackageManager, type PackageManagerResolutionSource } from "./core/pm/detect";
import type { PackageManagerPin } from "./core/pm/devEngines";
import type { PackageManager, PackageManagerName } from "./core/pm/types";
import { findRoot } from "./core/project/findRoot";
import { type ResolvedFramework, resolveFramework } from "./core/project/framework";
import { readPackageJson } from "./core/project/readPackageJson";
import { loadRegistry } from "./core/registry/load";
import { type FrameworkRegistry, type Registry, resolveFrameworkRegistry } from "./core/registry/schema";

export interface ContextOptions {
  cwd: string;
  pm?: string;
  dryRun: boolean;
  yes: boolean;
  verbose?: boolean;
  /** Which layer the command is for. Detected from the project when it is not passed. */
  framework?: string;
}

export interface CliContext {
  cwd: string;
  projectRoot: string;
  packageJsonPath: string;
  options: ContextOptions;
  logger: Logger;
  pm: PackageManager;
  pmName: PackageManagerName;
  detectedLockfiles: PackageManagerName[];
  installedPackageManagers: PackageManagerName[];
  pmResolutionSource: PackageManagerResolutionSource;
  pins: PackageManagerPin[];
  /** Every framework, which is what `doctor` needs to recognize a package from any layer. */
  registry: Registry;
  /** The active framework's slice of it, which is what every other command works against. */
  components: FrameworkRegistry;
  framework: ResolvedFramework;
}

export async function createContext(
  options: ContextOptions,
  config?: { allowMissingProject?: boolean; registry?: Registry },
): Promise<CliContext> {
  const cwd = path.resolve(options.cwd);
  const allowMissingProject = config?.allowMissingProject ?? false;

  const projectRoot = (await findRoot(cwd)) ?? (allowMissingProject ? cwd : undefined);
  if (!projectRoot) {
    throw projectNotFoundError(cwd);
  }

  const logger = createLogger({
    verbose: options.verbose ?? false,
    yes: options.yes,
  });

  const pm = await detectPackageManager(projectRoot, options.pm, {
    stream: options.verbose ?? false,
    runtime: {
      yes: options.yes,
      stdin: process.stdin,
      stdout: process.stdout,
    },
  });
  const registry = config?.registry ?? (await loadRegistry());
  // A project without a package.json cannot say which framework it is on, which is only reachable
  // through `allowMissingProject`; the default framework covers it.
  const packageJson = await readPackageJson(projectRoot).catch(() => undefined);
  const framework = resolveFramework(registry, packageJson, options.framework);
  const components = resolveFrameworkRegistry(registry, framework.framework);

  return {
    cwd,
    projectRoot,
    packageJsonPath: path.join(projectRoot, "package.json"),
    options,
    logger,
    pm: pm.manager,
    pmName: pm.name,
    detectedLockfiles: pm.lockfiles,
    installedPackageManagers: pm.installed,
    pmResolutionSource: pm.source,
    pins: pm.pins,
    registry,
    components,
    framework,
  };
}
