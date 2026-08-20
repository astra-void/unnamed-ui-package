---
"@lattice-ui/vide-accordion": patch
"@lattice-ui/vide-avatar": patch
"@lattice-ui/vide-combobox": patch
"@lattice-ui/vide-context-menu": patch
"@lattice-ui/vide-dialog": patch
"@lattice-ui/vide-menu": patch
"@lattice-ui/vide-popover": patch
"@lattice-ui/vide-progress": patch
"@lattice-ui/vide-radio-group": patch
"@lattice-ui/vide-runtime": patch
"@lattice-ui/vide-scroll-area": patch
"@lattice-ui/vide-select": patch
"@lattice-ui/vide-slider": patch
"@lattice-ui/vide-tabs": patch
"@lattice-ui/vide-text-field": patch
"@lattice-ui/vide-textarea": patch
"@lattice-ui/vide-toast": patch
"@lattice-ui/vide-tooltip": patch
---

Fix the Vide roots that render no element of their own, which never provided their context.

`Vide.context(value, fn)` runs `fn` inside the new scope and returns its result, so a root that
returned its children function instead of calling it handed the caller a closure that ran in the
caller's scope — where the context it had just set is not in the chain. Every part inside a
`Popover.Root`, `Dialog.Root`, `Tabs.Root` and the fourteen others like them was reading a context
that was no longer there. The roots now call their children through `renderChildren`, matching
Vide's own `Provider`.

`@lattice-ui/vide-scroll-area` exports `ScrollAreaType` and `ScrollAreaOrientation`, and
`@lattice-ui/vide-toast` exports `ToastCore`, `ToastOptions` and `ToastRecord`; `useToast` hands back
the queue, so a consumer has to be able to name its type.
