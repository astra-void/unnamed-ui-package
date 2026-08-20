import { ScrollAreaCorner } from "./ScrollArea/ScrollAreaCorner";
import { ScrollAreaRoot } from "./ScrollArea/ScrollAreaRoot";
import { ScrollAreaScrollbar } from "./ScrollArea/ScrollAreaScrollbar";
import { ScrollAreaThumb } from "./ScrollArea/ScrollAreaThumb";
import { ScrollAreaViewport } from "./ScrollArea/ScrollAreaViewport";

export const ScrollArea = {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Scrollbar: ScrollAreaScrollbar,
  Thumb: ScrollAreaThumb,
  Corner: ScrollAreaCorner,
} as const satisfies {
  Root: typeof ScrollAreaRoot;
  Viewport: typeof ScrollAreaViewport;
  Scrollbar: typeof ScrollAreaScrollbar;
  Thumb: typeof ScrollAreaThumb;
  Corner: typeof ScrollAreaCorner;
};

export { useScrollAreaContext } from "./ScrollArea/context";
export type {
  ScrollAreaCornerProps,
  ScrollAreaOrientation,
  ScrollAreaProps,
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
  ScrollAreaType,
  ScrollAreaViewportProps,
} from "./ScrollArea/types";
export { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport };
