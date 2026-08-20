import type {
  LayoutDirection,
  SpaceValue,
  StackAlign,
  StackAutoSize,
  StackJustify,
  StackPadding,
} from "@lattice-ui/core-system";
import type { Sx } from "@lattice-ui/react-style";
import type React from "@rbxts/react";

// The vocabulary is the core's; only the React-shaped props are declared here.
export type {
  LayoutDirection,
  SpaceToken,
  SpaceValue,
  StackAlign,
  StackAutoSize,
  StackJustify,
  StackPadding,
} from "@lattice-ui/core-system";

type StyleProps = React.Attributes & Record<string, unknown>;

export type StackProps = {
  direction?: LayoutDirection;
  gap?: SpaceValue;
  align?: StackAlign;
  justify?: StackJustify;
  autoSize?: StackAutoSize;
  sx?: Sx<StyleProps>;
  children?: React.ReactNode;
} & StackPadding &
  StyleProps;

export type RowProps = Omit<StackProps, "direction">;

export type GridProps = {
  columns?: number;
  minColumnWidth?: SpaceValue;
  cellHeight?: SpaceValue;
  gap?: SpaceValue;
  rowGap?: SpaceValue;
  columnGap?: SpaceValue;
  autoSize?: StackAutoSize;
  sx?: Sx<StyleProps>;
  children?: React.ReactNode;
} & StackPadding &
  StyleProps;
