import { createGridLayout } from "@lattice-ui/core-system";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { useTheme } from "@lattice-ui/react-style";
import type { GridProps } from "./types";

export function Grid(props: GridProps) {
  const { theme } = useTheme();
  const propsRef = React.useRef(props);
  propsRef.current = props;
  const themeRef = React.useRef(theme);
  themeRef.current = theme;

  const layout = useLatticeCore((rx) => createGridLayout(rx));
  const resolved = layout.resolve(props, theme);

  const setFrameRef = React.useCallback(
    (instance: Instance | undefined) => {
      layout.setFrame(instance?.IsA("Frame") === true ? instance : undefined);
    },
    [layout],
  );

  // The column count follows the width the grid actually got, so it measures rather than assumes.
  React.useEffect(() => {
    layout.start(() => layout.resolve(propsRef.current, themeRef.current));
  }, [layout]);

  return (
    <frame {...(resolved.frameProps as Record<string, unknown>)} ref={setFrameRef}>
      <uigridlayout
        CellPadding={UDim2.fromOffset(resolved.columnGap, resolved.rowGap)}
        CellSize={UDim2.fromOffset(layout.cellWidth(), resolved.cellHeight)}
        FillDirectionMaxCells={layout.columns()}
        SortOrder={Enum.SortOrder.LayoutOrder}
      />
      {resolved.hasPadding ? (
        <uipadding
          PaddingBottom={new UDim(0, resolved.padding.bottom)}
          PaddingLeft={new UDim(0, resolved.padding.left)}
          PaddingRight={new UDim(0, resolved.padding.right)}
          PaddingTop={new UDim(0, resolved.padding.top)}
        />
      ) : undefined}
      {props.children}
    </frame>
  );
}
