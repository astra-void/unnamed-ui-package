import { createThemeState, type Theme } from "@lattice-ui/core-style";
import { createVideReactivity, type Derivable, Vide } from "@lattice-ui/vide-runtime";
import type VideTypes from "@rbxts/vide";

export interface VideThemeContextValue {
  /** A getter, so a theme change reaches every reader without re-rendering the tree. */
  theme: () => Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = Vide.context<VideThemeContextValue>();

export type ThemeProviderProps = {
  theme?: Derivable<Theme | undefined>;
  defaultTheme?: Theme;
  onThemeChange?: (theme: Theme) => void;
  children: () => VideTypes.Node;
};

export function ThemeProvider(props: ThemeProviderProps) {
  const state = createThemeState(createVideReactivity(), {
    theme: props.theme,
    defaultTheme: props.defaultTheme,
    onThemeChange: props.onThemeChange,
  });

  return ThemeContext({ theme: state.theme, setTheme: state.setTheme }, props.children);
}

/** Read at the top level of a component, as always in Vide. */
export function useTheme(): VideThemeContextValue {
  const context = ThemeContext() as VideThemeContextValue | undefined;

  if (context === undefined) {
    error("[ThemeProvider] context is undefined. Render this inside <ThemeProvider>.");
  }

  return context;
}
