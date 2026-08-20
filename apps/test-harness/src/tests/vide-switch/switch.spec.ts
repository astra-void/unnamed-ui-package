import { Vide } from "@lattice-ui/vide-runtime";
import { Switch } from "@lattice-ui/vide-switch";
import { findChildOfClass, readProperty } from "../../test-utils/videHarness";

export = () => {
  describe("vide switch", () => {
    it("renders a neutralized textbutton", () => {
      const [destroy, root] = Vide.root(() => Switch.Root({}) as TextButton);

      assert(root.IsA("TextButton"), "Switch.Root should render a TextButton by default.");
      assert(readProperty(() => root.BackgroundTransparency) === 1, "Root should neutralize its background.");
      assert(readProperty(() => root.Text) === "", 'Root should neutralize the default "Button" text.');
      assert(readProperty(() => root.AutoButtonColor) === false, "Root should neutralize AutoButtonColor.");

      destroy();
    });

    it("follows a disabled source", () => {
      const disabled = Vide.source(false);
      const [destroy, root] = Vide.root(() => Switch.Root({ disabled }) as TextButton);

      assert(
        readProperty(() => root.Active),
        "An enabled switch is active.",
      );

      disabled(true);
      assert(!readProperty(() => root.Active), "Disabling should clear Active.");
      assert(!readProperty(() => root.Selectable), "Disabling should clear Selectable.");

      disabled(false);
      assert(
        readProperty(() => root.Active),
        "Re-enabling should restore Active.",
      );

      destroy();
    });

    it("keeps the thumb mounted in both states", () => {
      const checked = Vide.source(false);
      const [destroy, root] = Vide.root(() => Switch.Root({ checked, children: () => Switch.Thumb({}) }) as TextButton);

      // The thumb is not presence-driven: a switch's travel is the consumer's geometry, and the
      // thumb has to exist in both states for it to travel at all.
      assert(findChildOfClass(root, "Frame") !== undefined, "The thumb should mount while unchecked.");

      checked(true);
      assert(findChildOfClass(root, "Frame") !== undefined, "The thumb should stay mounted while checked.");

      destroy();
    });
  });
};
