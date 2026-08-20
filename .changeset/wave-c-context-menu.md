---
"@lattice-ui/core-context-menu": patch
"@lattice-ui/react-context-menu": patch
"@lattice-ui/vide-context-menu": patch
---

Drive the context menu from a framework-free core built on the menu core.

Everything a menu does is reused from `@lattice-ui/core-menu`; what `@lattice-ui/core-context-menu`
adds is opening where the pointer is — converting the raw pointer position into the inset-adjusted
space `AbsolutePosition` uses, and holding it for the 1x1 virtual anchor the content mounts so the
shared popper places and flips the menu exactly as it does against a real anchor.
