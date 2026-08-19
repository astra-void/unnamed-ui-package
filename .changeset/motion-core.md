---
"@lattice-ui/core-motion": patch
"@lattice-ui/react-motion": patch
"@lattice-ui/vide-checkbox": patch
"@lattice-ui/vide-motion": patch
"@lattice-ui/vide-popover": patch
"@lattice-ui/vide-runtime": patch
---

Move motion into a framework-free core, and give the Vide layer `transition`.

`@lattice-ui/core-motion` now owns the motion runtime — the scheduler, the motion host, the value
targets, the recipes and the presence state machine, including its mount-retry loop and the
generation counters that keep a stale exit from resolving. `react-motion` keeps its hooks and its
policy provider and renders that core; its public API is unchanged.

`@lattice-ui/vide-motion` is new: a Vide motion policy provider and a binding that drives the same
presence state machine from Vide sources. With it, `Checkbox.Indicator` and `Popover.Content` in the
Vide layer accept `transition`, so their exits wait for the animation rather than for the presence
fallback timeout.

`vide-runtime` now re-exports the framework-free contract, so a `vide/*` package reaches `Derivable`,
`Reactivity` and `read` through its own layer rather than importing `@lattice-ui/core-runtime`
directly.
