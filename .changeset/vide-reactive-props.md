---
"@lattice-ui/vide-runtime": patch
"@lattice-ui/vide-style": patch
"@lattice-ui/vide-system": patch
"@lattice-ui/vide-motion": patch
"@lattice-ui/vide-popover": patch
"@lattice-ui/vide-tooltip": patch
"@lattice-ui/vide-menu": patch
"@lattice-ui/vide-context-menu": patch
"@lattice-ui/vide-select": patch
"@lattice-ui/vide-combobox": patch
---

Keep theme- and policy-derived props live in the Vide layer.

A Vide component runs once, so a props table resolved from the theme and spread onto an element was
a snapshot: `Box`, `Text`, `Stack` and `Grid` kept whatever the theme said when they ran, and a
`MotionProvider` fixed its policy for the lifetime of the tree. `bindDerivedProps` in
`@lattice-ui/vide-runtime` turns a recomputed props table back into per-property bindings, and the
motion provider now carries its preferences as derivables the way the theme context already did.

The overlay packages also re-export `PopperPlacement`, which had no home in the Vide layer — there
is no `vide-popper` package, so the type of the `placement` prop was unnameable by a consumer.
