# @lattice-ui/playground-vide

The Vide layer's playground: one scene per primitive, driven by the same framework-free cores the
React playground runs on.

## Running it

```
pnpm --filter @lattice-ui/playground-vide build
pnpm --filter @lattice-ui/playground-vide serve
```

Then connect Roblox Studio to the Rojo session and press Play.

`pnpm --filter @lattice-ui/playground-vide watch` rebuilds on change while the session is up.

## What to look at

- The **Theme** and **Density** buttons in the header change the theme for the whole tree. A Vide
  component runs once, so every themed prop in this app is a getter rather than a value; the
  `bindDerivedProps` helper in `@lattice-ui/vide-runtime` is what turns a resolved props table back
  into bindings.
- **Style & System** nests a `DensityProvider` inside the app's own scope, so two panels read one
  base theme at two spacing scales.
- **Motion** flips the policy at runtime. The provider's preferences are derivable for the same
  reason the theme is.

## Layout

- `src/client/main.client.ts` — mounts one Vide root under the PlayerGui.
- `src/client/PlaygroundWorkspace.tsx` — providers, header, scene list, and the `Vide.match` that
  keeps exactly one scene alive.
- `src/client/scenes/` — one file per primitive, plus `parts.tsx` for the chrome they share.
- `src/client/theme/recipes.ts` — the demo's own recipes. Nothing here is part of the library.
