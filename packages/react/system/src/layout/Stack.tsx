import { resolveStackLayout } from "@lattice-ui/core-system";
import { React } from "@lattice-ui/react-runtime";
import { useTheme } from "@lattice-ui/react-style";
import type { StackProps } from "./types";

export function Stack(props: StackProps) {
  if ((props as { asChild?: unknown }).asChild !== undefined) {
    error("[Stack] `asChild` is not supported in M3.");
  }

  const { theme } = useTheme();
  // Alignment, automatic size, gap and padding are all computed from the props and the theme, which
  // is the layout's behavior rather than its appearance.
  const layout = resolveStackLayout(props, theme);

  return (
    <frame {...(layout.frameProps as Record<string, unknown>)}>
      <uilistlayout
        FillDirection={layout.fillDirection}
        HorizontalAlignment={layout.horizontalAlignment}
        Padding={new UDim(0, layout.gap)}
        SortOrder={Enum.SortOrder.LayoutOrder}
        VerticalAlignment={layout.verticalAlignment}
      />
      {layout.hasPadding ? (
        <uipadding
          PaddingBottom={new UDim(0, layout.padding.bottom)}
          PaddingLeft={new UDim(0, layout.padding.left)}
          PaddingRight={new UDim(0, layout.padding.right)}
          PaddingTop={new UDim(0, layout.padding.top)}
        />
      ) : undefined}
      {props.children}
    </frame>
  );
}
