// Helpers shared by the Vide specs.
//
// The Vide layer cannot be exercised from the vitest harness — Vide is Luau-only — and it cannot be
// written in JSX here either, because one tsconfig carries one JSX factory and this app compiles
// with React's. Components are therefore called as the plain functions they are, which is all a
// Vide component ever is.

import { PortalProvider, Vide } from "@lattice-ui/vide-runtime";
import { defaultDarkTheme, type Theme } from "@lattice-ui/vide-style";
import { SystemProvider } from "@lattice-ui/vide-system";
import { getLocalPlayerGui } from "./playerGui";

export function findChildOfClass<T extends keyof Instances>(parent: Instance, className: T): Instances[T] | undefined {
  for (const child of parent.GetChildren()) {
    if (child.IsA(className)) {
      return child;
    }
  }

  return undefined;
}

export function findDescendantOfClass<T extends keyof Instances>(
  parent: Instance,
  className: T,
): Instances[T] | undefined {
  for (const descendant of parent.GetDescendants()) {
    if (descendant.IsA(className)) {
      return descendant;
    }
  }

  return undefined;
}

export function countDescendantsOfClass<T extends keyof Instances>(parent: Instance, className: T) {
  let total = 0;
  for (const descendant of parent.GetDescendants()) {
    if (descendant.IsA(className)) {
      total += 1;
    }
  }

  return total;
}

export function findDescendantWithText(parent: Instance, text: string): GuiObject | undefined {
  for (const descendant of parent.GetDescendants()) {
    if (descendant.IsA("TextLabel") || descendant.IsA("TextButton") || descendant.IsA("TextBox")) {
      if (descendant.Text === text) {
        return descendant;
      }
    }
  }

  return undefined;
}

/**
 * Reads a property through a call.
 *
 * These properties change reactively between assertions, and reading one directly lets a previous
 * assertion's narrowing convince the compiler the next read is impossible.
 */
export function readProperty<T>(read: () => T): T {
  return read();
}

export type SystemHarness<T> = {
  destroy: () => void;
  playerGui: PlayerGui;
  /** Drives the controlled theme, which is how a re-theme becomes observable in a spec. */
  setTheme: (theme: Theme) => void;
  node: T;
};

/**
 * Mounts a subtree under the providers a themed primitive expects.
 *
 * A Vide component runs once, so a theme change can only reach the tree through bindings. Driving
 * the theme from here is what lets a spec tell a binding from a snapshot.
 */
export function mountWithSystem<T>(children: () => T): SystemHarness<T> {
  const playerGui = getLocalPlayerGui();
  const theme = Vide.source<Theme>(defaultDarkTheme);

  const [destroy, node] = Vide.root(
    () =>
      SystemProvider({
        theme,
        children: () => PortalProvider({ container: playerGui, children: children as () => Vide.Node }),
      }) as T,
  );

  return {
    destroy,
    playerGui,
    setTheme: (nextTheme: Theme) => {
      theme(nextTheme);
    },
    node,
  };
}
