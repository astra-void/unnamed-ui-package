# Multi-framework architecture

**Status:** accepted. Phases 0-3 complete; Phase 4 not started. The contract survived Phase 3 with one refinement (§3.5).
**Scope:** adding a Vide layer alongside the existing React layer. A hand-written Luau layer is
explicitly out of scope for now (see D6).
**Last updated:** 2026-08-19.

> A previous version of this document lived in `docs/multi-framework-architecture.md`, which was
> never tracked (`docs` was gitignored in full) and is lost. `.gitignore` now keeps the untracked
> docs site output ignored while tracking `docs/architecture/`. Keep architecture notes here.

## 1. Goal

Ship Lattice UI primitives to more than one Roblox UI framework without maintaining more than one
implementation of their behavior.

Today every primitive's behavior — controlled/uncontrolled state, focus flow, layering, presence
timing, popper geometry — is written inside React components. A second framework would either
duplicate all of it or drift from it. Neither is acceptable across 27 packages.

The target is: **behavior lives in framework-free cores; a framework layer only builds the render
tree.**

## 2. Package layout

The existing invariant holds: `packages/<layer>/<name>` publishes as `@lattice-ui/<layer>-<name>`,
and each layer's foundation package is named `runtime`.

```
packages/core/runtime          @lattice-ui/core-runtime      reactivity contract + shared helpers
packages/core/<primitive>      @lattice-ui/core-<primitive>  framework-free behavior
packages/react/runtime         @lattice-ui/react-runtime     (exists) React adapter foundation
packages/react/<primitive>     @lattice-ui/react-<primitive> (exists) refactored onto cores
packages/vide/runtime          @lattice-ui/vide-runtime      Vide adapter foundation
packages/vide/<primitive>      @lattice-ui/vide-<primitive>  Vide adapter
packages/tools/cli             lattice-ui                    (exists) outside the layer axis
```

Core packages stay **granular, one per primitive** (D4). Roblox has no tree-shaking: a Rojo tree
includes every module of every dependency, so a single monolithic `@lattice-ui/core` would ship all
27 primitives' logic into the place file of a consumer who imported one checkbox.

Foundations (`focus`, `layer`, `motion`, `popper`, `style`, `system`) follow the same rule and get
`core-*` counterparts as they are migrated.

## 3. The contract

### 3.1 Reactivity is injected, never imported

`@lattice-ui/core-runtime` defines the interface; it depends on no framework.

```ts
type Source<T> = { get(): T; set(next: T): void };
type Derivable<T> = T | (() => T);

interface Reactivity {
  source<T>(initial: T): Source<T>;
  derive<T>(compute: () => T): () => T;
  effect(run: () => void): void;
  cleanup(dispose: () => void): void;
  batch(run: () => void): void;
  untrack<T>(read: () => T): T;
}
```

- **Vide** supplies this almost verbatim: `vide.source` is a getter/setter in one call, so `get`/`set`
  are two thin wrappers; `derive`/`effect`/`cleanup`/`batch`/`untrack` map 1:1.
- **React** supplies an observable-backed implementation. `effect` runs synchronously on change
  outside React's render cycle, and a `useCore(core)` hook subscribes to a version counter and forces
  a re-render. React 17 has no `useSyncExternalStore`, so `react-runtime` carries a `useState` +
  `useEffect` subscription shim.

### 3.2 Cores are imperative factories, not hooks

A Vide component body runs **once**. A core therefore cannot be a hook and cannot be re-created per
render. Every core is a plain factory, constructed once per primitive instance:

```ts
createCheckbox(rx: Reactivity, inputs: {
  checked?: Derivable<CheckedState | undefined>;
  defaultChecked?: CheckedState;
  disabled?: Derivable<boolean>;
  required?: Derivable<boolean>;
  onCheckedChange?: (checked: CheckedState) => void;
}): CheckboxCore;
```

Inputs arrive as `Derivable` so that:

- React passes getters closing over a ref that it refreshes each render (`() => propsRef.current.checked`),
- Vide passes its own sources directly (`checked` is already `() => T`).

Cores must be **pure to construct** — no side effects at call time, all teardown registered through
`rx.cleanup`. Vide strict mode calls components twice; a core that mutates global state on
construction breaks under it.

### 3.3 Cores emit bindings, not values

Anything derived from state is emitted as a getter (`() => value`). Static values stay plain. React
calls the getters during render; Vide binds them straight into instance props.

### 3.4 `ElementSpec` is the neutral render description

```ts
interface ElementSpec<T extends Instance> {
  neutral: Partial<WritableInstanceProperties<T>>;   // Roblox defaults the primitive neutralizes
  props: Record<string, Derivable<unknown>>;         // behavior props
  events: Record<string, Callback>;                  // signal handlers (Activated, InputBegan, …)
  changes: Record<string, Callback>;                 // property-change handlers
  refs: Array<(instance: T | undefined) => void>;    // instance access
}
```

Each layer's `runtime` translates a spec into that framework's shape and is responsible for the
spread order mandated by AGENTS.md: **neutral defaults → consumer passthrough → behavior props**, with
consumer event handlers *composed* with the primitive's rather than replaced.

Asymmetry to respect: a React `ref` callback fires with `undefined` on unmount; a Vide `action` fires
only on creation. Cores must never treat "ref called with undefined" as their teardown signal — use
`rx.cleanup`.

### 3.5 Pushed inputs, for anything edge-triggered

Phase 3 changed one thing about §3.2. An input a core only *reads* — a placement, a `disabled` flag —
stays a `Derivable` getter. An input a core has to *react to* does not: it becomes a source the core
owns, with an explicit setter.

```ts
presence.setPresent(open);   // not: createPresence(rx, { present: () => open })
layer.setEnabled(open);
```

The reason is React. A getter tracks only if reading it reads a source, and a boolean that crossed a
React context boundary is a plain value — `() => context.open` records no dependency, so an effect
built on it never re-runs. Vide has no such problem, but a contract that only works in one of the two
frameworks is not a contract. Pushing the value in works identically in both: React syncs it from an
effect with a dependency array, Vide from a tracked effect.

The same reasoning produced `PopperCore.sync()`. Positioning options arrive from React as plain
numbers that no source announces, so the adapter tells the core they changed; the core's own
Heartbeat would otherwise catch it a frame later. An existing regression test caught this — the core
was recomputing on measurement changes but not on a changed `sideOffset`.

One consequence for the React layer: **context carries the core plus this render's snapshot**, not a
snapshot alone. Effects need the live core; rendering needs values; and the context value's identity
has to change when the state does, or consumers that are not descendants of a re-rendering parent
never hear about it.

## 4. React ↔ Vide semantics

Verified against `@rbxts/vide@0.6.1` (`src/index.d.ts`).

| | React (`@rbxts/react` 17) | Vide 0.6.1 |
|---|---|---|
| Component | re-runs on every state change | runs **once** |
| Reactivity | hooks + re-render | `source()` getter/setter, `effect`, `derive` |
| Instance props | values | `Derivable<T> = T \| (() => T)` |
| Events | `Event={{ Activated: fn }}` / `Change={{…}}` | flat props: `Activated={fn}`, `<Prop>Changed={fn}` |
| Instance access | `ref`, `composeRefs` | `action` prop, priority-ordered |
| `asChild` | `Slot`: clone element + merge props | `vide.apply(instance)(props)` |
| Context | `useContext`, readable any time during render | `context()` **top-level only**; `<Provider>` children is a function |
| Conditional | `if` + re-render | `show()` / `switch()` (exposed as `match()`) |
| Lists | `map` | `indexes()` / `values()` |
| Portal | `ReactRoblox.createPortal` | set `Parent` |
| JSX | `jsxFactory: React.createElement` | `jsxFactory: Vide.jsx`, `jsxFragmentFactory: Vide.Fragment` |
| Toolchain | roblox-ts 3.x | roblox-ts ≥ 3.0, `@rbxts/compiler-types@3.0.0-types.0` |

Two of these drive most of the work: **components run once** (so bindings, not values) and
**`Derivable` props** (so prop merging composes functions, not just overwrites).

The migration is less daunting than the 10.5k lines of `.tsx` suggest — much of the hard logic is
already framework-free:

| package | `.ts` | `.tsx` | note |
|---|---|---|---|
| `popper` | 631 | 0 | already pure |
| `motion` | 1882 | 70 | zero `@rbxts/react` imports outside its 3 hooks |
| `focus` | 1871 | 155 | imperative manager + 2 contexts + `FocusScope` |
| `layer` | 329 | 298 | presence FSM and dismissable stack are portable |

## 5. Testing

Vide is **Luau-only** (`@rbxts/vide` ships `main: src/init.lua`); there is no JS implementation to
alias into vitest the way `@rbxts/react` → `react` works today. Therefore:

- **Behavior tests live in `core-*`** and run under the existing vitest harness. Coverage improves:
  logic currently reachable only through React components becomes directly testable.
- **Adapter tests only assert tree assembly.** React: vitest. Vide: `apps/test-harness` (TestEZ).
- **Visual verification**: `apps/playground` (React) and a new `apps/playground-vide`, via Rojo serve
  and Studio.

`vitest.config.mts`'s alias regex `^@lattice-ui/([a-z]+)-(.*)$` already resolves `core-*` and `vide-*`
to `packages/$1/$2/src`. Note the known gotcha: the alias does not handle subpaths, so internal
modules must be imported by relative path from tests.

## 6. Versioning and release

All publishable packages stay on the **single lockstep line** (currently `0.8.1`), including
`core-*` and `vide-*` (D1). Maturity is communicated by documentation, not by version numbers:

- a coverage matrix in the root README and in each `vide-*` README,
- `vide-*` packages excluded from CLI presets until they reach parity,
- `core-*` released in the same cadence as the React layer that consumes them.

## 7. Roadmap

Phase 0 is this document. Later phases are re-confirmed at each boundary; Phase 3 is an explicit
checkpoint where the contract may be revised before mass migration.

| phase | content | done when |
|---|---|---|
| 0 | decisions + this document | **done** — tracked at `docs/architecture/` |
| 1 | workspace plumbing accepts a second layer | **done** — `packages/core/runtime` and `packages/vide/runtime` exist and the full `check` / `build` / `typecheck` / `lint` suite passes |
| 2 | vertical slice 1: `checkbox` | **done** — one core drives both layers; the Vide harness spec compiles but has not been executed |
| 3 | vertical slice 2: `popover` (portal + presence + dismissable + popper) | **done** — contract survived with the §3.5 refinement; focus and motion stayed on the React side |
| 4 | remaining primitives, in waves A–D | **waves A, B and C done**; D open |
| 5 | distribution: playground, harness suite, CLI framework dimension, docs, publish | `@lattice-ui/vide-*` on npm |

Phase 4 waves:

- **A** — switch, toggle-group, progress, avatar, radio-group, tabs — **done**. Two constraints came
  out of it: an item's activation guard has to outlive a render, so a group builds its items through
  a factory rather than describing them with a per-render spec; and roblox-ts compiles no property
  getters, so ordered selection takes a `getGuiObject` alongside a `ref` (an adapter holding
  instances in a source cannot fake a ref object). Response motion moved to the core here too.
- **B** — text-field, textarea, slider, scroll-area — **done**. These carry the least framework-shaped
  behavior of any wave: what moved was the read-only write-back into a `TextBox` the engine already
  let the player type into, the auto-resize pass that runs twice because `TextBounds` lags the edit
  that caused it, the drag that follows one finger or any mouse movement, and scrollbar visibility
  that hides on idle only under `type="scroll"`.
- **C** — dialog, tooltip, menu, context-menu, select, combobox, toast, accordion — **done**. Two
  rules came out of this wave. A child that owns state builds its core on its *own* reactivity, not
  its parent's: an item's highlight on the menu's reactivity re-renders the menu, which in React
  does not re-render the item. And selection that depends on a registry settles once the batch has
  registered, never per registration — resolving after the first item alone hands the selection to
  it, because the rest are not there yet.

  The subtle behavior each core had to keep is the point of the exercise: the guarded pair of events
  one gamepad activation fires, a combobox telling its own write to the input apart from the player
  typing, and the label cache that lets a selection still have a name after the popup holding its
  item has closed.
- **D** — style, system (most React-context-shaped; may ship for Vide later or not at all)

### Phase 1, as built

- `workspace.policy.json` gained a `layers` map. `defaultPeerDependencies` / `defaultDevDependencies`
  were workspace-wide and would have forced React peers onto Vide and core packages; peers, dev
  dependencies, and the tsconfig base a layer's packages must extend are now declared per layer, and
  `workspace-check.ts`, `workspace-sync.ts` and `create-package.ts` all read that one map.
- `tsconfig.base.json` is framework-neutral again; `tsconfig.react.json` and `tsconfig.vide.json`
  carry the JSX factories. `core/*` extends the neutral base and compiles no JSX. Which base a
  package extends is enforced by `workspace-check.ts`, because extending the wrong one silently
  compiles JSX with the other framework's factory.
- `layers.<layer>.hoistedLinks` was **not** in the original plan and is required. roblox-ts derives a
  module's scope from its path relative to that package's own `node_modules`, so under this
  workspace's hoisted install a package that imports `@rbxts/*` directly fails to compile with "You
  cannot use modules directly under node_modules". The repository already solved this per package
  with `scripts/ensure-hoisted-links.mjs` plus a `prebuild` hook (`react/motion`, `react/popper`,
  `react/runtime`). Every `vide/*` package imports `@rbxts/vide`, so the flag is set for the whole
  layer and `create-package.ts` emits the script from `scripts/templates/` and wires the hook.
- `packageDefaults.scripts` gained `lint` / `lint:fix`. Every package already defined them; the
  policy simply did not say so, so scaffolded packages silently came out without them.
- The hand-maintained `paths` maps (`tsconfig.eslint.json`, `apps/*/tsconfig.json`) are not managed by
  `workspace-sync`, only asserted by `workspace-check`. New packages must be added to all five by hand.
- Root `devDependencies` gained `@rbxts/vide@0.6.1`.

Verified end to end: a `.tsx` file in `packages/vide/runtime` compiles to
`Vide.jsx("textbutton", { Text = function() ... end, Activated = ... })`, with a reactive property
binding and a flat event prop — the JSX factory, the peer setup and the hoisted links all resolve.

**Deferred to Phase 5: the CLI framework dimension.** The registry keys components by bare name
(`checkbox` -> `@lattice-ui/react-checkbox`), so adding a framework axis changes the CLI's data
format, its commands and its tests. Nothing is installable for Vide until Phase 2 at the earliest, so
designing that format now would be guesswork.

### Phase 2, as built

`@lattice-ui/core-checkbox` owns checkbox behavior; both layers render it.

- `core-runtime` grew `createStandaloneReactivity` (a small synchronous signal implementation) and
  `createControllableState`, ported from the React `useControllableState` hook. The React layer wraps
  the standalone reactivity with a re-render notification; Vide passes its own `source`/`effect`
  straight through.
- Each layer's runtime translates `ElementSpec` itself: React resolves derivable props to values and
  merges into `Event` / `Change` tables and a composed `ref`, while Vide passes the getters through
  untouched and writes flat event props, `<Prop>Changed` props and an `action`.
- `asChild` in Vide is `vide.apply(instance)(props)` — no cloning, no prop-bag merge, because Vide
  hands the primitive a real instance.
- Coverage went up rather than sideways: behavior that was only reachable through a rendered React
  component is now directly testable, and the slice added 35 unit tests (19 core, 8 spec-translation,
  8 React adapter).

Constraints found while building it, all of which shape the remaining phases:

- **roblox-ts distinguishes method syntax from property syntax.** `get(): T` in an interface compiles
  to a colon-call with an implicit `self`, so assigning a plain function to it is an error. Every
  core interface uses `get: () => T` instead. `tsc` accepts both, so only `rbxtsc` catches this.
- **`next` is a reserved identifier** (the Luau global). Parameters are named `nextValue`.
- **`Array.clear()` exists in roblox-ts's types but not in the JS runtime** the vitest harness runs
  the same source under. The two runtimes also disagree on `size()` versus `length`. Cores must stay
  inside the intersection of both.
- **A package with internal dependencies must list `@lattice-ui` in its tsconfig `typeRoots`.**
  `react/runtime` had never needed one until it depended on `core-runtime`, and the failure reads as
  "You can only use npm scopes that are listed in your typeRoots".
- **An app's tsconfig `paths` map is per layer.** One tsconfig carries one JSX factory, so a React app
  that maps a Vide package to source pulls `.tsx` it cannot compile into its program. `workspace-check`
  now derives the layers an app may map from the tsconfig base it extends, and reports both a missing
  entry and a foreign one.
- **Apps should reach Vide through `@lattice-ui/vide-runtime`**, which re-exports it, rather than
  importing `@rbxts/vide` directly — otherwise the app needs the hoisted-links workaround too.

Where the Vide layer deliberately differs from React:

- **Children of a context-providing component must be written as a function**
  (`<Checkbox.Root>{() => <Checkbox.Indicator />}</Checkbox.Root>`). Vide evaluates JSX children
  before the parent runs, so an eagerly written child reads the context before it exists.
- **`Checkbox.Indicator` takes no `transition`.** It mounts and unmounts with the checked state via
  `show()`, or stays mounted under `forceMount` with `Visible` bound. Presence timing and motion
  belong to the layer and motion cores, which Phase 3 brings over; the prop is absent rather than
  accepted and ignored.

**Not verified: the Vide checkbox has never run.** `apps/test-harness/src/tests/vide-checkbox`
covers neutral defaults, reactive `Active`/`Selectable`, indicator mount/unmount, `forceMount`
visibility and the indeterminate case, and it typechecks and compiles — but executing it needs
`run-in-roblox` with Studio closed. Everything claimed about the Vide layer so far rests on
compilation and on the core's unit tests.

### Phase 3, as built

The hard slice: `popover` needs a portal, presence timing, a dismissable layer stack, anchored
placement, focus and motion at once. Three cores came out of it.

- **`@lattice-ui/core-popper`** — `compute`, `observers` and `options` moved over unchanged (they
  never referenced a framework), joined by `createPopper`, which owns the measurement loop, the
  Roblox property-changed subscriptions and the Heartbeat that re-syncs them. This was the piece most
  likely to break the contract and did not: what it needed from a framework was somewhere to put the
  result.
- **`@lattice-ui/core-layer`** — the layer stack, the outside-pointer test and the inset constants
  moved over unchanged; `createPresence` and `createDismissableLayer` are new. Presence keeps its
  fallback timeout, so an exit that never reports completion still ends.
- **`@lattice-ui/core-popover`** — open state, the trigger/anchor/content instances, and the element
  specs. It holds the instances itself rather than taking refs, because a React ref, a Vide source
  and a plain upvalue are three spellings of the same thing. Focus is injected as a `focusInstance`
  mechanism: the decision to focus the trigger before opening is the core's, the mechanism is not.

What the Vide layer showed:

- **A portal needs no machinery.** A Vide component returns a real instance, so a portal is that
  instance parented elsewhere, a `cleanup` to tie its lifetime to the scope, and `undefined` returned
  so the caller does not re-parent it back.
- **Pushing open state into three cores is one effect**, because in Vide the open state is a source.
  The React adapter needs three dependency-array effects to say the same thing.

More roblox-ts and toolchain constraints found:

- **Getters and setters are not supported.** A `{ get current() { return core.getTrigger(); } }` ref
  wrapper typechecks and fails to compile. It was replaced by an `insideRoots` callback on
  `DismissableLayer`, which is a better API than the ref array anyway.
- **`Vide.root` resolves to its LuaTuple overload even for a void callback**, so callers destructure
  (`const [destroy] = Vide.root(...)`).
- **A layer package must reach the contract through its own layer runtime.** TypeScript resolves a
  module once per program: when another dependency's declarations reach `@lattice-ui/core-runtime`
  first, the resolved path lands under *that* package's `node_modules`, and roblox-ts then computes a
  scope of `".."` and refuses to emit the import ("You cannot use modules directly under
  node_modules"). `vide-runtime` therefore re-exports the contract, and `vide/*` packages import
  `Derivable`, `Reactivity` and `read` from there. The same trap is why the React layer's structure —
  a package importing its own primitive's core plus its layer's siblings, never a core a sibling
  already owns — is the shape to keep.
- **Every `vi.mock("@lattice-ui/react-runtime")` has to grow with the runtime.** Six test files
  needed `useLatticeCore` or `applyElementSpec` added. A relative `require()` inside a mock factory
  does not resolve under vitest — the factory has to be `async` and use `await import`.

**Focus followed** (`@lattice-ui/core-focus`), which was the largest remaining piece. It turned out
to be the thinnest of them in the end: 1,300 of the package's 2,000 lines — the whole focus manager,
its navigation resolution and the trapped-scope stack — never imported a framework at all. Only six
files did, and of those `orderedSelection` needed nothing but a structural `FocusRef` type in place
of React's `MutableRefObject`.

What did have to be rewritten was the lifecycle around the manager: `createFocusScope` owns
registration, the scope's settings as getters, and holding the navigation binds open while a scope is
active; `createFocusNode` owns a node's registration and re-registers when its scope changes, since a
node's scope is part of its identity to the manager. `@lattice-ui/vide-focus` binds both, and the
Vide popover now traps and restores focus the way the React one does.

**Motion followed immediately after** (`@lattice-ui/core-motion`). The motion runtime never imported
a framework, so only the presence state machine had to be rewritten — as a `sync(inputs)` core in the
§3.5 shape, with one correction: the instance is read through a getter rather than stored, because
the mount-retry loop runs on later frames and has to see the instance that exists *then*.
`@lattice-ui/vide-motion` binds it to Vide sources, and both Vide primitives now accept `transition`,
so their exits wait for the animation instead of the presence fallback.

One Vide-specific hazard came out of that binding: `sync` reads the machine's own phase and writes it
immediately after, so a tracked effect around it re-enters forever. The inputs are read tracked and
the `sync` call itself is wrapped in `untrack`.

**Not verified: the Vide popover has never run.**
`apps/test-harness/src/tests/vide-popover` covers the neutralized trigger, the disabled trigger, the
portal parenting its layer into the PlayerGui, presence-driven mounting, and scope teardown
destroying the portalled layer — and it typechecks and compiles, but has not been executed.

## 8. Decisions

**D1 — Version line: single lockstep, not a separate experimental line.**
Reverses the initial recommendation. `scripts/workspace-check.ts` enforces exactly one version across
all packages and a single changesets `fixed` group covering every publishable package. Relaxing both
is real churn for a purely cosmetic maturity signal; a coverage matrix communicates maturity better
than a version number.

**D2 — Ship Vide incrementally, not at parity.**
Foundations plus the first primitives ship as soon as they are correct, with published coverage.
Waiting for 27-package parity delays all feedback to the end, which is when contract mistakes are
most expensive.

**D3 — React refactors onto the cores; Vide does not get an independent implementation.**
Independent implementations are faster for one primitive and guarantee drift across 27. The risk —
regressions in the shipped 0.8.x React line — is contained by migrating one primitive at a time with
the existing vitest suite as the gate.

**D4 — One core package per primitive, not a monolithic core.**
Reverses the initial recommendation. Roblox has no tree-shaking, so a monolithic core would bloat
every consumer's place file with primitives they never imported. Package count is the acceptable cost.

**D5 — Architecture docs are tracked under `docs/architecture/`.**
The rest of `docs/` (local site output) stays ignored.

**D6 — The hand-written Luau layer is deferred.**
wally/RuntimeLib bundling for Luau distribution is the largest unresolved question in the whole
restructure. Bundling it into this effort would hold Vide hostage to it.

## 9. Risks

1. **React regressions.** 0.8.x is published and in use. Mitigation: per-primitive migration, existing
   tests green before each merge, no behavior changes bundled with a migration.
2. **Vide strict mode double-invokes components.** Mitigation: cores pure to construct (§3.2).
3. **`Derivable` prop merging.** A consumer passing `BackgroundColor3={() => …}` for a prop the
   primitive also sets requires function composition, not overwrite. This lives in `vide-runtime` and
   is the single most likely source of subtle bugs.
4. **Context read timing.** Vide requires `context()` at component top level. React patterns that read
   context lazily (e.g. `useMenuItemContext` inside a callback) do not transfer directly.
5. **Rojo instance names must be unique across layers.** A package's `default.project.json` `name`
   is the instance a consumer's synced `node_modules/@lattice-ui` tree exposes, and `getModule`
   looks it up by that name. Naming it after the directory was unique while `react` was the only
   layer; `react/checkbox` and `core/checkbox` would both have claimed `"checkbox"`. New packages
   are named `<layer>-<name>` and `create-package.ts` enforces it. The `react` layer still uses bare
   names — and `react/runtime` is still called `"core"` from the pre-Phase-0 rename — which is
   consistent only because nothing else claims those names. Renaming them changes emitted code in
   every consuming package, so it needs its own change with runtime verification.
6. **`@rbxts/vide` ships no `default.project.json`.** `@rbxts/react` does, so an import of it emits
   `TS.getModule(script, "@rbxts", "react")`, while Vide emits
   `TS.getModule(script, "@rbxts", "vide").src` — roblox-ts falls back to the package's `main` path.
   This compiles, but whether that resolves inside a consumer's synced Roblox tree is **unverified**;
   `apps/playground-vela` already carries a `materialize-rbxts` workaround for a related problem.
   First thing to check when a Vide playground runs in Studio.
7. **Publish surface growth.** Up to ~81 packages against a registry that requires a manually entered
   2FA OTP. Mitigation: `pnpm -r publish` in a single run; revisit if OTP expiry becomes a problem.
