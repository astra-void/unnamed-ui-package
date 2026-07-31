---
"@lattice-ui/react-dialog": minor
---

`Dialog.Content` accepts `asChild`. It was the last content part without it, and the only one with no way to fade its surface as a whole: its motion host is a layer-spanning `Frame`, so a `BackgroundTransparency` fade paints the screen rather than the panel. Passing your own `canvasgroup` makes it the motion host, and `createCanvasGroupRevealRecipe` fades the subtree as one composited layer again — as an opt-in, not as something every dialog pays for.

The outside-press boundary moves one level down to match: with `asChild` it is the first host child of your element, the same panel a plain dialog renders directly under `Content`. Using the element itself would swallow every outside press, since it spans the layer. The dialog still owns `Size` and `Visible` on whatever element it renders, and presence timing, focus trapping and layer stacking are unchanged.
