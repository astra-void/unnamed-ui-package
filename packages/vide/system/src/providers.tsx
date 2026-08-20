import { createBaseThemeState, createDensityState, type DensityToken } from "@lattice-ui/core-system";
import { createVideReactivity, type Derivable, Vide } from "@lattice-ui/vide-runtime";
import { type Theme, ThemeProvider } from "@lattice-ui/vide-style";
import type VideTypes from "@rbxts/vide";

export interface SystemThemeContextValue {
  /** Getters, so a theme or density change reaches readers without the tree running again. */
  theme: () => Theme;
  baseTheme: () => Theme;
  density: () => DensityToken;
  setBaseTheme: (theme: Theme) => void;
  setDensity: (density: DensityToken) => void;
}

interface BaseThemeContextValue {
  baseTheme: () => Theme;
  setBaseTheme: (theme: Theme) => void;
}

export const SystemBaseThemeContext = Vide.context<BaseThemeContextValue>();
export const SystemThemeContext = Vide.context<SystemThemeContextValue>();
export const DensityContext = Vide.context<{ density: () => DensityToken; setDensity: (d: DensityToken) => void }>();

export type SystemProviderProps = {
  theme?: Derivable<Theme | undefined>;
  defaultTheme?: Theme;
  onThemeChange?: (theme: Theme) => void;
  density?: Derivable<DensityToken | undefined>;
  defaultDensity?: DensityToken;
  onDensityChange?: (density: DensityToken) => void;
  children: () => VideTypes.Node;
};

export type DensityProviderProps = {
  density?: Derivable<DensityToken | undefined>;
  defaultDensity?: DensityToken;
  onDensityChange?: (density: DensityToken) => void;
  children: () => VideTypes.Node;
};

export function SystemProvider(props: SystemProviderProps) {
  // SystemProvider owns the base theme; density is applied by the DensityProvider below, which a
  // consumer may also nest to re-derive the same base theme at another density.
  const state = createBaseThemeState(createVideReactivity(), {
    theme: props.theme,
    defaultTheme: props.defaultTheme,
    onThemeChange: props.onThemeChange,
  });

  return SystemBaseThemeContext({ baseTheme: state.baseTheme, setBaseTheme: state.setBaseTheme }, () =>
    DensityProvider({
      density: props.density,
      defaultDensity: props.defaultDensity,
      onDensityChange: props.onDensityChange,
      children: props.children,
    }),
  );
}

export function DensityProvider(props: DensityProviderProps) {
  const base = SystemBaseThemeContext() as BaseThemeContextValue | undefined;

  if (base === undefined) {
    error("[DensityProvider] context is undefined. Render this inside <SystemProvider>.");
  }

  const state = createDensityState(createVideReactivity(), {
    density: props.density,
    defaultDensity: props.defaultDensity,
    onDensityChange: props.onDensityChange,
  });

  // Read-path contract: the resolved theme is derived from the base theme and this scope's density.
  const resolvedTheme = () => state.resolveTheme(base.baseTheme());

  return DensityContext({ density: state.density, setDensity: state.setDensity }, () =>
    SystemThemeContext(
      {
        theme: resolvedTheme,
        baseTheme: base.baseTheme,
        density: state.density,
        setBaseTheme: base.setBaseTheme,
        setDensity: state.setDensity,
      },
      () => ThemeProvider({ theme: resolvedTheme, children: props.children }),
    ),
  );
}

export function useSystemTheme(): SystemThemeContextValue {
  const context = SystemThemeContext() as SystemThemeContextValue | undefined;

  if (context === undefined) {
    error("[SystemProvider] context is undefined. Render this inside <SystemProvider>.");
  }

  return context;
}

export function useDensity() {
  const context = DensityContext() as
    | { density: () => DensityToken; setDensity: (d: DensityToken) => void }
    | undefined;

  if (context === undefined) {
    error("[DensityProvider] context is undefined. Render this inside <SystemProvider>.");
  }

  return context;
}
