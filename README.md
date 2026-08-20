# Lattice UI

A headless-first UI toolkit for Roblox, built with [roblox-ts](https://roblox-ts.com/), for [`@rbxts/react`](https://github.com/littensy/rbxts-react) and [`@rbxts/vide`](https://github.com/centau/vide).

Lattice UI ships composable primitives that own interaction, focus flow, layering, portals, and presence — while leaving visual styling entirely up to you. Primitives are unstyled: they set behavior and neutralize Roblox's instance defaults, and nothing else. Style them by passing instance props straight through, or by slotting your own element with `asChild`.

That behavior lives in framework-free cores. A `@lattice-ui/react-*` package and its `@lattice-ui/vide-*` counterpart are two renderings of the same code, so the two layers cannot drift apart by accident.

## Highlights

- **Headless-first** — primitives own behavior and state orchestration, not opinionated visuals.
- **Composable** — small wrappers and slotting patterns over monolithic components.
- **Focus & layering** — deliberate focus restoration, ordered navigation, trapping, portals, and overlay stacking.
- **Unstyled, not unusable** — every part forwards instance props to what it renders, so styling never requires `asChild`; consumer props win over defaults, and consumer event handlers compose with the primitive's rather than replacing them.
- **Motion is opt-in** — presence timing is owned by the primitives, but animation flows through `@lattice-ui/react-motion` only when you pass a `transition`, with reduced-motion policy support.
- **Controlled & uncontrolled** — consistent state semantics across primitives.
- **Two frameworks, one implementation** — React and Vide layers over the same `@lattice-ui/core-*` behavior.

## Installation

The fastest way to start is the CLI, which can scaffold a new project or add Lattice UI to an existing roblox-ts app:

```bash
# Scaffold a new project
npx lattice-ui create my-game

# Or add Lattice UI to an existing roblox-ts project
npx lattice-ui init
npx lattice-ui add dialog tooltip toast
```

Packages can also be installed directly:

```bash
npm install @lattice-ui/react-runtime @lattice-ui/react-dialog
```

For Vide, pass `--framework vide` — or let the CLI read it from a project that already depends on `@rbxts/vide`:

```bash
npx lattice-ui create my-game --framework vide
npx lattice-ui add dialog tooltip --framework vide
```

React packages take `@rbxts/react` and `@rbxts/react-roblox` (React 17) as peer dependencies; Vide packages take `@rbxts/vide`.

See the [CLI reference](packages/tools/cli/README.md) for the full command set (`create`, `init`, `add`, `remove`, `upgrade`, `doctor`).

## Frameworks

Behavior is written once, in `@lattice-ui/core-*`, and imports no framework. Each layer builds those cores on its own reactivity and renders what they describe.

Twenty-five packages ship for both layers — every primitive, and the `runtime`, `focus`, `motion`, `style` and `system` foundations:

`accordion`, `avatar`, `checkbox`, `combobox`, `context-menu`, `dialog`, `focus`, `menu`, `motion`, `popover`, `progress`, `radio-group`, `runtime`, `scroll-area`, `select`, `slider`, `style`, `switch`, `system`, `tabs`, `text-field`, `textarea`, `toast`, `toggle-group`, `tooltip`

Two React packages have no Vide counterpart, because Vide reaches the same behavior by a shorter route:

| React package | On Vide |
| --- | --- |
| `@lattice-ui/react-layer` | Portals need no machinery: a Vide component returns a real instance, so a portal is that instance parented elsewhere. `PortalProvider` lives in `@lattice-ui/vide-runtime`. |
| `@lattice-ui/react-popper` | Positioning is behavior, so it lives in `@lattice-ui/core-popper` and is driven from inside the primitives that place with it. |

### What differs between the layers

The public shape follows each framework rather than pretending they are the same:

- A Vide component runs **once**. Props that follow state are `Derivable` — pass a source straight in and the part stays bound to it, instead of re-rendering with a new value.
- Children of a part that provides a context are written as a function: `<Popover.Root>{() => <Popover.Trigger />}</Popover.Root>`. Vide evaluates JSX children before the parent runs, so an eagerly written child would read the context before it exists.
- Events are flat props (`Activated={…}`) rather than an `Event` table, and property-change handlers are `<Prop>Changed` props.
- `asChild` uses `vide.apply` on the instance you passed, so there is no cloning and no prop-bag merge.
- There is no `ref`: a part takes Vide's `action` prop, and teardown runs through the scope's cleanup.

Both layers ship on the same version line. See [`docs/architecture/multi-framework.md`](docs/architecture/multi-framework.md) for the contract the two layers share.

## Packages

Every package is published as `@lattice-ui/<layer>-<name>`.

### Behavior

`core-runtime`, `core-focus`, `core-layer`, `core-motion`, `core-popper`, `core-style`, `core-system`, and one `core-<name>` per primitive. These import no framework and are what both layers run.

### Foundations

`runtime`, `focus`, `layer`, `motion`, `style`, `system`

### UI primitives

`accordion`, `avatar`, `checkbox`, `combobox`, `context-menu`, `dialog`, `menu`, `popover`, `popper`, `progress`, `radio-group`, `scroll-area`, `select`, `slider`, `switch`, `tabs`, `text-field`, `textarea`, `toast`, `toggle-group`, `tooltip`

### Tooling

`cli` (published as `lattice-ui`)

## Styling

Primitives set behavior and neutralize Roblox's instance defaults; everything visual is yours. There are three ways in, and they compose:

- **Instance props** — anything a part does not recognize is forwarded to the instance it renders, so `<Menu.Item BackgroundColor3={...} />` works without `asChild`. Forwarded props are checked against that instance, so a prop it does not accept is a compile error rather than a silent no-op.
- **Child instances** — `UICorner`, `UIPadding`, `UIListLayout` and the rest can be written as children of any part, including next to an `asChild` element, where they are re-parented under it.
- **`asChild`** — render your own element and let the part merge its behavior props, events and refs onto it.

### Props the primitive owns

A part applies its own props *after* yours, so the ones below are ignored rather than merged. This is silent: passing them is not an error, they just have no effect. Change the state they are derived from instead, or move your value to a wrapper you control.

Three rules cover most of it:

- **`Active` and `Selectable`** are owned by every interactive part and derive from `disabled`.
- **`Visible`** is owned by every part with open/checked/present state, including all `Content` and `Indicator` parts. Presence keeps content mounted through an exit transition, and `Visible` is how that is expressed.
- **`Text`** is owned by parts that render a controlled value: `TextField.Input`, `Textarea.Input`, `Combobox.Input`, `Select.Value` and `Combobox.Value`. Those inputs also own `TextEditable` and `ClearTextOnFocus`. `Avatar.Image` owns `Image` the same way, from `src`.

Beyond those, geometry is owned wherever the primitive computes it:

| Part | Owned props | Computed from |
| --- | --- | --- |
| every `Content` part | `Size`, `AutomaticSize` | popper measurement — see the note below |
| `Menu.Content`, `ContextMenu.Content`, `Combobox.Content`, `Tooltip.Content` | `Position` | popper placement, applied to the host that wraps the content |
| `Dialog.Content` | `Size` | full-screen host sizing |
| `Dialog.Overlay` | `Size`, `ZIndex` | full-screen hit-testing, stacking below content |
| `Progress.Indicator` | `Size` | `value` / `max` fill ratio |
| `Slider.Range` | `Size`, `Position` | value-to-percent mapping |
| `Slider.Thumb` | `AnchorPoint` | thumb travel |
| `Switch.Thumb` | `Position`, `AnchorPoint` | checked-state travel; your `Size` is read, not ignored — it sizes the wrapper the thumb travels in |
| `ScrollArea.Thumb` | `Size`, `Position` | viewport-to-canvas ratio |
| `ScrollArea.Viewport` | `CanvasSize`, `AutomaticCanvasSize`, `ScrollingDirection`, `ScrollBarThickness`, `ScrollBarImageTransparency` | canvas measurement; the native scrollbar is suppressed because `ScrollArea` renders its own |

`Slider.Range`, `Progress.Indicator` and `Switch.Thumb` write their geometry through motion rather than props, so it is reapplied on every frame even when you pass a value.

`Size` and `AutomaticSize` on a `Content` part are only owned on the default path, where the primitive measures the instance it renders so the popper can place it. Under `asChild` the measurement moves to the host that wraps your element and your own `Size` is left alone — so `asChild` is how you get a fixed-width dropdown:

```tsx
<Select.Content asChild>
  <frame Size={UDim2.fromOffset(160, 0)} AutomaticSize={Enum.AutomaticSize.Y} />
</Select.Content>
```

### What a `transition` animates

No part renders a `CanvasGroup`. Presence hosts — every `Content` part and `Toast.Root` — are plain `Frame`s, so a `transition` animates that one instance and nothing below it: a fade moves the host's own `BackgroundTransparency`, and children keep whatever transparency you gave them. `createSurfaceRevealRecipe` and `createPopperEntranceRecipe` are the recipes written against that host.

To fade a whole subtree as a single composited layer, slot your own `canvasgroup` with `asChild` and animate it with `createCanvasGroupRevealRecipe` or `createCanvasGroupPopperEntranceRecipe`:

```tsx
<Popover.Content asChild transition={createCanvasGroupPopperEntranceRecipe("bottom")}>
  <canvasgroup BackgroundColor3={Color3.fromRGB(24, 24, 27)} />
</Popover.Content>
```

`GroupTransparency` and `GroupColor3` only exist on a `CanvasGroup`. Passing them to a part is a compile error, and a `transition` that animates them on a `Frame` host is skipped silently rather than reported — so migrate those recipes to `BackgroundTransparency` rather than waiting for a diagnostic.

## Development

This is a [pnpm](https://pnpm.io/) monorepo managed with [Turbo](https://turbo.build/).

```bash
pnpm install        # install dependencies
pnpm run build      # build all publishable packages
pnpm run typecheck  # type-check the workspace
pnpm run test       # run unit tests (Vitest)
pnpm run lint       # lint
pnpm run check      # workspace check + lint + typecheck + tests
```

Workspaces:

- `packages/core/*` — framework-free behavior (`@lattice-ui/core-<name>`).
- `packages/react/*` — publishable React packages (`@lattice-ui/react-<name>`).
- `packages/vide/*` — publishable Vide packages (`@lattice-ui/vide-<name>`).
- `packages/tools/cli` — the `lattice-ui` CLI.
- `apps/playground` — Roblox playground for manual UI verification of the React layer.
- `apps/playground-vide` — the same, for the Vide layer.
- `apps/test-harness` — Roblox TestEZ harness for package-level behavior checks, covering both layers.
- `apps/loom-preview` — typecheck-only preview integration workspace.

See [CONTRIBUTING.md](CONTRIBUTING.md) to get set up and send a change, and [AGENTS.md](AGENTS.md) for the full repository conventions.

## Stability and Versioning

Lattice UI is currently in the `0.x` phase.

The workspace uses lockedstep versioning today, but not every package is at the same maturity level.
In practice, this means the version number alone should not be read as a guarantee that every package is equally stable.

### Stable direction

These packages represent the long-term stable direction of Lattice UI and are the main path toward `v1.0`:

- foundations: `runtime`, `focus`, `layer`, `motion`, `style`, `system`, and the `core-*` packages beneath them
- primary UI packages: `accordion`, `avatar`, `checkbox`, `combobox`, `dialog`, `menu`, `popover`, `progress`, `radio-group`, `scroll-area`, `switch`, `tabs`, `text-field`, `textarea`, `toast`, `toggle-group`, `tooltip`

### Experimental or feature-limited

These packages are available, but should still be treated as experimental, evolving, or intentionally limited in scope:

- `popper` - experimental positioning foundation with placement-relative offsets and viewport collision handling
- `select` - currently single-value only
- `slider` - currently single-thumb only

Some parts of the UI surface may reach `v1.x` earlier in practice, while feature-limited packages may remain in `0.x` for longer.
A future `v1` milestone for the main UI layer does **not** automatically mean every experimental or tooling package is fully stabilized.

## Roadmap

### v0.6.x

- improve reliability across layered and composite primitives
- continue hardening motion, presence, and exit-transition behavior
- build a proper keyboard navigation foundation instead of relying too heavily on Roblox default selection behavior
- strengthen focus restoration, ordered navigation, trapping, and cross-scope keyboard flow
- expand regression coverage and debugging for the stable-direction package surface
- keep feature-limited packages flexible while their API surface is still settling

### v1.0

The `v1.0` milestone is focused on the main stable UI layer, not every package in the workspace.

The priority is to ship:

- a stable foundation around `core`, `focus`, `layer`, `motion`, `style`, and `system`
- dependable composition and state semantics across the main UI primitives
- predictable focus, keyboard navigation, layering, portal, and motion behavior
- clearer semver expectations for packages that are considered part of the stable UI surface

### after v1.0

- continue maturing feature-limited packages independently
- allow experimental or intentionally limited packages to remain in `0.x` if needed
- only promote those packages to stable versioning when their APIs and behavior are actually ready

## License

[MIT](LICENSE) © astra-void
