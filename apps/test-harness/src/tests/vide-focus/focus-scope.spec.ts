import { FocusScope } from "@lattice-ui/vide-focus";
import { Vide } from "@lattice-ui/vide-runtime";
import { findChildOfClass, readProperty } from "../../test-utils/videHarness";

export = () => {
  describe("vide focus scope", () => {
    it("renders a transparent root that fills its parent", () => {
      const [destroy, root] = Vide.root(() => FocusScope({}) as Frame);

      assert(root.IsA("Frame"), "FocusScope should render a Frame by default.");
      assert(readProperty(() => root.BackgroundTransparency) === 1, "The scope's own root paints nothing.");
      assert(readProperty(() => root.Size) === UDim2.fromScale(1, 1), "It fills whatever it is placed in.");

      destroy();
    });

    it("takes over a child instance under asChild instead of wrapping it", () => {
      const [destroy, root] = Vide.root(() => {
        const child = new Instance("Frame");
        child.Name = "OwnRoot";
        return FocusScope({ asChild: true, children: child }) as Frame;
      });

      assert(root.Name === "OwnRoot", "asChild should adopt the consumer's instance as the scope root.");
      assert(findChildOfClass(root, "Frame") === undefined, "…rather than wrapping it in one of its own.");

      destroy();
    });

    it("survives a trapped source changing while the scope is up", () => {
      const trapped = Vide.source(false);
      const [destroy, root] = Vide.root(() => FocusScope({ trapped }) as Frame);

      trapped(true);
      trapped(false);

      // The settings are read tracked so a change re-syncs the scope; `sync` itself is untracked
      // because what the focus manager reads is none of that effect's business. Re-entering it would
      // be an infinite loop, so surviving the round trip is the assertion.
      assert(root.IsA("Frame"), "The scope root should still be there.");
      assert(readProperty(() => root.Size) === UDim2.fromScale(1, 1), "…and still be the scope's own root.");

      destroy();
    });
  });
};
