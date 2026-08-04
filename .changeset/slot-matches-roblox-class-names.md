---
"@lattice-ui/react-runtime": patch
---

`asChild` works again on a subtree a Tailwind-style transform has styled.

`Slot` decided which child to clone by looking each element's type up in a table of UI modifier tags, and that table was keyed by the JSX tag — `uicorner`, `uilistlayout`. roblox-ts labels a host element with its Roblox class name, so `<uicorner />` arrives as `"UICorner"` and every modifier missed the lookup. Missing it meant counting as a second candidate target, so `Slot` refused the subtree with "expected exactly one child element besides any UI modifiers" whenever more than one element was present.

That is every styled `asChild` subtree in practice. A transform like vela-rbxts lowers `rounded-md` to a `UICorner` sibling and `flex-row` to a `UIListLayout`, so a component whose recipe sets either — which is most of them — could not use `asChild` at all. Class-to-prop lowering was never the problem: props reached the child correctly the whole time.

The table is now keyed by class name. The existing tests passed because they hand-wrote the lowercase form, which nothing actually produces; their fixtures were corrected alongside.
