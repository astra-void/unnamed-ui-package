import type { ScrollAreaOrientation, ScrollAreaType } from "@lattice-ui/core-scroll-area";
import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type { ScrollAreaOrientation, ScrollAreaType };

export type ScrollAreaProps = {
  type?: Derivable<ScrollAreaType | undefined>;
  scrollHideDelayMs?: Derivable<number | undefined>;
  /** Written as a function, so the parts read the scroll context after Root provides it. */
  children?: Vide.Node;
};

export type ScrollAreaViewportProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<ScrollingFrame>;

export type ScrollAreaScrollbarProps = {
  orientation: ScrollAreaOrientation;
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type ScrollAreaThumbProps = {
  orientation: ScrollAreaOrientation;
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type ScrollAreaCornerProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;
