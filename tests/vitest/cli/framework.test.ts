import { describe, expect, it } from "vitest";
import { detectProjectFrameworks, resolveFramework } from "../../../packages/tools/cli/src/core/project/framework";
import { type Registry, validateRegistry } from "../../../packages/tools/cli/src/core/registry/schema";

const registry: Registry = validateRegistry(
  {
    frameworks: {
      react: { label: "React", peers: ["@rbxts/react", "@rbxts/react-roblox"], detect: ["@rbxts/react"] },
      vide: { label: "Vide", peers: ["@rbxts/vide"], detect: ["@rbxts/vide"] },
    },
    defaultFramework: "react",
    packages: {
      dialog: {
        frameworks: { react: { npm: "@lattice-ui/react-dialog" }, vide: { npm: "@lattice-ui/vide-dialog" } },
      },
    },
  },
  { presets: {} },
);

describe("framework detection", () => {
  it("reads the framework a project already depends on", () => {
    expect(detectProjectFrameworks(registry, { dependencies: { "@rbxts/vide": "^0.6.1" } })).toEqual(["vide"]);
  });

  it("recognizes a project by the layer packages it installed", () => {
    // A project can carry a layer's packages without depending on the framework directly, because
    // the framework is a peer.
    expect(detectProjectFrameworks(registry, { devDependencies: { "@lattice-ui/react-dialog": "^0.8.1" } })).toEqual([
      "react",
    ]);
  });

  it("reports both when a project is on both", () => {
    expect(
      detectProjectFrameworks(registry, { dependencies: { "@rbxts/react": "^17", "@rbxts/vide": "^0.6.1" } }),
    ).toEqual(["react", "vide"]);
  });

  it("reports nothing for a project with no framework at all", () => {
    expect(detectProjectFrameworks(registry, { dependencies: {} })).toEqual([]);
  });
});

describe("framework resolution", () => {
  it("lets an explicit flag win over what the project depends on", () => {
    const resolved = resolveFramework(registry, { dependencies: { "@rbxts/react": "^17" } }, "vide");

    expect(resolved).toEqual({ framework: "vide", source: "flag" });
  });

  it("takes the framework from the project when there is exactly one", () => {
    const resolved = resolveFramework(registry, { dependencies: { "@rbxts/vide": "^0.6.1" } }, undefined);

    expect(resolved).toEqual({ framework: "vide", source: "dependency" });
  });

  it("asks rather than guesses when a project carries both layers", () => {
    expect(() =>
      resolveFramework(registry, { dependencies: { "@rbxts/react": "^17", "@rbxts/vide": "^0.6.1" } }, undefined),
    ).toThrow(/depends on more than one framework/i);
  });

  it("falls back to the default framework for a project with none", () => {
    expect(resolveFramework(registry, { dependencies: {} }, undefined)).toEqual({
      framework: "react",
      source: "default",
    });
  });

  it("rejects a framework the registry does not declare", () => {
    expect(() => resolveFramework(registry, undefined, "fusion")).toThrow(/unknown framework/i);
  });
});
