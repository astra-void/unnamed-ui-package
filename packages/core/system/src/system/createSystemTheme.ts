import {
  createControllableState,
  type Derivable,
  defaultLightTheme,
  type Reactivity,
  type Theme,
} from "@lattice-ui/core-style";
import { applyDensity } from "../density/density";
import type { DensityToken } from "../density/types";

const DEFAULT_DENSITY: DensityToken = "comfortable";

export interface BaseThemeStateOptions {
  theme?: Derivable<Theme | undefined>;
  defaultTheme?: Theme;
  onThemeChange?: (theme: Theme) => void;
}

export interface BaseThemeState {
  /** The theme as authored, before density is applied. Writes target this one. */
  baseTheme: () => Theme;
  setBaseTheme: (theme: Theme) => void;
}

export interface DensityStateOptions {
  density?: Derivable<DensityToken | undefined>;
  defaultDensity?: DensityToken;
  onDensityChange?: (density: DensityToken) => void;
}

export interface DensityState {
  density: () => DensityToken;
  setDensity: (density: DensityToken) => void;
  /** The theme to render against: the base theme with this scope's density folded in. */
  resolveTheme: (baseTheme: Theme) => Theme;
}

/**
 * The theme as authored.
 *
 * Kept apart from density so that a write targets what the consumer wrote, and every read of the
 * resolved theme re-derives it — which is what lets a nested density scope exist at all.
 */
export function createBaseThemeState(rx: Reactivity, options: BaseThemeStateOptions = {}): BaseThemeState {
  const state = createControllableState<Theme>(rx, {
    value: options.theme,
    defaultValue: options.defaultTheme ?? defaultLightTheme,
    onChange: options.onThemeChange,
  });

  return {
    baseTheme: state.get,
    setBaseTheme: (theme) => {
      state.set(theme);
    },
  };
}

/** A density scope. Nesting one inside another re-derives the same base theme at a new density. */
export function createDensityState(rx: Reactivity, options: DensityStateOptions = {}): DensityState {
  const state = createControllableState<DensityToken>(rx, {
    value: options.density,
    defaultValue: options.defaultDensity ?? DEFAULT_DENSITY,
    onChange: options.onDensityChange,
  });

  return {
    density: state.get,
    setDensity: (density) => {
      state.set(density);
    },
    resolveTheme: (baseTheme) => applyDensity(baseTheme, state.get()),
  };
}
