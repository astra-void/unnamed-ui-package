# @lattice-ui/vide-textarea

A multi-line field that resizes between a minimum and a maximum row count.

```bash
npx lattice-ui add textarea --framework vide
```

## Parts

`Textarea.Root`, `Textarea.Input`, `Textarea.Label`, `Textarea.Description`, `Textarea.Message`

## What this package is

The behavior lives in `@lattice-ui/core-textarea`, which imports no framework at all and is the same code the React layer runs. This package is the Vide half: it builds that core on Vide's reactivity and renders what the core describes.

Nothing here is styled. A part neutralizes the Roblox instance defaults that would otherwise read as a look, forwards every prop it does not recognize to the instance it renders, and composes your event handlers with its own rather than replacing them.

A Vide component runs once, so a prop that has to follow state is written as a getter rather than read as a value. Pass a source straight in and the part stays bound to it.

Children of a part that provides a context are written as a function — `{() => …}` — because Vide evaluates JSX children before the parent component runs.

See the [root README](../../../README.md) for the coverage matrix and the styling rules that apply to every package.
