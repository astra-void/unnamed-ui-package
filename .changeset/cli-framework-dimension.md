---
"lattice-ui": minor
---

Give the CLI a framework dimension.

The registry keyed components by bare name and mapped each straight to a React package, so nothing
in the Vide layer was installable. A component is now one name with a package per framework, which
keeps `lattice add dialog` the same request whichever layer a project is on and lets the registry
say plainly that `layer` and `popper` have no Vide package.

`add`, `remove`, `upgrade` and `doctor` take `--framework`, and detect it from the project's own
dependencies when it is omitted. A project that carries both layers is asked rather than guessed at.
`doctor` still recognizes a package from either layer, because a leftover from before a migration is
known — just not from the layer the project is on now.

`init` and `create` take `--framework` too, and scaffold a Vide starter with its own JSX factory and
entry point. The starter templates are split into the part every project gets and the part that is
particular to a layer.
