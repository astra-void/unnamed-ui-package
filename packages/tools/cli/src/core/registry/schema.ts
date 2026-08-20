import { registryInvalidError } from "../errors";

/**
 * A component is one name across every framework that ships it, and one npm package per framework.
 *
 * Keying by bare name is what lets `lattice add dialog` mean the same request whichever layer the
 * project is on, and what lets the registry say plainly that a component has no Vide package yet.
 */
export interface RegistryFrameworkPackage {
  npm: string;
  /** Overrides the framework's peers rather than adding to them. */
  peers?: string[];
  providers?: string[];
  notes?: string[];
}

export interface RegistryPackageEntry {
  frameworks: Record<string, RegistryFrameworkPackage>;
}

export interface RegistryFramework {
  label: string;
  peers: string[];
  /** Packages whose presence in a project means the project is on this framework. */
  detect: string[];
}

export interface Registry {
  frameworks: Record<string, RegistryFramework>;
  defaultFramework: string;
  packages: Record<string, RegistryPackageEntry>;
  presets: Record<string, string[]>;
}

/** One framework's slice of the registry, which is what every command actually works against. */
export interface ResolvedRegistryEntry {
  npm: string;
  peers?: string[];
  providers?: string[];
  notes?: string[];
}

export interface FrameworkRegistry {
  framework: string;
  label: string;
  packages: Record<string, ResolvedRegistryEntry>;
  presets: Record<string, string[]>;
  /** Components the registry knows about that this framework has no package for. */
  unavailable: string[];
}

export interface ProviderRequirement {
  raw: string;
  packageName: string;
  providerName?: string;
  optional: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function readStringArray(value: unknown, path: string): string[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!isStringArray(value)) {
    throw registryInvalidError(`${path} must be an array of strings.`);
  }

  return value.slice();
}

function readRequiredStringArray(value: unknown, path: string): string[] {
  if (!isStringArray(value)) {
    throw registryInvalidError(`${path} must be an array of strings.`);
  }

  return value.slice();
}

export function parseProviderRequirement(rawValue: string): ProviderRequirement {
  const optional = rawValue.endsWith("?");
  const normalized = optional ? rawValue.slice(0, -1) : rawValue;
  const [packageName, providerName] = normalized.split(":");

  if (!packageName || packageName.trim().length === 0) {
    throw registryInvalidError(`Invalid provider requirement "${rawValue}".`);
  }

  return {
    raw: rawValue,
    packageName,
    providerName: providerName && providerName.length > 0 ? providerName : undefined,
    optional,
  };
}

function parseFrameworkPackage(rawEntry: unknown, path: string): RegistryFrameworkPackage {
  if (!isRecord(rawEntry)) {
    throw registryInvalidError(`${path} must be an object.`);
  }

  if (typeof rawEntry.npm !== "string" || rawEntry.npm.length === 0) {
    throw registryInvalidError(`${path}.npm must be a non-empty string.`);
  }

  const providers = readStringArray(rawEntry.providers, `${path}.providers`);
  if (providers) {
    for (const provider of providers) {
      parseProviderRequirement(provider);
    }
  }

  return {
    npm: rawEntry.npm,
    peers: readStringArray(rawEntry.peers, `${path}.peers`),
    providers,
    notes: readStringArray(rawEntry.notes, `${path}.notes`),
  };
}

function parseFrameworks(source: unknown): Record<string, RegistryFramework> {
  if (!isRecord(source)) {
    throw registryInvalidError("components.json.frameworks must be an object.");
  }

  const frameworks: Record<string, RegistryFramework> = {};
  for (const [name, rawFramework] of Object.entries(source)) {
    if (!isRecord(rawFramework)) {
      throw registryInvalidError(`components.json.frameworks.${name} must be an object.`);
    }

    if (typeof rawFramework.label !== "string" || rawFramework.label.length === 0) {
      throw registryInvalidError(`components.json.frameworks.${name}.label must be a non-empty string.`);
    }

    frameworks[name] = {
      label: rawFramework.label,
      peers: readRequiredStringArray(rawFramework.peers, `components.json.frameworks.${name}.peers`),
      detect: readRequiredStringArray(rawFramework.detect, `components.json.frameworks.${name}.detect`),
    };
  }

  if (Object.keys(frameworks).length === 0) {
    throw registryInvalidError("components.json.frameworks must declare at least one framework.");
  }

  return frameworks;
}

export function validateRegistry(componentsSource: unknown, presetsSource: unknown): Registry {
  if (!isRecord(componentsSource)) {
    throw registryInvalidError("components.json must be an object.");
  }

  if (!isRecord(presetsSource)) {
    throw registryInvalidError("presets.json must be an object.");
  }

  const frameworks = parseFrameworks(componentsSource.frameworks);

  const defaultFramework = componentsSource.defaultFramework;
  if (typeof defaultFramework !== "string" || !frameworks[defaultFramework]) {
    throw registryInvalidError("components.json.defaultFramework must name a declared framework.");
  }

  const packagesSource = componentsSource.packages;
  if (!isRecord(packagesSource)) {
    throw registryInvalidError("components.json.packages must be an object.");
  }

  const packages: Record<string, RegistryPackageEntry> = {};
  for (const [componentName, rawEntry] of Object.entries(packagesSource)) {
    if (!isRecord(rawEntry)) {
      throw registryInvalidError(`components.json.packages.${componentName} must be an object.`);
    }

    const frameworksSource = rawEntry.frameworks;
    if (!isRecord(frameworksSource)) {
      throw registryInvalidError(`components.json.packages.${componentName}.frameworks must be an object.`);
    }

    const componentFrameworks: Record<string, RegistryFrameworkPackage> = {};
    for (const [frameworkName, rawFrameworkEntry] of Object.entries(frameworksSource)) {
      if (!frameworks[frameworkName]) {
        throw registryInvalidError(
          `components.json.packages.${componentName}.frameworks.${frameworkName} names an undeclared framework.`,
        );
      }

      componentFrameworks[frameworkName] = parseFrameworkPackage(
        rawFrameworkEntry,
        `components.json.packages.${componentName}.frameworks.${frameworkName}`,
      );
    }

    if (Object.keys(componentFrameworks).length === 0) {
      throw registryInvalidError(`components.json.packages.${componentName} ships for no framework.`);
    }

    packages[componentName] = { frameworks: componentFrameworks };
  }

  const presetsContainer = presetsSource.presets;
  if (!isRecord(presetsContainer)) {
    throw registryInvalidError("presets.json.presets must be an object.");
  }

  const presets: Record<string, string[]> = {};
  for (const [presetName, rawPreset] of Object.entries(presetsContainer)) {
    if (!isStringArray(rawPreset)) {
      throw registryInvalidError(`presets.json.presets.${presetName} must be an array of component names.`);
    }

    const presetMembers = rawPreset.slice();
    for (const componentName of presetMembers) {
      if (!packages[componentName]) {
        throw registryInvalidError(
          `presets.json.presets.${presetName} references unknown component "${componentName}".`,
        );
      }
    }

    presets[presetName] = presetMembers;
  }

  return { frameworks, defaultFramework, packages, presets };
}

/**
 * Narrows the registry to one framework.
 *
 * A preset keeps its name across frameworks and loses the members that framework has no package
 * for, so `--preset overlay` stays a single request rather than becoming a different list per
 * layer. What was dropped is reported through `unavailable`, never silently.
 */
export function resolveFrameworkRegistry(registry: Registry, framework: string): FrameworkRegistry {
  const frameworkEntry = registry.frameworks[framework];
  if (!frameworkEntry) {
    throw registryInvalidError(`Unknown framework: ${framework}.`);
  }

  const packages: Record<string, ResolvedRegistryEntry> = {};
  const unavailable: string[] = [];

  for (const [componentName, entry] of Object.entries(registry.packages)) {
    const forFramework = entry.frameworks[framework];
    if (!forFramework) {
      unavailable.push(componentName);
      continue;
    }

    packages[componentName] = {
      npm: forFramework.npm,
      peers: forFramework.peers ?? frameworkEntry.peers.slice(),
      providers: forFramework.providers,
      notes: forFramework.notes,
    };
  }

  const presets: Record<string, string[]> = {};
  for (const [presetName, members] of Object.entries(registry.presets)) {
    const available = members.filter((member) => packages[member] !== undefined);
    if (available.length > 0) {
      presets[presetName] = available;
    }
  }

  return {
    framework,
    label: frameworkEntry.label,
    packages,
    presets,
    unavailable: unavailable.sort((left, right) => left.localeCompare(right)),
  };
}
