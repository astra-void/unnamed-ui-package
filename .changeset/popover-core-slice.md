---
"@lattice-ui/core-layer": patch
"@lattice-ui/core-popover": patch
"@lattice-ui/core-popper": patch
"@lattice-ui/react-layer": patch
"@lattice-ui/react-popover": patch
"@lattice-ui/react-popper": patch
"@lattice-ui/vide-popover": patch
"@lattice-ui/vide-runtime": patch
---

Drive the popover from framework-free cores, and add a Vide popover.

Three new cores carry what the popover needs: `@lattice-ui/core-popper` (anchored placement, the
measurement loop and its Roblox observers), `@lattice-ui/core-layer` (presence timing, the layer
stack and the outside-pointer test) and `@lattice-ui/core-popover` (open state, the instances
positioning and dismissal are measured against, and what each part renders).

`react-popper`, `react-layer` and `react-popover` render those cores instead of implementing them,
with no change to their public APIs. `usePopper` additionally accepts `getAnchor` / `getContent` for
callers that keep instances outside a React ref, and `DismissableLayer` accepts `insideRoots`
alongside `insideRefs`.

The new `@lattice-ui/vide-popover` renders the same cores through Vide, including a portal built on
nothing more than parenting an instance and a `cleanup`.

Vide coverage note: the Vide popover has no focus scope and no motion. Focus trapping and restoration
wait on a focus core, so `Popover.Root` deliberately injects no focus mechanism rather than
half-implementing one, and content exit is the presence fallback timeout rather than an animation's
completion. `transition` is absent from `Popover.Content` rather than accepted and ignored.
