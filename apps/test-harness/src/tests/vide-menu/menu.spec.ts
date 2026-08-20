import { Menu } from "@lattice-ui/vide-menu";
import { PortalProvider, Vide } from "@lattice-ui/vide-runtime";
import { getLocalPlayerGui } from "../../test-utils/playerGui";
import { readProperty } from "../../test-utils/videHarness";

export = () => {
  describe("vide menu", () => {
    it("keeps a disabled item out of the pointer and focus flow", () => {
      const playerGui = getLocalPlayerGui();

      const [destroy, items] = Vide.root(() => {
        const rendered: Record<string, TextButton> = {};

        PortalProvider({
          container: playerGui,
          children: () =>
            Menu.Root({
              defaultOpen: true,
              children: () => [
                Menu.Trigger({}),
                Menu.Portal({
                  children: () =>
                    Menu.Content({
                      children: () => {
                        rendered.rename = Menu.Item({}) as TextButton;
                        rendered.exported = Menu.Item({ disabled: true }) as TextButton;
                        return [rendered.rename, rendered.exported];
                      },
                    }),
                }),
              ],
            }),
        });

        return rendered;
      });

      task.wait();

      assert(
        readProperty(() => items.rename.Active),
        "An enabled item is active.",
      );
      assert(!readProperty(() => items.exported.Active), "A disabled item is not.");
      assert(!readProperty(() => items.exported.Selectable), "…and is not reachable by selection.");

      destroy();
    });

    it("does not select an item just by rendering it", () => {
      const selected: string[] = [];
      const playerGui = getLocalPlayerGui();

      const [destroy] = Vide.root(() => {
        PortalProvider({
          container: playerGui,
          children: () =>
            Menu.Root({
              defaultOpen: true,
              children: () => [
                Menu.Trigger({}),
                Menu.Portal({
                  children: () =>
                    Menu.Content({
                      children: () => Menu.Item({ onSelect: () => selected.push("rename") }),
                    }),
                }),
              ],
            }),
        });
      });

      task.wait();
      assert(selected.size() === 0, "Rendering an item is not selecting it.");

      destroy();
    });
  });
};
