import { createGridLayout, resolveStackLayout } from "@lattice-ui/core-system";
import { bindDerivedProps, createVideReactivity, Vide } from "@lattice-ui/vide-runtime";
import { useTheme } from "@lattice-ui/vide-style";
import type VideTypes from "@rbxts/vide";

type StyleProps = Record<string, unknown>;

export type StackProps = { children?: VideTypes.Node } & StyleProps;
export type RowProps = StackProps;
export type GridProps = { children?: VideTypes.Node } & StyleProps;

export function Stack(props: StackProps) {
  const { theme } = useTheme();

  // Alignment, automatic size, gap and padding are all computed from the props and the theme, which
  // is the layout's behavior rather than its appearance. Resolved on read, so a theme change lands.
  const layout = () => resolveStackLayout(props, theme());
  const frameProps = bindDerivedProps<Frame>(() => layout().frameProps as Record<string, unknown>);

  return (
    <frame {...frameProps}>
      <uilistlayout
        FillDirection={() => layout().fillDirection}
        HorizontalAlignment={() => layout().horizontalAlignment}
        Padding={() => new UDim(0, layout().gap)}
        SortOrder={Enum.SortOrder.LayoutOrder}
        VerticalAlignment={() => layout().verticalAlignment}
      />
      {Vide.show(
        () => layout().hasPadding,
        () => (
          <uipadding
            PaddingBottom={() => new UDim(0, layout().padding.bottom)}
            PaddingLeft={() => new UDim(0, layout().padding.left)}
            PaddingRight={() => new UDim(0, layout().padding.right)}
            PaddingTop={() => new UDim(0, layout().padding.top)}
          />
        ),
      )}
      {props.children}
    </frame>
  );
}

export function Row(props: RowProps) {
  return Stack({ ...props, direction: "horizontal" });
}

export function Grid(props: GridProps) {
  const { theme } = useTheme();
  const rx = createVideReactivity();
  const layout = createGridLayout(rx);
  const resolved = () => layout.resolve(props, theme());
  const frameProps = bindDerivedProps<Frame>(() => resolved().frameProps as Record<string, unknown>);

  return (
    <frame
      {...frameProps}
      action={(instance: Frame) => {
        layout.setFrame(instance);
        // The column count follows the width the grid actually got, so it measures rather than
        // assumes; starting here is the first moment there is anything to measure.
        layout.start(resolved);
      }}
    >
      <uigridlayout
        CellPadding={() => UDim2.fromOffset(resolved().columnGap, resolved().rowGap)}
        CellSize={() => UDim2.fromOffset(layout.cellWidth(), resolved().cellHeight)}
        FillDirectionMaxCells={() => layout.columns()}
        SortOrder={Enum.SortOrder.LayoutOrder}
      />
      {Vide.show(
        () => resolved().hasPadding,
        () => (
          <uipadding
            PaddingBottom={() => new UDim(0, resolved().padding.bottom)}
            PaddingLeft={() => new UDim(0, resolved().padding.left)}
            PaddingRight={() => new UDim(0, resolved().padding.right)}
            PaddingTop={() => new UDim(0, resolved().padding.top)}
          />
        ),
      )}
      {props.children}
    </frame>
  );
}
