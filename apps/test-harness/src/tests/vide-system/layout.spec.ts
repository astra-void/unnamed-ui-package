// Stack and Grid compute alignment, gap and padding from their props and the theme, which is
// behaviour rather than appearance. What these specs check is that the computation stays live and
// that the merge order Stack promises is the opposite of Box's.

import { defaultDarkTheme, defaultLightTheme } from "@lattice-ui/vide-style";
import { DensityProvider, Grid, Row, Stack } from "@lattice-ui/vide-system";
import { findChildOfClass, mountWithSystem, readProperty } from "../../test-utils/videHarness";

export = () => {
  describe("vide system layout", () => {
    it("keeps the gap bound to the theme's spacing scale", () => {
      const harness = mountWithSystem(() => Stack({ gap: 12 }) as Frame);
      const layout = findChildOfClass(harness.node, "UIListLayout");

      assert(layout !== undefined, "Stack should render a UIListLayout.");
      assert(
        readProperty(() => layout.Padding.Offset) === defaultDarkTheme.space[12],
        "The gap should resolve through the theme's spacing token.",
      );

      harness.setTheme(defaultLightTheme);
      assert(
        readProperty(() => layout.Padding.Offset) === defaultLightTheme.space[12],
        "A re-theme should reach the layout.",
      );

      harness.destroy();
    });

    it("swaps the alignment roles when the direction is horizontal", () => {
      const harness = mountWithSystem(() => ({
        vertical: Stack({ align: "end" }) as Frame,
        horizontal: Row({ align: "end" }) as Frame,
      }));

      const vertical = findChildOfClass(harness.node.vertical, "UIListLayout");
      const horizontal = findChildOfClass(harness.node.horizontal, "UIListLayout");

      assert(vertical !== undefined && horizontal !== undefined, "Both stacks should render a layout.");
      // `align` is the cross axis, which is the horizontal one for a vertical stack and the vertical
      // one for a row.
      assert(
        readProperty(() => vertical.HorizontalAlignment) === Enum.HorizontalAlignment.Right,
        "A vertical stack aligns across the horizontal axis.",
      );
      assert(
        readProperty(() => horizontal.VerticalAlignment) === Enum.VerticalAlignment.Bottom,
        "A row aligns across the vertical axis.",
      );

      harness.destroy();
    });

    it("lets a passthrough prop win over sx on a layout", () => {
      const harness = mountWithSystem(
        () =>
          Stack({
            sx: () => ({ BackgroundTransparency: 0 }),
            BackgroundTransparency: 1,
          }) as Frame,
      );

      // The opposite of Box: a one-off instance prop has to be able to override the layout's own
      // styling, so passthrough is applied last here.
      assert(readProperty(() => harness.node.BackgroundTransparency) === 1, "Passthrough should win over sx on Stack.");

      harness.destroy();
    });

    it("gives the grid a cell size once it has a width to measure", () => {
      const harness = mountWithSystem(() => Grid({ minColumnWidth: 100, cellHeight: 40 }) as Frame);
      harness.node.Size = UDim2.fromOffset(420, 200);
      harness.node.Parent = harness.playerGui;

      task.wait();

      const layout = findChildOfClass(harness.node, "UIGridLayout");
      assert(layout !== undefined, "Grid should render a UIGridLayout.");
      assert(
        readProperty(() => layout.CellSize.X.Offset) > 0,
        "A minColumnWidth is not a column count until the container has a width.",
      );

      harness.destroy();
    });

    it("re-derives the same base theme at a nested density", () => {
      const harness = mountWithSystem(() => ({
        inherited: Stack({ gap: 12 }) as Frame,
        nested: DensityProvider({
          defaultDensity: "compact",
          children: () => Stack({ gap: 12 }) as Frame,
        }) as Frame,
      }));

      const inherited = findChildOfClass(harness.node.inherited, "UIListLayout");
      const nested = findChildOfClass(harness.node.nested, "UIListLayout");

      assert(inherited !== undefined && nested !== undefined, "Both stacks should render a layout.");
      assert(
        readProperty(() => nested.Padding.Offset) < readProperty(() => inherited.Padding.Offset),
        "A nested DensityProvider is a real scope, not an internal of SystemProvider.",
      );

      harness.destroy();
    });
  });
};
