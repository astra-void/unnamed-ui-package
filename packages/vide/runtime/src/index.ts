// The framework-free contract is re-exported here so a `vide/*` package never imports
// `@lattice-ui/core-runtime` directly. TypeScript resolves a module once per program, and if some
// other dependency's declarations reach core-runtime first, the resolved path lands under *that*
// package's node_modules — where roblox-ts computes a scope of ".." and refuses to emit the import.
export * from "@lattice-ui/core-runtime";
export * from "./elementSpec";
export * from "./portal";
export * from "./props";
export * from "./reactivity";
export * from "./slot";
export { default as Vide } from "./vide";
