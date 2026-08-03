# `@lattice-ui/playground-vela`

A line-for-line clone of [`apps/playground`](../playground) with one thing swapped: every
scene is styled with [`vela-rbxts`](https://github.com/astra-void/vela-rbxts) `className`
utilities instead of `@lattice-ui/react-style` recipes, `sx` and `theme` token reads.

Same 37 scenes, same Lattice primitives, same behavior. Only the styling layer differs, so
the two apps read as a controlled experiment: what does a Tailwind-shaped compile-time
utility layer buy, and what does it cost, on a real Roblox component library?

```bash
pnpm --filter @lattice-ui/playground-vela build
pnpm --filter @lattice-ui/playground-vela serve
```

## What changed structurally

- **`theme/recipes.ts` is gone.** Its four recipes became literal class strings at each call
  site, and the Lattice dark palette moved into [`vela.config.ts`](./vela.config.ts) as vela
  theme tokens (`bg-surface`, `text-ink-400`, `border-edge`, `bg-accent`, `bg-danger`, …).
- **`Text`, `Box`, `Stack`, `Row`, `Surface` are mostly gone.** They exist to emit a
  `UIListLayout`/`UIPadding`/`UICorner` and a toned background — exactly what `flex-col`,
  `gap-*`, `p-*`, `rounded-*` and `bg-*` lower to. `Grid` survives only where
  `minColumnWidth` auto-fill is used, which has no utility equivalent.
- **The light/dark toggle is gone.** See [Runtime theming](#runtime-theming) below.
- **`scripts/link-rbxts.cjs`** links the workspace `@rbxts` scope into this app's
  `node_modules`, because vela's inlined runtime helper imports `@rbxts/services` and
  roblox-ts resolves Rojo `$path` coverage from the walked path, not the realpath.

## Numbers

Measured on this repo at the commit that added this app.

### Source

| | `apps/playground` | `apps/playground-vela` | |
| --- | ---: | ---: | --- |
| Scene source lines | 8,692 | **6,599** | −24% |
| Total app source lines | 9,650 | **7,298** | −24% |
| Theme definition | 163 (`recipes.ts`) | **62** (`vela.config.ts`) | |
| `theme.*` token reads | 1,212 | **0** | |
| `mergeGuiProps(...)` spreads | 142 | **0** | |
| Hand-written `uipadding`/`uilistlayout`/`uicorner`/`uistroke` | 416 | **0** | |
| `BackgroundTransparency` / `BorderSizePixel` boilerplate | 505 | **2** | preflight |
| `TextColor3` / `TextSize` / `TextXAlignment` props | 1,025 | **3** | |
| `className=` | 0 | 711 | |
| `Size={…}` still written as a prop | 828 | 489 | |

Per-scene, the reduction is consistent rather than driven by one outlier:

| Scene | react-style | vela |
| --- | ---: | ---: |
| `SettingsFormScene` | 445 | 350 |
| `DensityScopeScene` | 376 | 294 |
| `ToggleGroupBasicScene` | 372 | 192 |
| `SurfaceShowcaseScene` | 363 | 298 |
| `ScrollAreaBasicScene` | 354 | 238 |
| `SelectBasicScene` | 352 | 232 |
| `SliderBasicScene` | 348 | 275 |
| `DialogBasicScene` | 322 | 226 |

### Emitted Luau

| | `apps/playground` | `apps/playground-vela` | |
| --- | ---: | ---: | --- |
| Whole app | 10,543 | 24,424 | +132% |
| The 32 scenes with no dynamic `className` | 8,020 | 8,822 | +10% |
| Modules carrying the inlined runtime host | — | 5 | ~2,600 lines each |
| `out/` on disk | 436 KB | 796 KB | |

**This is the headline cost, and it is not the utilities' fault.** A `className` the compiler
can fold to a constant costs about 10% over hand-written props — that is preflight plus the
helper instances, and it is a fair trade. A `className` it cannot fold inlines vela's entire
runtime resolver *into that module*, and it is duplicated per module, not shared: five scenes
here carry ~2,600 lines apiece. Those five account for ~13,000 of the 24,424 lines.

Five dynamic class values out of 711 doubled the output. Keeping class values static is not a
style preference in vela; it is the difference between a 10% and a 130% code-size delta.

## Capability comparison

| | `@lattice-ui/react-style` | `vela-rbxts` 0.5.2 |
| --- | --- | --- |
| **Resolution** | Runtime, through `useTheme()` | Compile time, in the rbxtsc transformer |
| **Runtime light/dark swap** | ✅ header toggle re-renders everything | ❌ no `dark:` variant; one theme per config |
| **Density scopes resize live** | ✅ `DensityProvider` re-derives space/radius/type | ❌ `p-3` is 12px in the output, forever |
| **Variants** | ✅ `createRecipe` variant table + compound variants | ❌ one literal element per state |
| **Responsive** | ❌ none | ✅ `sm:` `md:` `lg:`, `portrait:`/`landscape:` |
| **Input mode / hover** | ❌ none | ✅ `touch:` `mouse:` `gamepad:` `hover:` |
| **Motion** | via `@lattice-ui/react-motion` | ✅ `transition` / `duration-*` / `animate-*` |
| **Bad token caught at build** | ❌ it's just TypeScript | ✅ `unknown-theme-key`, `unsupported-utility-family` |
| **Arbitrary pixel sizes** | ✅ any `UDim2` | ⚠️ spacing scale is `key × 4`; 295px is not expressible |
| **Arbitrary `ZIndex`** | ✅ | ⚠️ `z-{0,10,20,30,40,50}` only |
| **`UIStroke` transparency** | ✅ | ❌ `border-edge/45` → `unsupported-border-value` |
| **`TextTransparency`** | ✅ | ❌ `opacity-*` targets the background |
| **Font family** | ✅ any `Enum.Font` | ❌ fixed to Source Sans Pro, weight only |
| **Type size** | ✅ any number | ⚠️ Tailwind steps; `titleMd`'s 22px lands on `text-xl` (20) |
| **Responsive grid auto-fill** | ✅ `Grid minColumnWidth` | ❌ `grid-cols-*` is a constant |
| **Neutralizing Roblox defaults** | manual, every element | ✅ preflight, automatic |

## The four frictions worth knowing before you pick

### Runtime theming

The sibling playground's header toggles light/dark, and every scene restyles. vela has no
`dark:` variant, and the compiler folds a `className` only when the expression is constant —
`cond ? "a" : "b"` with a non-constant test drops to the runtime path, which understands
`bg-*`, `border*`, `rounded-*`, spacing, sizing, `divide-*`, the text transforms and motion,
and **silently discards everything else**, including every `text-*` color and every flex
utility.

So a runtime theme swap is not "verbose" here, it is out of reach: you would lose text colors
and layout on every themed element. This app compiles against the Lattice dark theme and drops
the toggle. `DensityScopeScene` and `SurfaceShowcaseScene` say so on screen.

### Variants become branches

`buttonRecipe({ intent: selected ? "primary" : "surface" })` is one call. The utility
equivalent is two elements — and the branch usually cannot be lifted into a helper component,
because `asChild` hands its merged props to a single **host** child, so a wrapper component
would swallow them. `ContextMenuBasicScene`, `MenuBasicScene` and `RadioGroupDisabledScene`
each duplicate a whole `Item` per intent for exactly this reason.

`ToggleGroupBasicScene` is the clearest case in both directions: 372 → 192 lines overall, and
yet `renderIconToggle(value, glyph, active, disabled)` — one function assembling a prop table
— had to become three literal elements.

### The 4px grid vs pixel-exact layout

vela's spacing scale resolves any non-negative multiple of `0.5` as `key × 4` pixels, so even
pixel counts are reachable but read oddly (`w-152.5` is 610px) and odd ones are not reachable
at all. `StackShowcaseScene`'s 295px and 595px panels keep their `Size` props. Across the app
489 `Size={…}` props survive — mostly computed values (`props.width`, `hasDescription ? 74 :
52`) that a compile-time class cannot read.

That is the honest shape of the port: utilities take colors, radius, padding, gap, flex,
border and text; pixel-exact and computed geometry stays in props.

### Composition boundaries move

`uicorner`/`uipadding`/`uilistlayout` can live in a `React.Fragment` and be spread into a
parent by the caller. Utilities cannot — they belong to the element that owns the helpers. In
`TabsBasicScene` the panel chrome had to move out of `PanelBody` and up onto each
`Tabs.Content` frame, repeated three times per orientation.

## Where each one wins

**Reach for `react-style` when** styling has to react to something at runtime — theme swaps,
density scopes, user-configurable palettes — or when you need a variant table that many call
sites share, or pixel-exact control the 4px grid cannot express.

**Reach for `vela-rbxts` when** the visual language is fixed at build time. It deletes about a
quarter of the source, all 1,212 token lookups, all 416 hand-written helper instances and all
505 lines of `BackgroundTransparency = 1` boilerplate, and it catches typos at build instead of
at runtime. It also brings capabilities `react-style` has none of at all: breakpoints,
orientation, input mode, and `hover:`.

They are not exclusive. This app still uses Lattice's primitives for behavior and `Grid` for
responsive auto-fill; only the paint changed. A production app could plausibly do the same —
utilities for static chrome, `useTheme()` for the parts that must move.

## Known deltas from the sibling app

Deliberate, and visible on screen:

1. **No theme toggle.** The header shows `Theme · Dark (compile-time)`.
2. **Density affects components only.** The toggle still drives Lattice primitives via
   `SystemProvider`; utility-styled chrome is frozen. `DensityScopeScene` hand-writes three
   scales instead of deriving them.
3. **Type sizes land on Tailwind steps.** `titleMd` (22px) renders at `text-xl` (20px).
4. **Strokes are opaque.** The sibling's `Transparency={0.35}` accents are not reproducible
   through `border-{color}` in 0.5.2.
5. **Fonts are Source Sans Pro.** `theme.typography.*.font` (Gotham) has no utility.
