import { Avatar } from "@lattice-ui/vide-avatar";
import { Vide } from "@lattice-ui/vide-runtime";
import { readProperty } from "../../test-utils/videHarness";

// Both parts stay mounted; which one shows is driven by the load status, so these assertions are
// about `Visible` rather than about what exists.

export = () => {
  describe("vide avatar", () => {
    it("holds the fallback back until the delay has passed", () => {
      const [destroy, parts] = Vide.root(() => {
        const rendered: Record<string, GuiObject> = {};

        Avatar.Root({
          src: "rbxassetid://1",
          delayMs: 200,
          children: () => {
            rendered.image = Avatar.Image({}) as ImageLabel;
            rendered.fallback = Avatar.Fallback({}) as TextLabel;
            return [rendered.image, rendered.fallback];
          },
        });

        return rendered;
      });

      // A short delay is what keeps a fast-loading image from flashing its initials first.
      assert(!readProperty(() => parts.fallback.Visible), "The fallback waits before it appears.");

      task.wait(0.4);

      assert(
        readProperty(() => parts.fallback.Visible),
        "Once the delay has passed the fallback shows.",
      );

      destroy();
    });

    it("shows the fallback straight away when there is no image to wait for", () => {
      const [destroy, parts] = Vide.root(() => {
        const rendered: Record<string, GuiObject> = {};

        Avatar.Root({
          children: () => {
            rendered.image = Avatar.Image({}) as ImageLabel;
            rendered.fallback = Avatar.Fallback({}) as TextLabel;
            return [rendered.image, rendered.fallback];
          },
        });

        return rendered;
      });

      assert(
        readProperty(() => parts.fallback.Visible),
        "With no src there is nothing to wait for.",
      );
      assert(!readProperty(() => parts.image.Visible), "…and nothing to show in the image either.");

      destroy();
    });
  });
};
