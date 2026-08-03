// roblox-ts resolves an import to a path and then asks the Rojo project which
// `$path` covers it — and it asks with the path it walked, not the realpath. So
// `@rbxts/services`, which vela's inlined runtime helper imports, has to sit
// under this app's own `node_modules` and be mapped from there.
//
// pnpm hoists every `@rbxts/*` package to the workspace root (see
// `nodeLinker: hoisted`), so nothing lands here on install. This link puts the
// scope where both tools expect it; `default.project.json` maps
// `node_modules/@rbxts` accordingly.
//
// The sibling playground needs none of this: it only reaches `@rbxts` through
// Lattice packages that ship prebuilt Luau, so it never resolves the scope
// itself.
const fs = require("node:fs");
const path = require("node:path");

const appRoot = path.resolve(__dirname, "..");
const scopeLink = path.join(appRoot, "node_modules", "@rbxts");
const scopeTarget = path.resolve(appRoot, "..", "..", "node_modules", "@rbxts");

if (!fs.existsSync(scopeTarget)) {
  console.error(`[link-rbxts] missing ${scopeTarget} — run pnpm install at the workspace root first.`);
  process.exit(1);
}

const existing = fs.existsSync(scopeLink) || fs.lstatSync(scopeLink, { throwIfNoEntry: false }) !== undefined;
if (existing) {
  const stats = fs.lstatSync(scopeLink);
  if (stats.isSymbolicLink() && fs.realpathSync(scopeLink) === fs.realpathSync(scopeTarget)) {
    process.exit(0);
  }
  fs.rmSync(scopeLink, { recursive: true, force: true });
}

fs.mkdirSync(path.dirname(scopeLink), { recursive: true });
fs.symlinkSync(path.relative(path.dirname(scopeLink), scopeTarget), scopeLink, "junction");
