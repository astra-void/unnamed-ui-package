# lattice-ui

Node CLI for Lattice UI projects.

## Install (Optional Global)

```bash
npm i -g lattice-ui
```

## Usage

```bash
lattice <command> [options]
```

### Commands

- `lattice create [project-path] [--yes] [--pm <pnpm|npm|yarn>] [--framework <react|vide>] [--git] [--template rbxts] [--lint] [--no-lint]`
- `lattice init [--yes] [--dry-run] [--pm <pnpm|npm|yarn>] [--framework <react|vide>] [--template rbxts] [--lint]`
- `lattice add [name...] [--preset <preset...>] [--framework <react|vide>] [--pm <pnpm|npm|yarn>] [--yes] [--dry-run]`
- `lattice remove [name...] [--preset <preset...>] [--framework <react|vide>] [--pm <pnpm|npm|yarn>] [--yes] [--dry-run]`
- `lattice upgrade [name...] [--preset <preset...>] [--framework <react|vide>] [--pm <pnpm|npm|yarn>] [--yes] [--dry-run]`
- `lattice doctor [--framework <react|vide>] [--pm <pnpm|npm|yarn>]`
- `lattice help [command]`
- `lattice version`

Every command has its own help page. `lattice add --help` and `lattice remove --help` also print the
full list of available components and presets, grouped by the frameworks that ship each one, so
there is no need to start a run to discover them.

```bash
lattice add --help
lattice help add     # same output
```

### Global options

- `-h`, `--help`
- `-v`, `--version`
- `--verbose` — print debug-level progress output
- `-y` is accepted everywhere `--yes` is

### Output

In a terminal, a run is drawn as one continuous flow: a vertical gutter connects the header, each
titled block and the closing verdict, with the elapsed time on the last line.

```
┌  lattice add   dry run
│
│  Project     ~/work/demo
│  Manager     npm · lockfile
│  Components  dialog, toast
│
◇  Would install 4 packages
│  ├ @lattice-ui/react-dialog
│  ├ @lattice-ui/react-toast
│  ├ @rbxts/react
│  └ @rbxts/react-roblox
│
▲  Optional providers
│  └ @lattice-ui/react-layer:PortalProvider
│
│  › npm add @lattice-ui/react-dialog @lattice-ui/react-toast …
│
└  Nothing changed. Re-run without --dry-run to apply.   0.4s

   › npx lattice-ui doctor
```

Piped or redirected output drops the box drawing for plain indentation and ASCII tags, so logs and
CI transcripts stay readable.

Project paths and package names are clickable in terminals that support OSC 8 hyperlinks — paths
open the directory, package names open their npm page.

| Variable | Effect |
| --- | --- |
| `NO_COLOR` | Disable colour. Wins over `FORCE_COLOR`. |
| `FORCE_COLOR` | Force colour through a pipe (`0` disables). |
| `NO_HYPERLINK` | Disable clickable links. |
| `FORCE_HYPERLINK` | Force links on (`0` disables). Off automatically when `CI` is set. |

The package manager's own output is buffered while a spinner runs and printed only if the
command fails. Pass `--verbose` to stream it live instead.

### Examples

```bash
npx lattice-ui create
npx lattice-ui create my-game --pm npm --git --no-lint
npx lattice-ui init --dry-run
npx lattice-ui add dialog,toast --preset overlay
npx lattice-ui remove dialog --dry-run
npx lattice-ui upgrade --dry-run
npx lattice-ui doctor
```

When `--pm` is omitted, the CLI resolves a package manager automatically from the project lockfile or installed managers. Use `--pm` to override that choice explicitly. Every command reports which manager it picked and why, e.g. `npm (lockfile)`.

### Frameworks

A component is one name across every framework that ships it, so `lattice add dialog` is the same
request whichever layer a project is on. Which layer it means comes from `--framework`, or from the
project's own dependencies when the flag is omitted — depending on `@rbxts/vide`, or on any
`@lattice-ui/vide-*` package, is enough. Every command reports which it picked and why, e.g.
`Vide (detected)`.

A project that carries both layers is asked rather than guessed at: picking one would install into
the wrong half of a codebase that deliberately runs two.

```bash
npx lattice-ui create my-game --framework vide
npx lattice-ui add dialog --framework vide
```

Two React packages have no Vide counterpart — `layer` and `popper` — and asking for one says so
plainly rather than reporting a typo. A preset keeps its name on both layers and quietly loses the
members a layer has no package for; the run lists what it dropped.

`doctor` still recognizes a package from either layer, because a leftover from before a migration is
known, just not from the layer the project is on now.

### Prompts

Selection prompts are keyboard-driven:

| Key | Action |
| --- | --- |
| `↑` `↓` (or `k` `j`) | Move the cursor |
| `space` | Toggle the entry (multi-select only) |
| `a` / `n` | Select all / clear (multi-select only) |
| `enter` | Confirm |
| `ctrl+c` / `esc` | Cancel |

Long lists scroll inside a window sized to the terminal, with the visible range shown underneath.
An unparseable answer re-asks instead of failing the command. Prompts need a TTY; in a
non-interactive environment pass `--yes` along with the values as options.
