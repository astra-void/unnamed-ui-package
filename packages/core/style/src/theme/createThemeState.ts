import { createControllableState, type Derivable, type Reactivity } from "@lattice-ui/core-runtime";
import { defaultLightTheme } from "./tokens";
import type { Theme } from "./types";

export interface ThemeStateOptions {
  theme?: Derivable<Theme | undefined>;
  defaultTheme?: Theme;
  onThemeChange?: (theme: Theme) => void;
}

export interface ThemeState {
  theme: () => Theme;
  setTheme: (theme: Theme) => void;
}

/** The theme a tree renders against, controlled or not, free of any UI framework. */
export function createThemeState(rx: Reactivity, options: ThemeStateOptions = {}): ThemeState {
  const state = createControllableState<Theme>(rx, {
    value: options.theme,
    defaultValue: options.defaultTheme ?? defaultLightTheme,
    onChange: options.onThemeChange,
  });

  return {
    theme: state.get,
    setTheme: (theme) => {
      state.set(theme);
    },
  };
}
