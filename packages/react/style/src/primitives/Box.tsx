import { resolveStyleProps, type Sx } from "@lattice-ui/core-style";
import { React, Slot } from "@lattice-ui/react-runtime";
import { useTheme } from "../theme/ThemeProvider";

type StyleProps = React.Attributes & Record<string, unknown>;

const OWN_PROPS = ["asChild", "sx", "children"] as const;

export type BoxProps = {
  asChild?: boolean;
  sx?: Sx<StyleProps>;
  children?: React.ReactNode;
} & StyleProps;

export function Box(props: BoxProps) {
  const { theme } = useTheme();
  const mergedProps = resolveStyleProps(props, { ownKeys: OWN_PROPS, base: {}, sx: props.sx, theme });

  if (props.asChild) {
    if (!React.isValidElement(props.children)) {
      error("[Box] `asChild` requires a single child element.");
    }

    return <Slot {...(mergedProps as StyleProps)}>{props.children}</Slot>;
  }

  return React.createElement("frame", mergedProps as never, props.children);
}
