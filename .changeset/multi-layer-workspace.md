---
"@lattice-ui/core-runtime": patch
"@lattice-ui/vide-runtime": patch
---

Open the workspace to more than one framework layer.

`packages/<layer>/<name>` now accepts `core` (framework-free) and `vide` alongside `react`. Peer
dependencies and the tsconfig base a package extends are declared per layer in
`workspace.policy.json` instead of workspace-wide, so a Vide package no longer inherits React peers
or React's JSX factory. Adds `@lattice-ui/core-runtime`, which holds the framework-free contract
(`Reactivity`, `Derivable`, `ElementSpec`), and `@lattice-ui/vide-runtime` as a reserved scaffold.

No behavior change to any existing package.
