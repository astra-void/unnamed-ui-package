---
"@lattice-ui/core-dialog": patch
"@lattice-ui/react-dialog": patch
"@lattice-ui/vide-dialog": patch
---

Drive the dialog from a framework-free core.

`@lattice-ui/core-dialog` owns the open state, the modal default, and what each part renders — the
trigger that focuses itself before opening so closing has somewhere to restore to, and the overlay
that is active only while open and dismisses on activation. `@lattice-ui/vide-dialog` renders the
same core, with the overlay in its own ScreenGui below the dismissable layers and the content inside
a focus scope that traps while modal.
