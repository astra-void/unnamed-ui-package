---
"@lattice-ui/core-select": patch
"@lattice-ui/core-tabs": patch
"@lattice-ui/react-select": patch
"@lattice-ui/react-tabs": patch
"@lattice-ui/vide-select": patch
"@lattice-ui/vide-tabs": patch
---

Drive the select from a framework-free core, and settle registry-driven selection after the batch.

`@lattice-ui/core-select` owns the open and value state, the item registry the value is validated
against, the highlight that tracks pointer hover and managed focus apart, and the text a chosen item
shows through `Select.Value`.

Selection that depends on a registry now settles once the whole batch has registered rather than on
every registration, in both select and tabs. Resolving per item hands the selection to whichever one
registered first, because the rest are not there yet — the core exposes a `registryRevision` for
adapters to settle on instead.
