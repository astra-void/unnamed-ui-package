---
"@lattice-ui/core-focus": patch
"@lattice-ui/react-focus": patch
"@lattice-ui/vide-focus": patch
"@lattice-ui/vide-popover": patch
---

Move focus into a framework-free core, and give the Vide layer focus scopes.

`@lattice-ui/core-focus` now owns the focus manager, navigation resolution, the trapped-scope stack,
ordered selection, the activation guard, and the two lifecycles that used to live inside React
components: a scope's registration and its hold on the navigation binds, and a node's registration in
a scope. `react-focus` keeps its hooks, its contexts and `FocusScope`, and renders that core; its
public API is unchanged.

`@lattice-ui/vide-focus` is new, and with it `Popover.Content` in the Vide layer traps and restores
focus and `Popover.Trigger` is a focus node — closing the last behavioral gap between the two layers'
popovers.
