import { createThemeState, type Theme } from "@lattice-ui/core-style";
import { createStrictContext, React, useLatticeCore } from "@lattice-ui/react-runtime";
import type { ThemeContextValue, ThemeProviderProps } from "./types";

const [ThemeContextProvider, useThemeContext] = createStrictContext<ThemeContextValue>("ThemeProvider");

export function ThemeProvider(props: ThemeProviderProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const state = useLatticeCore((rx) =>
    createThemeState(rx, {
      theme: () => propsRef.current.theme,
      defaultTheme: propsRef.current.defaultTheme,
      onThemeChange: (theme) => propsRef.current.onThemeChange?.(theme),
    }),
  );

  const theme = state.theme();

  const contextValue = React.useMemo(() => ({ theme, setTheme: state.setTheme }), [state, theme]);

  return <ThemeContextProvider value={contextValue}>{props.children}</ThemeContextProvider>;
}

export function useTheme() {
  return useThemeContext();
}

export function useThemeValue<T>(selector: (theme: Theme) => T): T {
  const context = useThemeContext();
  return React.useMemo(() => selector(context.theme), [context.theme, selector]);
}
