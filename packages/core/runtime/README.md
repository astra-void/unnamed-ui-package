# @lattice-ui/core-runtime

Framework-free foundation for Lattice UI.

This package holds the contract that lets one behavior implementation serve more than one UI
framework: the injected `Reactivity` interface, `Derivable` values, and the `ElementSpec` description
of what a primitive renders. It imports no UI framework and renders nothing itself.

Consumers do not normally depend on this directly — use `@lattice-ui/react-*` or
`@lattice-ui/vide-*`. See `docs/architecture/multi-framework.md` in the repository for the design.
