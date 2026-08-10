---
"@lattice-ui/react-runtime": patch
---

`asChild` works on a styled subtree under the loom previews as well as under Roblox.

`Slot` decides which child to clone by looking each element's type up in a table of UI modifiers, and that table held one spelling at a time. It was keyed by the JSX tag first, which missed in Roblox; 0.8.0 re-keyed it by the Roblox class name, which fixed Roblox and broke the previews. Both spellings are real, and which one arrives depends on the renderer: `@rbxts/react`'s `createElement` rewrites a host tag to its class name before it builds the element, so `<uicorner />` arrives as `"UICorner"`, while loom's preview renderer leaves `createElement` alone and resolves the class name only when it creates the instance, so the same element arrives as `"uicorner"`. Whichever spelling was missing counted as a second candidate target, so a primitive refused the subtree — `[Switch] `asChild` requires a child element.` on the docs site's switch preview, from a `Switch.Root asChild className="… rounded-full"` whose `className` lowered to a `uicorner` sibling.

The table now lists both spellings, so neither renderer can hand `Slot` a modifier it reads as a target. Lower-casing the type instead is not portable: the method is `lower()` under roblox-ts and `toLowerCase()` in the browser, and this module compiles for both.

Re-parenting the modifiers no longer collides their keys with the element's own children. `resolveSlotChildren` keys the modifiers by walking the subtree with `Children.toArray`, the element's own children are keyed by a second `toArray`, and both number from `.0` — so merging the lists handed React a duplicate key, which it may resolve by omitting a child rather than by warning. The modifiers now get a namespace of their own. Only a modifier sibling on an element that has children of its own reaches this, which until now no renderer got far enough to do.

`UIShadow` joins the set while it is being corrected. It is a creatable `UIComponent` that a transform emits for `shadow-*`, and it was absent in both spellings, so it failed `asChild` the same way a casing miss did.
