import { createBaseThemeState } from "@lattice-ui/core-system";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { DensityProvider } from "../density/DensityProvider";
import { SystemBaseThemeContextProvider } from "./baseThemeContext";
import { useSystemThemeContext } from "./systemThemeContext";
import type { SystemProviderProps } from "./types";

export function SystemProvider(props: SystemProviderProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  // SystemProvider owns the base theme; density is applied by the DensityProvider below, which a
  // consumer may also nest to re-derive the same base theme at another density.
  const state = useLatticeCore((rx) =>
    createBaseThemeState(rx, {
      theme: () => propsRef.current.theme,
      defaultTheme: propsRef.current.defaultTheme,
      onThemeChange: (theme) => propsRef.current.onThemeChange?.(theme),
    }),
  );

  const baseTheme = state.baseTheme();

  const baseThemeContextValue = React.useMemo(
    () => ({ baseTheme, setBaseTheme: state.setBaseTheme }),
    [baseTheme, state],
  );

  return (
    <SystemBaseThemeContextProvider value={baseThemeContextValue}>
      <DensityProvider
        defaultDensity={props.defaultDensity}
        density={props.density}
        onDensityChange={props.onDensityChange}
      >
        {props.children}
      </DensityProvider>
    </SystemBaseThemeContextProvider>
  );
}

export function useSystemTheme() {
  return useSystemThemeContext();
}
