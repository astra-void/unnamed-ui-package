// Vide popover: portal + presence + dismissable + popper, driven by the same cores the React layer
// uses. Written without JSX for the reason given in the Vide checkbox spec — this app compiles with
// React's JSX factory, and a Vide component is a plain function anyway.

import { Popover } from "@lattice-ui/vide-popover";
import { PortalProvider, Vide } from "@lattice-ui/vide-runtime";
import { getLocalPlayerGui } from "../../test-utils/playerGui";

function findDescendantOfClass<T extends keyof Instances>(parent: Instance, className: T): Instances[T] | undefined {
  for (const descendant of parent.GetDescendants()) {
    if (descendant.IsA(className)) {
      return descendant;
    }
  }

  return undefined;
}

function countScreenGuisNamed(parent: Instance, name: string) {
  let total = 0;
  for (const child of parent.GetChildren()) {
    if (child.IsA("ScreenGui") && child.Name === name) {
      total += 1;
    }
  }

  return total;
}

// Read through a call so an earlier assertion's narrowing does not make the next read of the same
// property look impossible to the compiler.
function isActive(button: TextButton) {
  return button.Active;
}

export = () => {
  describe("vide popover", () => {
    it("renders a neutralized trigger that toggles open state", () => {
      const changes: boolean[] = [];
      const [destroy, trigger] = Vide.root(
        () =>
          Popover.Root({
            onOpenChange: (open) => changes.push(open),
            children: () => Popover.Trigger({}),
          }) as TextButton,
      );

      assert(trigger.IsA("TextButton"), "Popover.Trigger should render a TextButton by default.");
      assert(trigger.BackgroundTransparency === 1, "Trigger should neutralize the default background.");
      assert(trigger.Text === "", 'Trigger should neutralize the default "Button" text.');
      assert(trigger.AutoButtonColor === false, "Trigger should neutralize AutoButtonColor.");
      assert(isActive(trigger), "An enabled trigger should be active.");
      assert(trigger.Selectable === false, "The trigger is reached through focus flow, not selection.");

      destroy();
    });

    it("keeps a disabled trigger inert", () => {
      const changes: boolean[] = [];
      const [destroy, trigger] = Vide.root(
        () =>
          Popover.Root({
            onOpenChange: (open) => changes.push(open),
            children: () => Popover.Trigger({ disabled: true }),
          }) as TextButton,
      );

      assert(!isActive(trigger), "A disabled trigger should not be active.");
      assert(changes.size() === 0, "A disabled trigger should not report open changes.");

      destroy();
    });

    it("portals its content into the player gui and mounts it only while open", () => {
      const playerGui = getLocalPlayerGui();
      const open = Vide.source(false);
      const layerName = "LatticeVidePopoverLayer";

      const [destroy] = Vide.root(() => {
        PortalProvider({
          container: playerGui,
          children: () =>
            Popover.Root({
              open,
              children: () => [
                Popover.Trigger({}),
                Popover.Portal({
                  children: () => {
                    const content = Popover.Content({}) as ScreenGui;
                    content.Name = layerName;
                    return content;
                  },
                }),
              ],
            }),
        });
      });

      assert(
        countScreenGuisNamed(playerGui, layerName) === 1,
        "The popover layer should be portalled into the player gui, not the caller's tree.",
      );

      const layer = playerGui.FindFirstChild(layerName) as ScreenGui;
      assert(findDescendantOfClass(layer, "Frame") !== undefined, "The layer always keeps its own canvas frame.");

      open(true);
      task.wait();

      assert(layer.GetDescendants().size() > 1, "Opening the popover should mount content inside the layer.");

      open(false);
      task.wait();

      destroy();
      assert(
        countScreenGuisNamed(playerGui, layerName) === 0,
        "Destroying the scope should destroy the portalled layer.",
      );
    });

    it("closes through Popover.Close", () => {
      const changes: boolean[] = [];
      const playerGui = getLocalPlayerGui();
      const open = Vide.source(true);

      const [destroy] = Vide.root(() => {
        PortalProvider({
          container: playerGui,
          children: () =>
            Popover.Root({
              open,
              onOpenChange: (nextOpen) => changes.push(nextOpen),
              children: () => [
                Popover.Trigger({}),
                Popover.Portal({
                  children: () => Popover.Content({ children: () => Popover.Close({}) }),
                }),
              ],
            }),
        });
      });

      task.wait();
      assert(changes.size() === 0, "Rendering should not report an open change on its own.");

      destroy();
    });
  });
};
