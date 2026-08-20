import { ContextMenu } from "@lattice-ui/vide-context-menu";
import { PortalProvider, Vide } from "@lattice-ui/vide-runtime";
import { getLocalPlayerGui } from "../../test-utils/playerGui";
import { readProperty } from "../../test-utils/videHarness";

export = () => {
  describe("vide context menu", () => {
    it("renders a trigger that stays interactive rather than selectable", () => {
      const playerGui = getLocalPlayerGui();

      const [destroy, trigger] = Vide.root(
        () =>
          PortalProvider({
            container: playerGui,
            children: () => ContextMenu.Root({ children: () => ContextMenu.Trigger({}) }),
          }) as TextButton,
      );

      assert(trigger.IsA("TextButton"), "ContextMenu.Trigger should render a TextButton by default.");
      assert(
        readProperty(() => trigger.Active),
        "The trigger has to take a pointer to be right-clicked.",
      );

      destroy();
    });

    it("anchors its content to the pointer instead of to the trigger", () => {
      const playerGui = getLocalPlayerGui();
      const open = Vide.source(false);
      const layerName = "LatticeVideContextMenuLayer";

      const [destroy] = Vide.root(() => {
        PortalProvider({
          container: playerGui,
          children: () =>
            ContextMenu.Root({
              open,
              children: () => [
                ContextMenu.Trigger({}),
                ContextMenu.Portal({
                  children: () => {
                    const content = ContextMenu.Content({}) as ScreenGui;
                    content.Name = layerName;
                    return content;
                  },
                }),
              ],
            }),
        });
      });

      const layer = playerGui.FindFirstChild(layerName) as ScreenGui;
      assert(layer !== undefined, "The menu layer belongs to the player gui.");

      const closed = layer.GetDescendants().size();
      open(true);
      task.wait();

      // The anchor is a one-pixel rectangle at the pointer, so the same popper geometry places it.
      assert(layer.GetDescendants().size() > closed, "Opening should mount the content inside the layer.");

      destroy();
    });
  });
};
