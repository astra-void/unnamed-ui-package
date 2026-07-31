---
"@lattice-ui/react-context-menu": minor
"@lattice-ui/react-combobox": minor
"@lattice-ui/react-tooltip": minor
"@lattice-ui/react-popover": minor
"@lattice-ui/react-select": minor
"@lattice-ui/react-motion": minor
"@lattice-ui/react-toast": minor
"@lattice-ui/react-menu": minor
---

Every remaining `CanvasGroup` host renders as a `Frame`, following `Dialog.Content`. `Popover.Content`, `Tooltip.Content`, `Menu.Content`, `ContextMenu.Content`, `Select.Content`, `Combobox.Content` and `Toast.Root` forward props onto a `Frame`, so the `CanvasGroup`-only `GroupTransparency` and `GroupColor3` are no longer accepted, and a `transition` that faded a host through `GroupTransparency` has to animate `BackgroundTransparency` instead — `createSurfaceRevealRecipe` and `createPopperEntranceRecipe` are the `Frame` counterparts of `createCanvasGroupRevealRecipe` and `createCanvasGroupPopperEntranceRecipe`, which stay exported for consumers who supply their own `canvasgroup` through `asChild`. `createToastRevealRecipe` now fades `BackgroundTransparency` so it still drives the `Frame`-hosted `Toast.Root`. Presence timing, exit-before-unmount, popper measurement and placement, outside-dismissal boundaries, focus scoping and layer stacking are unchanged. Content subtrees are no longer flattened into a single composited layer, so children carry their own transparency rather than inheriting the host's.
