---
"@lattice-ui/core-style": patch
"@lattice-ui/core-system": patch
"@lattice-ui/react-style": patch
"@lattice-ui/react-system": patch
"@lattice-ui/vide-style": patch
"@lattice-ui/vide-system": patch
---

Drive theming and layout from framework-free cores, and add them to the Vide layer.

`@lattice-ui/core-style` holds `sx`, the recipe builder, the tokens, the controllable theme, and the
prop pipeline every styled primitive shares. `@lattice-ui/core-system` holds the spacing and grid
math, the density application, the surface tokens, the base-theme and density scopes, and the layout
resolvers — including the grid's measurement, since a `minColumnWidth` cannot be resolved into a
column count until the container has a width.

`@lattice-ui/vide-style` and `@lattice-ui/vide-system` render the same cores, so the Vide layer now
has theming, density and layout.
