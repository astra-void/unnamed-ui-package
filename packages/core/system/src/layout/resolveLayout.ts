import { resolveLayoutStyleProps, type Theme } from "@lattice-ui/core-style";
import { resolvePadding, resolveSpace } from "./space";
import type { LayoutDirection, StackAlign, StackAutoSize, StackJustify } from "./types";

export interface ResolvedPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ResolvedStackLayout {
  /** Props for the frame the stack renders. */
  frameProps: Record<string, unknown>;
  fillDirection: Enum.FillDirection;
  horizontalAlignment: Enum.HorizontalAlignment;
  verticalAlignment: Enum.VerticalAlignment;
  /** The gap between children, already resolved from a token or a number. */
  gap: number;
  padding: ResolvedPadding;
  /** Whether any padding was asked for, so the adapter can skip the `UIPadding` entirely. */
  hasPadding: boolean;
}

const STACK_OWN_PROPS = [
  "direction",
  "gap",
  "align",
  "justify",
  "autoSize",
  "sx",
  "asChild",
  "padding",
  "paddingX",
  "paddingY",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "children",
] as const;

function toHorizontalAlignment(value: StackAlign | StackJustify) {
  if (value === "center") {
    return Enum.HorizontalAlignment.Center;
  }

  return value === "end" ? Enum.HorizontalAlignment.Right : Enum.HorizontalAlignment.Left;
}

function toVerticalAlignment(value: StackAlign | StackJustify) {
  if (value === "center") {
    return Enum.VerticalAlignment.Center;
  }

  return value === "end" ? Enum.VerticalAlignment.Bottom : Enum.VerticalAlignment.Top;
}

function toAutomaticSize(autoSize: StackAutoSize | undefined, direction: LayoutDirection) {
  if (autoSize === undefined || autoSize === false) {
    return Enum.AutomaticSize.None;
  }

  if (autoSize === true) {
    // Grow along the axis the stack lays out on; the cross axis is the consumer's to size.
    return direction === "vertical" ? Enum.AutomaticSize.Y : Enum.AutomaticSize.X;
  }

  if (autoSize === "x") {
    return Enum.AutomaticSize.X;
  }

  if (autoSize === "y") {
    return Enum.AutomaticSize.Y;
  }

  return autoSize === "xy" ? Enum.AutomaticSize.XY : Enum.AutomaticSize.None;
}

export interface StackLayoutInput {
  direction?: LayoutDirection;
  gap?: unknown;
  align?: StackAlign;
  justify?: StackJustify;
  autoSize?: StackAutoSize;
  sx?: never;
}

/**
 * Everything a stack needs to render, computed from its props and the theme.
 *
 * Alignment is the piece worth naming: along the stack's own axis the caller's `justify` decides,
 * and across it `align` does — so the two swap roles when the direction does.
 */
export function resolveStackLayout(props: object, theme: Theme): ResolvedStackLayout {
  const input = props as {
    direction?: LayoutDirection;
    gap?: never;
    align?: StackAlign;
    justify?: StackJustify;
    autoSize?: StackAutoSize;
    sx?: never;
  };

  const direction = input.direction ?? "vertical";
  const align = input.align ?? "start";
  const justify = input.justify ?? "start";
  const vertical = direction === "vertical";

  const frameProps = resolveLayoutStyleProps(props, {
    ownKeys: STACK_OWN_PROPS,
    base: {
      BackgroundTransparency: 1,
      BorderSizePixel: 0,
      AutomaticSize: toAutomaticSize(input.autoSize, direction),
    },
    sx: input.sx,
    theme,
  });

  const padding = resolvePadding(theme, props as never);

  return {
    frameProps,
    fillDirection: vertical ? Enum.FillDirection.Vertical : Enum.FillDirection.Horizontal,
    horizontalAlignment: vertical ? toHorizontalAlignment(align) : toHorizontalAlignment(justify),
    verticalAlignment: vertical ? toVerticalAlignment(justify) : toVerticalAlignment(align),
    gap: resolveSpace(theme, (props as { gap?: never }).gap ?? (0 as never)),
    padding,
    hasPadding: padding.top > 0 || padding.right > 0 || padding.bottom > 0 || padding.left > 0,
  };
}

export { STACK_OWN_PROPS };
