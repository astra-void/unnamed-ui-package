---
"@lattice-ui/core-toast": patch
"@lattice-ui/react-toast": patch
"@lattice-ui/vide-toast": patch
---

Drive the toast queue from a framework-free core.

`@lattice-ui/core-toast` owns the queue: enqueueing, the expiry sweep that reads each record's own
duration, the distinction between removing a toast that is on screen (it plays an exit) and one
still waiting its turn (it is simply dropped), and the finalize an exit's completion reports back.
