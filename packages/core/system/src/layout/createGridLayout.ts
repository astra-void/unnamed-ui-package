import { type Reactivity, resolveLayoutStyleProps, type Theme } from "@lattice-ui/core-style";
import { resolveGridCellWidth, resolveGridColumns } from "./gridMath";
import type { ResolvedPadding } from "./resolveLayout";
import { resolvePadding, resolveSpace } from "./space";
import type { StackAutoSize } from "./types";

const GRID_OWN_PROPS = [
  "columns",
  "minColumnWidth",
  "cellHeight",
  "gap",
  "rowGap",
  "columnGap",
  "autoSize",
  "sx",
  "padding",
  "paddingX",
  "paddingY",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "children",
] as const;

export interface ResolvedGridStatic {
  frameProps: Record<string, unknown>;
  rowGap: number;
  columnGap: number;
  minColumnWidth: number | undefined;
  cellHeight: number;
  padding: ResolvedPadding;
  hasPadding: boolean;
  /** A fixed column count, when the caller asked for one instead of a minimum width. */
  columns: number | undefined;
}

export interface GridLayoutCore {
  /** The parts that depend only on props and theme, recomputed on read. */
  resolve: (props: object, theme: Theme) => ResolvedGridStatic;
  /** How many columns fit the measured width. */
  columns: () => number;
  /** How wide each column is once the gaps are taken out. */
  cellWidth: () => number;
  setFrame: (instance: Frame | undefined) => void;
  /** Begins measuring. Idempotent; disconnects through the reactivity's cleanup. */
  start: (getStatic: () => ResolvedGridStatic) => void;
}

function toAutomaticSize(autoSize: StackAutoSize | undefined) {
  if (autoSize === true || autoSize === "y") {
    return Enum.AutomaticSize.Y;
  }

  if (autoSize === "x") {
    return Enum.AutomaticSize.X;
  }

  return autoSize === "xy" ? Enum.AutomaticSize.XY : Enum.AutomaticSize.None;
}

/**
 * A responsive grid: the column count follows the width the grid actually got.
 *
 * The measurement lives here rather than in a component because it is the grid's behavior — with a
 * `minColumnWidth` the answer is not knowable until the container has a size.
 */
export function createGridLayout(rx: Reactivity): GridLayoutCore {
  const columnsSource = rx.source(1);
  const cellWidthSource = rx.source(1);

  let frame: Frame | undefined;
  let connection: RBXScriptConnection | undefined;
  let started = false;

  function update(getStatic: () => ResolvedGridStatic) {
    const target = frame;
    if (target === undefined) {
      return;
    }

    const resolved = getStatic();
    const containerWidth = target.AbsoluteSize.X - resolved.padding.left - resolved.padding.right;
    const nextColumns = resolveGridColumns(containerWidth, {
      columns: resolved.columns,
      minColumnWidth: resolved.minColumnWidth,
      columnGap: resolved.columnGap,
    });

    if (columnsSource.get() !== nextColumns) {
      columnsSource.set(nextColumns);
    }

    const nextCellWidth = resolveGridCellWidth(containerWidth, nextColumns, resolved.columnGap);
    if (cellWidthSource.get() !== nextCellWidth) {
      cellWidthSource.set(nextCellWidth);
    }
  }

  return {
    resolve: (props, theme) => {
      const input = props as {
        columns?: number;
        minColumnWidth?: never;
        cellHeight?: never;
        gap?: never;
        rowGap?: never;
        columnGap?: never;
        autoSize?: StackAutoSize;
        sx?: never;
      };

      const gap = input.gap ?? (0 as never);
      const padding = resolvePadding(theme, props as never);

      return {
        frameProps: resolveLayoutStyleProps(props, {
          ownKeys: GRID_OWN_PROPS,
          base: {
            BackgroundTransparency: 1,
            BorderSizePixel: 0,
            AutomaticSize: toAutomaticSize(input.autoSize),
          },
          sx: input.sx,
          theme,
        }),
        rowGap: resolveSpace(theme, input.rowGap ?? gap),
        columnGap: resolveSpace(theme, input.columnGap ?? gap),
        minColumnWidth: input.minColumnWidth !== undefined ? resolveSpace(theme, input.minColumnWidth) : undefined,
        cellHeight: resolveSpace(theme, input.cellHeight ?? (0 as never)),
        padding,
        hasPadding: padding.top > 0 || padding.right > 0 || padding.bottom > 0 || padding.left > 0,
        columns: input.columns,
      };
    },
    columns: () => columnsSource.get(),
    cellWidth: () => cellWidthSource.get(),
    setFrame: (instance) => {
      frame = instance;
    },
    start: (getStatic) => {
      if (started) {
        return;
      }

      started = true;
      update(getStatic);

      const target = frame;
      if (target === undefined) {
        started = false;
        return;
      }

      connection = target.GetPropertyChangedSignal("AbsoluteSize").Connect(() => update(getStatic));

      rx.cleanup(() => {
        connection?.Disconnect();
        connection = undefined;
        started = false;
      });
    },
  };
}
