---
"@lattice-ui/core-avatar": patch
"@lattice-ui/core-focus": patch
"@lattice-ui/core-motion": patch
"@lattice-ui/core-progress": patch
"@lattice-ui/core-radio-group": patch
"@lattice-ui/core-switch": patch
"@lattice-ui/core-tabs": patch
"@lattice-ui/core-toggle-group": patch
"@lattice-ui/react-avatar": patch
"@lattice-ui/react-motion": patch
"@lattice-ui/react-progress": patch
"@lattice-ui/react-radio-group": patch
"@lattice-ui/react-switch": patch
"@lattice-ui/react-tabs": patch
"@lattice-ui/react-toggle-group": patch
"@lattice-ui/vide-avatar": patch
"@lattice-ui/vide-motion": patch
"@lattice-ui/vide-progress": patch
"@lattice-ui/vide-radio-group": patch
"@lattice-ui/vide-switch": patch
"@lattice-ui/vide-tabs": patch
"@lattice-ui/vide-toggle-group": patch
---

Drive six more primitives from framework-free cores, and add them to the Vide layer.

`switch`, `progress`, `avatar`, `toggle-group`, `radio-group` and `tabs` now keep their behavior in
`@lattice-ui/core-*`: the load state machine and reveal delay behind an avatar, the ordered rings
that arrow keys step through in a radio group and a tab list, the tab-selection fallback that hands a
disabled tab on to the next enabled one, and the activation guard that collapses the paired events of
a single gamepad activation. Each has a Vide adapter rendering the same core, and the React packages
keep their public APIs.

Response motion moved to the core alongside presence motion, so `Switch.Thumb` and
`Progress.Indicator` animate in both layers.

`getOrderedSelectionEntry` helpers now accept a `getGuiObject` alongside a `ref`: roblox-ts compiles
no property getters, so an adapter without ref objects had no way to satisfy the ref shape.
