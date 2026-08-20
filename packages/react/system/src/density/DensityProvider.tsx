import { createDensityState } from "@lattice-ui/core-system";
import { createStrictContext, React, useLatticeCore } from "@lattice-ui/react-runtime";
import { ThemeProvider } from "@lattice-ui/react-style";
import { useSystemBaseThemeContext } from "../system/baseThemeContext";
import { SystemThemeContextProvider } from "../system/systemThemeContext";
import type { SystemThemeContextValue } from "../system/types";
import type { DensityContextValue, DensityProviderProps } from "./types";

const [DensityContextProvider, useDensityContext] = createStrictContext<DensityContextValue>("DensityProvider");

export function DensityProvider(props: DensityProviderProps) {
  const { baseTheme, setBaseTheme } = useSystemBaseThemeContext();
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const state = useLatticeCore((rx) =>
    createDensityState(rx, {
      density: () => propsRef.current.density,
      defaultDensity: propsRef.current.defaultDensity,
      onDensityChange: (density) => propsRef.current.onDensityChange?.(density),
    }),
  );

  const density = state.density();
  // Read-path contract: the resolved theme is derived from the base theme and this scope's density.
  const resolvedTheme = state.resolveTheme(baseTheme);

  const densityContextValue = React.useMemo<DensityContextValue>(
    () => ({ density, setDensity: state.setDensity }),
    [density, state],
  );

  const systemThemeContextValue = React.useMemo<SystemThemeContextValue>(
    () => ({
      theme: resolvedTheme,
      baseTheme,
      density,
      setBaseTheme,
      setDensity: state.setDensity,
    }),
    [baseTheme, density, resolvedTheme, setBaseTheme, state],
  );

  return (
    <DensityContextProvider value={densityContextValue}>
      <SystemThemeContextProvider value={systemThemeContextValue}>
        <ThemeProvider theme={resolvedTheme}>{props.children}</ThemeProvider>
      </SystemThemeContextProvider>
    </DensityContextProvider>
  );
}

export function useDensity() {
  return useDensityContext();
}
