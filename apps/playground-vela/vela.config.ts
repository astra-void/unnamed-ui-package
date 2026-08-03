import { defineConfig } from "vela-rbxts";

// The Lattice dark theme, restated as vela theme tokens.
//
// `@lattice-ui/react-style` resolves these through `useTheme()` at render time,
// so the sibling playground can swap light/dark from a header button. vela has
// no `dark:` variant and resolves `className` at compile time, so a config is a
// single theme: this app compiles against dark and drops the toggle. The light
// values still live in `defaultLightTheme` — what is missing is a way to select
// between them from a class string, not the tokens themselves.
//
// Names are chosen so every reference stays a single unambiguous family:
// `bg-surface` / `bg-surface-100`, `text-ink` / `text-ink-400`,
// `bg-accent` / `text-accent-50`.
export default defineConfig({
  theme: {
    extend: {
      colors: {
        // theme.colors.background
        canvas: "Color3.fromRGB(18, 21, 26)",
        surface: {
          // theme.colors.surface
          DEFAULT: "Color3.fromRGB(32, 37, 46)",
          // theme.colors.surfaceElevated
          100: "Color3.fromRGB(40, 47, 60)",
        },
        // theme.colors.border — `border` is a utility prefix, so the family is `edge`.
        edge: "Color3.fromRGB(72, 80, 98)",
        ink: {
          // theme.colors.textPrimary
          DEFAULT: "Color3.fromRGB(233, 239, 246)",
          // theme.colors.textSecondary
          400: "Color3.fromRGB(176, 186, 201)",
        },
        accent: {
          DEFAULT: "Color3.fromRGB(43, 105, 196)",
          // theme.colors.accentContrast
          50: "Color3.fromRGB(240, 244, 250)",
        },
        danger: {
          DEFAULT: "Color3.fromRGB(129, 57, 63)",
          // theme.colors.dangerContrast
          50: "Color3.fromRGB(245, 223, 226)",
        },
        overlay: "Color3.fromRGB(8, 10, 14)",
      },
      // vela ships its own radius scale; these four keys are re-pointed at the
      // Lattice values so `rounded-md`/`rounded-lg` mean the same pixels in both
      // playgrounds. `full` becomes a true pill to match the scenes, which write
      // `new UDim(1, 0)` rather than the theme's 999px.
      radius: {
        md: "new UDim(0, 8)",
        lg: "new UDim(0, 12)",
        xl: "new UDim(0, 16)",
        full: "new UDim(1, 0)",
      },
      // `theme.space` needs no restating: vela's numeric spacing fallback is
      // `key * 4` pixels, so every Lattice step is a half-step key —
      // space[6] is `1.5`, space[10] is `2.5`, space[16] is `4`.
    },
  },
});
