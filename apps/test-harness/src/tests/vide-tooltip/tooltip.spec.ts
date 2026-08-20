import { PortalProvider, Vide } from "@lattice-ui/vide-runtime";
import { Tooltip } from "@lattice-ui/vide-tooltip";
import { getLocalPlayerGui } from "../../test-utils/playerGui";
import { readProperty } from "../../test-utils/videHarness";

export = () => {
  describe("vide tooltip", () => {
    it("renders a neutralized trigger that is reached through focus rather than selection", () => {
      const playerGui = getLocalPlayerGui();

      const [destroy, trigger] = Vide.root(
        () =>
          PortalProvider({
            container: playerGui,
            children: () =>
              Tooltip.Provider({
                children: () => Tooltip.Root({ children: () => Tooltip.Trigger({}) }),
              }),
          }) as TextButton,
      );

      assert(trigger.IsA("TextButton"), "Tooltip.Trigger should render a TextButton by default.");
      assert(readProperty(() => trigger.BackgroundTransparency) === 1, "Trigger should neutralize its background.");
      assert(readProperty(() => trigger.Text) === "", 'Trigger should neutralize the default "Button" text.');

      destroy();
    });

    it("keeps a disabled trigger from opening", () => {
      const changes: boolean[] = [];
      const playerGui = getLocalPlayerGui();

      const [destroy, trigger] = Vide.root(
        () =>
          PortalProvider({
            container: playerGui,
            children: () =>
              Tooltip.Provider({
                children: () =>
                  Tooltip.Root({
                    onOpenChange: (open) => changes.push(open),
                    children: () => Tooltip.Trigger({ disabled: true }),
                  }),
              }),
          }) as TextButton,
      );

      assert(!readProperty(() => trigger.Active), "A disabled trigger is not active.");
      assert(changes.size() === 0, "…and reports nothing.");

      destroy();
    });

    it("mounts content only while open", () => {
      const playerGui = getLocalPlayerGui();
      const open = Vide.source(false);
      const layerName = "LatticeVideTooltipLayer";

      const [destroy] = Vide.root(() => {
        PortalProvider({
          container: playerGui,
          children: () =>
            Tooltip.Provider({
              children: () =>
                Tooltip.Root({
                  open,
                  children: () => [
                    Tooltip.Trigger({}),
                    Tooltip.Portal({
                      children: () => {
                        const content = Tooltip.Content({}) as ScreenGui;
                        content.Name = layerName;
                        return content;
                      },
                    }),
                  ],
                }),
            }),
        });
      });

      const layer = playerGui.FindFirstChild(layerName) as ScreenGui;
      assert(layer !== undefined, "The tooltip layer belongs to the player gui.");

      const closed = layer.GetDescendants().size();
      open(true);
      task.wait();

      assert(layer.GetDescendants().size() > closed, "Opening should mount the content inside the layer.");

      destroy();
    });
  });
};
