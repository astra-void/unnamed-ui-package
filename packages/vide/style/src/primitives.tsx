import { resolveStyleProps, type Sx } from "@lattice-ui/core-style";
import { applySlotProps, bindDerivedProps, resolveSlotInstance, Vide } from "@lattice-ui/vide-runtime";
import type VideTypes from "@rbxts/vide";
import { useTheme } from "./theme";

type StyleProps = Record<string, unknown>;

export type BoxProps = {
  asChild?: boolean;
  sx?: Sx<StyleProps>;
  children?: VideTypes.Node;
} & StyleProps;

export type TextProps = {
  asChild?: boolean;
  sx?: Sx<StyleProps>;
  /**
   * Opt-in single-line overflow handling. When `true`, text that does not fit the label's width is
   * clipped with a trailing ellipsis (`TextTruncate.AtEnd`). An explicit `TextTruncate` prop still
   * wins over this shorthand.
   */
  truncate?: boolean;
  children?: VideTypes.Node;
} & StyleProps;

const BOX_OWN_PROPS = ["asChild", "sx", "children"] as const;
const TEXT_OWN_PROPS = ["asChild", "sx", "truncate", "children"] as const;

export function Box(props: BoxProps) {
  const { theme } = useTheme();
  // Bound rather than spread, so a theme change re-resolves `sx` without the component running again.
  const merged = bindDerivedProps<Frame>(() =>
    resolveStyleProps(props, { ownKeys: BOX_OWN_PROPS, sx: props.sx, theme: theme() }),
  );

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[Box] `asChild` requires a single child instance.");
    }

    return applySlotProps(child as GuiObject, merged as never);
  }

  return <frame {...merged}>{props.children}</frame>;
}

export function Text(props: TextProps) {
  const { theme } = useTheme();
  const base = props.truncate === true ? { TextTruncate: Enum.TextTruncate.AtEnd } : {};
  const merged = bindDerivedProps<TextLabel>(() =>
    resolveStyleProps(props, { ownKeys: TEXT_OWN_PROPS, base, sx: props.sx, theme: theme() }),
  );

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[Text] `asChild` requires a single child instance.");
    }

    return applySlotProps(child as GuiObject, merged as never);
  }

  return <textlabel {...merged}>{props.children}</textlabel>;
}
