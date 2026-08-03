// vela's inlined runtime helper imports `@rbxts/react` and `@rbxts/services`,
// so this app resolves the `@rbxts` scope itself — the sibling playground never
// does, because it only reaches `@rbxts` through Lattice packages that ship
// prebuilt Luau.
//
// roblox-ts derives a module's scope from its **realpath**, and Rojo walks real
// directories. The hoisted workspace install (see `nodeLinker: hoisted`) puts
// `@rbxts` only at the repo root, and a symlink into it is not enough: the
// realpath lands back outside the project, roblox-ts stops treating the package
// as app-local, and resolution falls through to whatever nested `node_modules`
// chain it can find — emitting import paths like
// `@lattice-ui/react-layer/node_modules/@lattice-ui/react-runtime/node_modules/@rbxts/react`
// that no `$path` in `default.project.json` covers, so Studio yields forever on
// `WaitForChild("react-layer")`.
//
// Real copies fix both halves at once: roblox-ts emits
// `node_modules/@rbxts/react`, and Rojo syncs the same directory into
// ReplicatedStorage. Adapted from the same workaround in vela-rbxts' own
// playground.
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.join(__dirname, "..");
const sourceDir = path.join(projectRoot, "..", "..", "node_modules", "@rbxts");
const targetDir = path.join(projectRoot, "node_modules", "@rbxts");

function readVersions(scopeDir) {
  const versions = {};

  for (const entry of fs.readdirSync(scopeDir)) {
    const manifestPath = path.join(scopeDir, entry, "package.json");

    try {
      versions[entry] = JSON.parse(fs.readFileSync(manifestPath, "utf8")).version;
    } catch {
      return undefined;
    }
  }

  return versions;
}

if (!fs.existsSync(sourceDir)) {
  console.error(`materialize-rbxts: missing ${sourceDir} — run pnpm install at the workspace root first.`);
  process.exit(1);
}

const sourceVersions = readVersions(sourceDir);
const targetIsRealDir = fs.existsSync(targetDir) && !fs.lstatSync(targetDir).isSymbolicLink();
const targetVersions = targetIsRealDir ? readVersions(targetDir) : undefined;

// Already materialized at the same versions — nothing to do.
if (sourceVersions && targetVersions && JSON.stringify(sourceVersions) === JSON.stringify(targetVersions)) {
  process.exit(0);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(path.dirname(targetDir), { recursive: true });
fs.cpSync(sourceDir, targetDir, { recursive: true, dereference: true });
console.log(`materialize-rbxts: copied @rbxts packages into ${targetDir}`);
