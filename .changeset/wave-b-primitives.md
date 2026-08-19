---
"@lattice-ui/core-scroll-area": patch
"@lattice-ui/core-slider": patch
"@lattice-ui/core-text-field": patch
"@lattice-ui/core-textarea": patch
"@lattice-ui/react-scroll-area": patch
"@lattice-ui/react-slider": patch
"@lattice-ui/react-text-field": patch
"@lattice-ui/react-textarea": patch
"@lattice-ui/vide-scroll-area": patch
"@lattice-ui/vide-slider": patch
"@lattice-ui/vide-text-field": patch
"@lattice-ui/vide-textarea": patch
---

Drive the input and geometry primitives from framework-free cores.

`text-field`, `textarea`, `slider` and `scroll-area` now keep their behavior in `@lattice-ui/core-*`
and have Vide adapters rendering the same core. What moved is the part that was never about React:
the read-only write-back that puts a value straight back into a `TextBox` the engine let the player
type into, the auto-resize pass that runs twice because `TextBounds` is a frame behind the edit that
caused it, the pointer drag that follows one finger or any mouse movement, the keyboard adjustment
including Home/End/PageUp/PageDown, and the scrollbar visibility that hides on idle only for
`type="scroll"`.

The React packages keep their public APIs.
