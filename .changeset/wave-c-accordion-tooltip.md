---
"@lattice-ui/core-accordion": patch
"@lattice-ui/core-tooltip": patch
"@lattice-ui/react-accordion": patch
"@lattice-ui/react-tooltip": patch
"@lattice-ui/vide-accordion": patch
"@lattice-ui/vide-tooltip": patch
---

Drive accordion and tooltip from framework-free cores.

Both keep their behavior in `@lattice-ui/core-*` now and have Vide adapters rendering the same core:
the accordion's single/multiple value normalization and its collapsible rule, and the tooltip's
hover-and-focus activity tracking together with the shared delay policy that lets a second tooltip
open on the shorter skip delay.

The React packages keep their public APIs.
