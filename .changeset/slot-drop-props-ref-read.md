---
"@lattice-ui/react-runtime": patch
---

`Slot` no longer reads `props.ref`. It is a `forwardRef` component, so a `ref` written on it always arrives as the forwarded ref argument — React strips `ref` out of `props` — which made the read dead code that only ever returned the development warning accessor. Reading it logged "`ref` is not a prop" on every render of an `asChild` primitive that composes a ref (`Dialog.Trigger`, `Slider.Track`, `Tabs.Trigger`, `ContextMenu.Trigger`, and friends). Ref composition itself is unchanged.
