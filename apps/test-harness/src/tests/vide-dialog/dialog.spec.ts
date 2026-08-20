import { Dialog } from "@lattice-ui/vide-dialog";
import { PortalProvider, Vide } from "@lattice-ui/vide-runtime";
import { getLocalPlayerGui } from "../../test-utils/playerGui";
import { countDescendantsOfClass, readProperty } from "../../test-utils/videHarness";

function countLayersNamed(parent: Instance, name: string) {
  let total = 0;
  for (const child of parent.GetChildren()) {
    if (child.IsA("ScreenGui") && child.Name === name) {
      total += 1;
    }
  }

  return total;
}

export = () => {
  describe("vide dialog", () => {
    it("renders a neutralized trigger", () => {
      const [destroy, trigger] = Vide.root(() => Dialog.Root({ children: () => Dialog.Trigger({}) }) as TextButton);

      assert(trigger.IsA("TextButton"), "Dialog.Trigger should render a TextButton by default.");
      assert(readProperty(() => trigger.BackgroundTransparency) === 1, "Trigger should neutralize its background.");
      assert(readProperty(() => trigger.Text) === "", 'Trigger should neutralize the default "Button" text.');

      destroy();
    });

    it("portals its content and mounts it only while open", () => {
      const playerGui = getLocalPlayerGui();
      const open = Vide.source(false);
      const layerName = "LatticeVideDialogLayer";

      const [destroy] = Vide.root(() => {
        PortalProvider({
          container: playerGui,
          children: () =>
            Dialog.Root({
              open,
              children: () => [
                Dialog.Trigger({}),
                Dialog.Portal({
                  children: () => {
                    const content = Dialog.Content({}) as ScreenGui;
                    content.Name = layerName;
                    return content;
                  },
                }),
              ],
            }),
        });
      });

      assert(
        countLayersNamed(playerGui, layerName) === 1,
        "The dialog layer belongs to the player gui, not to the caller's tree.",
      );

      const layer = playerGui.FindFirstChild(layerName) as ScreenGui;
      const beforeOpen = countDescendantsOfClass(layer, "Frame");

      open(true);
      task.wait();

      assert(
        countDescendantsOfClass(layer, "Frame") > beforeOpen,
        "Opening the dialog should mount content inside the layer.",
      );

      open(false);
      task.wait();
      destroy();

      assert(countLayersNamed(playerGui, layerName) === 0, "Destroying the scope should destroy the layer.");
    });

    it("does not report an open change just for rendering", () => {
      const changes: boolean[] = [];
      const playerGui = getLocalPlayerGui();

      const [destroy] = Vide.root(() => {
        PortalProvider({
          container: playerGui,
          children: () =>
            Dialog.Root({
              defaultOpen: true,
              onOpenChange: (nextOpen) => changes.push(nextOpen),
              children: () => [
                Dialog.Trigger({}),
                Dialog.Portal({ children: () => Dialog.Content({ children: () => Dialog.Close({}) }) }),
              ],
            }),
        });
      });

      task.wait();
      assert(changes.size() === 0, "Rendering is not a state change.");

      destroy();
    });
  });
};
