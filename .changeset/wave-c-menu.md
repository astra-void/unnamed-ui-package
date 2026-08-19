---
"@lattice-ui/core-menu": patch
"@lattice-ui/react-menu": patch
"@lattice-ui/vide-menu": patch
---

Drive the menu from a framework-free core.

`@lattice-ui/core-menu` owns the open state, the item ring that focus moves through, the highlight
that tracks pointer hover and managed focus apart so neither clears the other, and the select event
a consumer can prevent to keep the menu open.

An item is built on its own reactivity rather than the menu's: a highlight change has to re-render
the item it happened to, not the menu that contains it.
