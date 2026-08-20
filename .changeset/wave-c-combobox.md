---
"@lattice-ui/core-combobox": patch
"@lattice-ui/react-combobox": patch
"@lattice-ui/vide-combobox": patch
---

Drive the combobox from a framework-free core.

`@lattice-ui/core-combobox` owns the parts of a combobox that are easy to get subtly wrong: telling
the echo of its own write to the input apart from the player typing, keeping a cleared box from
dropping the selection until the popup actually closes, filtering against the typed query while open
but the settled input while closed, and caching an item's label so a selection still has a name once
the popup — and with it every item — is gone.
