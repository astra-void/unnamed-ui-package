import type { Reactivity, Source } from "@lattice-ui/core-runtime";
import Vide from "./vide";

/**
 * Reactivity for the Vide layer.
 *
 * Vide already is the reactivity a core needs, so this is a naming adapter and nothing more: the
 * only real difference is that a Vide source is a getter and a setter in the same call, while the
 * contract keeps them apart so a framework without that shape can implement it too.
 */
export function createVideReactivity(): Reactivity {
  return {
    source: <T>(initial: T): Source<T> => {
      const source = Vide.source(initial);

      return {
        get: () => source(),
        set: (nextValue: T) => {
          source(nextValue);
        },
      };
    },
    derive: <T>(compute: () => T) => Vide.derive(compute),
    effect: (run: () => void) => {
      Vide.effect(run);
    },
    cleanup: (dispose: () => void) => {
      Vide.cleanup(dispose);
    },
    batch: (run: () => void) => {
      Vide.batch(run);
    },
    untrack: <T>(read: () => T): T => Vide.untrack(read),
  };
}
