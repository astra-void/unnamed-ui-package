import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadRegistry } from "../../../packages/tools/cli/src/core/registry/load";
import { resolveFrameworkRegistry, validateRegistry } from "../../../packages/tools/cli/src/core/registry/schema";

const tempDirs: string[] = [];

const FRAMEWORKS = {
  react: { label: "React", peers: ["@rbxts/react", "@rbxts/react-roblox"], detect: ["@rbxts/react"] },
  vide: { label: "Vide", peers: ["@rbxts/vide"], detect: ["@rbxts/vide"] },
};

async function createRegistryDir() {
  const dir = await mkdtemp(path.join(os.tmpdir(), "lattice-cli-registry-"));
  tempDirs.push(dir);
  return dir;
}

async function readPublishedNames(layer: string): Promise<string[]> {
  const layerDir = path.resolve(__dirname, "../../../packages", layer);
  const entries = await readdir(layerDir, { withFileTypes: true });
  const names: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const manifest = JSON.parse(await readFile(path.join(layerDir, entry.name, "package.json"), "utf8")) as {
      name: string;
      private?: boolean;
    };

    if (manifest.private !== true) {
      names.push(manifest.name);
    }
  }

  return names.sort();
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe("registry loading", () => {
  it("loads valid split registry files", async () => {
    const dir = await createRegistryDir();
    await writeFile(
      path.join(dir, "components.json"),
      JSON.stringify(
        {
          frameworks: FRAMEWORKS,
          defaultFramework: "react",
          packages: {
            popover: {
              frameworks: {
                react: {
                  npm: "@lattice-ui/react-popover",
                  providers: ["@lattice-ui/react-layer:PortalProvider?"],
                },
                vide: {
                  npm: "@lattice-ui/vide-popover",
                  providers: ["@lattice-ui/vide-runtime:PortalProvider?"],
                },
              },
            },
          },
        },
        null,
        2,
      ),
      "utf8",
    );

    await writeFile(
      path.join(dir, "presets.json"),
      JSON.stringify({ presets: { overlay: ["popover"] } }, null, 2),
      "utf8",
    );

    const registry = await loadRegistry(dir);
    expect(registry.packages.popover.frameworks.react.npm).toBe("@lattice-ui/react-popover");
    expect(registry.packages.popover.frameworks.vide.npm).toBe("@lattice-ui/vide-popover");
    expect(registry.presets.overlay).toEqual(["popover"]);
  });

  it("ships a registry entry for every published package in both layers", async () => {
    const registry = await loadRegistry(path.resolve(__dirname, "../../../packages/tools/cli/registry"));

    for (const layer of ["react", "vide"]) {
      const registered = Object.values(registry.packages)
        .map((entry) => entry.frameworks[layer]?.npm)
        .filter((npm): npm is string => npm !== undefined)
        .sort();

      expect(registered).toEqual(await readPublishedNames(layer));
    }
  });

  it("fails when a component names an undeclared framework", () => {
    expect(() =>
      validateRegistry(
        {
          frameworks: FRAMEWORKS,
          defaultFramework: "react",
          packages: {
            style: { frameworks: { fusion: { npm: "@lattice-ui/fusion-style" } } },
          },
        },
        { presets: {} },
      ),
    ).toThrow(/undeclared framework/i);
  });

  it("fails when the default framework is not one of the declared ones", () => {
    expect(() =>
      validateRegistry(
        {
          frameworks: FRAMEWORKS,
          defaultFramework: "fusion",
          packages: { style: { frameworks: { react: { npm: "@lattice-ui/react-style" } } } },
        },
        { presets: {} },
      ),
    ).toThrow(/defaultFramework/i);
  });

  it("fails when preset references unknown component", () => {
    expect(() =>
      validateRegistry(
        {
          frameworks: FRAMEWORKS,
          defaultFramework: "react",
          packages: { style: { frameworks: { react: { npm: "@lattice-ui/react-style" } } } },
        },
        { presets: { form: ["checkbox"] } },
      ),
    ).toThrow(/unknown component/i);
  });

  it("fails when package schema is invalid", () => {
    expect(() =>
      validateRegistry(
        {
          frameworks: FRAMEWORKS,
          defaultFramework: "react",
          packages: { style: { frameworks: { react: { npm: 3 } } } },
        },
        { presets: {} },
      ),
    ).toThrow(/must be a non-empty string/i);
  });
});

describe("framework resolution", () => {
  const registry = validateRegistry(
    {
      frameworks: FRAMEWORKS,
      defaultFramework: "react",
      packages: {
        dialog: {
          frameworks: {
            react: { npm: "@lattice-ui/react-dialog", providers: ["@lattice-ui/react-layer:PortalProvider?"] },
            vide: { npm: "@lattice-ui/vide-dialog", providers: ["@lattice-ui/vide-runtime:PortalProvider?"] },
          },
        },
        layer: { frameworks: { react: { npm: "@lattice-ui/react-layer" } } },
      },
    },
    { presets: { overlay: ["dialog", "layer"] } },
  );

  it("narrows to one framework's packages", () => {
    const vide = resolveFrameworkRegistry(registry, "vide");

    expect(Object.keys(vide.packages)).toEqual(["dialog"]);
    expect(vide.packages.dialog.npm).toBe("@lattice-ui/vide-dialog");
    expect(vide.packages.dialog.providers).toEqual(["@lattice-ui/vide-runtime:PortalProvider?"]);
  });

  it("falls back to the framework's peers when a component declares none", () => {
    expect(resolveFrameworkRegistry(registry, "vide").packages.dialog.peers).toEqual(["@rbxts/vide"]);
    expect(resolveFrameworkRegistry(registry, "react").packages.dialog.peers).toEqual([
      "@rbxts/react",
      "@rbxts/react-roblox",
    ]);
  });

  it("keeps a preset's name and drops only the members the framework has no package for", () => {
    expect(resolveFrameworkRegistry(registry, "react").presets.overlay).toEqual(["dialog", "layer"]);
    expect(resolveFrameworkRegistry(registry, "vide").presets.overlay).toEqual(["dialog"]);
  });

  it("reports what the framework does not ship rather than hiding it", () => {
    expect(resolveFrameworkRegistry(registry, "vide").unavailable).toEqual(["layer"]);
    expect(resolveFrameworkRegistry(registry, "react").unavailable).toEqual([]);
  });

  it("rejects a framework the registry does not declare", () => {
    expect(() => resolveFrameworkRegistry(registry, "fusion")).toThrow(/unknown framework/i);
  });
});
