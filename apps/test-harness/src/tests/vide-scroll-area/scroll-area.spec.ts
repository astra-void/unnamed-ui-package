import { Vide } from "@lattice-ui/vide-runtime";
import { ScrollArea, type ScrollAreaType } from "@lattice-ui/vide-scroll-area";
import { getLocalPlayerGui } from "../../test-utils/playerGui";
import { readProperty } from "../../test-utils/videHarness";

function renderScrollArea(scrollType: ScrollAreaType) {
  return Vide.root(() => {
    const rendered: Record<string, GuiObject> = {};

    ScrollArea.Root({
      type: scrollType,
      scrollHideDelayMs: 100,
      children: () => {
        rendered.viewport = ScrollArea.Viewport({}) as ScrollingFrame;
        rendered.scrollbar = ScrollArea.Scrollbar({
          orientation: "vertical",
          children: () => {
            rendered.thumb = ScrollArea.Thumb({ orientation: "vertical" }) as Frame;
            return rendered.thumb;
          },
        }) as Frame;
        return [rendered.viewport, rendered.scrollbar];
      },
    });

    return rendered;
  });
}

export = () => {
  describe("vide scroll area", () => {
    it("hides the engine's own scrollbar so the rendered one is the only one", () => {
      const [destroy, parts] = renderScrollArea("always");
      const viewport = parts.viewport as ScrollingFrame;

      assert(readProperty(() => viewport.ScrollBarThickness) === 0, "The engine's bar is neutralized.");

      destroy();
    });

    it("sizes the thumb from the canvas it is scrolling", () => {
      const [destroy, parts] = renderScrollArea("always");
      const viewport = parts.viewport as ScrollingFrame;
      const thumb = parts.thumb as Frame;

      const screen = new Instance("ScreenGui");
      screen.Parent = getLocalPlayerGui();
      (parts.scrollbar as Frame).Size = UDim2.fromOffset(8, 200);
      (parts.scrollbar as Frame).Parent = screen;
      viewport.Size = UDim2.fromOffset(200, 200);
      viewport.CanvasSize = UDim2.fromOffset(0, 800);
      viewport.Parent = screen;

      task.wait();
      task.wait();

      // A quarter of the canvas is on screen, so the thumb should be a fraction of the track rather
      // than all of it. Geometry computed from state is behaviour, which is why it is the core's.
      assert(readProperty(() => thumb.Size.Y.Scale) < 1, "The thumb is shorter than the track it runs in.");

      screen.Destroy();
      destroy();
    });

    it("starts a scroll-type bar hidden", () => {
      const [destroy, parts] = renderScrollArea("scroll");
      const scrollbar = parts.scrollbar as Frame;

      // `scroll` shows the bar while scrolling and hides it after the idle delay, so nothing is the
      // right thing to see before anything has happened.
      assert(!readProperty(() => scrollbar.Visible), "A scroll-type bar is hidden while idle.");

      destroy();
    });
  });
};
