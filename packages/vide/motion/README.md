# @lattice-ui/vide-motion

Presence and response motion bindings, and the reduced-motion policy.

```bash
npx lattice-ui add motion --framework vide
```

## What this package is

The behavior lives in `@lattice-ui/core-motion`, which imports no framework at all and is the same code the React layer runs. This package is the Vide half: it builds that core on Vide's reactivity and renders what the core describes.

A Vide component runs once, so a prop that has to follow state is written as a getter rather than read as a value. Pass a source straight in and the part stays bound to it.

See the [root README](../../../README.md) for the coverage matrix and the styling rules that apply to every package.
