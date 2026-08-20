import { resolveStyleProps, type Sx } from "@lattice-ui/core-style";
import { React, Slot } from "@lattice-ui/react-runtime";
import { useTheme } from "../theme/ThemeProvider";

type StyleProps = React.Attributes & Record<string, unknown>;

const OWN_PROPS = ["asChild", "sx", "truncate", "children"] as const;

export type TextProps = {
  asChild?: boolean;
  sx?: Sx<StyleProps>;
  /**
   * Opt-in single-line overflow handling. When `true`, text that does not fit the label's width is
   * clipped with a trailing ellipsis (`TextTruncate.AtEnd`). An explicit `TextTruncate` prop still
   * wins over this shorthand.
   */
  truncate?: boolean;
  children?: React.ReactNode;
} & StyleProps;

export function Text(props: TextProps) {
  const { theme } = useTheme();
  // `truncate` is a shorthand default; explicit props and `sx` still override it.
  const base = props.truncate === true ? { TextTruncate: Enum.TextTruncate.AtEnd } : {};
  const mergedProps = resolveStyleProps(props, { ownKeys: OWN_PROPS, base: base, sx: props.sx, theme });

  if (props.asChild) {
    if (!React.isValidElement(props.children)) {
      error("[Text] `asChild` requires a single child element.");
    }

    return <Slot {...(mergedProps as StyleProps)}>{props.children}</Slot>;
  }

  return React.createElement("textlabel", mergedProps as never, props.children);
}
