import type { Theme, ThemeContextValue } from "@lattice-ui/core-style";
import type React from "@rbxts/react";

export type {
  PartialTheme,
  Theme,
  ThemeColors,
  ThemeContextValue,
  ThemeRadius,
  ThemeSpace,
  ThemeTypography,
  ThemeTypographyStyle,
} from "@lattice-ui/core-style";

export type ThemeProviderProps = {
  theme?: Theme;
  defaultTheme?: Theme;
  onThemeChange?: ThemeContextValue["setTheme"];
  children?: React.ReactNode;
};
