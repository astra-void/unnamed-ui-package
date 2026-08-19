---
"@lattice-ui/core-checkbox": patch
"@lattice-ui/core-runtime": patch
"@lattice-ui/react-checkbox": patch
"@lattice-ui/react-runtime": patch
"@lattice-ui/vide-checkbox": patch
"@lattice-ui/vide-runtime": patch
---

Drive the checkbox from one framework-free core.

`@lattice-ui/core-checkbox` now owns checkbox behavior — controlled/uncontrolled state, the
indeterminate transition, the disabled guard, and the `ElementSpec` describing what the root and
indicator render. `@lattice-ui/react-checkbox` renders that core instead of implementing it, and the
new `@lattice-ui/vide-checkbox` renders the same core through Vide.

`@lattice-ui/core-runtime` gains the injected reactivity implementation and `createControllableState`;
each layer's runtime gains its own `ElementSpec` translation, so spread order and event composition
stay identical across layers.

No behavior change to the React checkbox.

Vide coverage note: `Checkbox.Indicator` mounts and unmounts with the checked state but has no
`transition` — presence timing and motion arrive with the layer and motion cores. Children of a Vide
`Checkbox.Root` must be written as a function (`{() => <Checkbox.Indicator />}`) because Vide
evaluates JSX children before the parent component provides its context.
