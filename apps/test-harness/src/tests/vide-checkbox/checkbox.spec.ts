// The Vide layer cannot be exercised from the vitest harness — Vide is Luau-only — and it cannot be
// written in JSX here either, because one tsconfig carries one JSX factory and this app compiles
// with React's. Components are therefore called as the plain functions they are, which is all a
// Vide component ever is.

import { Checkbox } from "@lattice-ui/vide-checkbox";
// Vide comes through the layer's runtime rather than from `@rbxts/vide` directly: an app that
// imports the scope itself has to carry the hoisted-link workaround, and re-exporting it is exactly
// what `vide-runtime` is for.
import { Vide } from "@lattice-ui/vide-runtime";
import { findChildOfClass, readProperty } from "../../test-utils/videHarness";

export = () => {
  describe("vide checkbox", () => {
    it("renders a neutralized textbutton with no appearance of its own", () => {
      const [destroy, root] = Vide.root(() => Checkbox.Root({}) as TextButton);

      assert(root.IsA("TextButton"), "Checkbox.Root should render a TextButton by default.");
      assert(root.BackgroundTransparency === 1, "Root should neutralize the default background.");
      assert(root.BorderSizePixel === 0, "Root should neutralize the default border.");
      assert(root.Text === "", 'Root should neutralize the default "Button" text.');
      assert(root.AutoButtonColor === false, "Root should neutralize AutoButtonColor.");
      assert(
        readProperty(() => root.Active),
        "An enabled checkbox should be active.",
      );
      assert(
        readProperty(() => root.Selectable),
        "An enabled checkbox should be selectable.",
      );

      destroy();
    });

    it("binds Active and Selectable to a disabled source", () => {
      const disabled = Vide.source(false);
      const [destroy, root] = Vide.root(() => Checkbox.Root({ disabled }) as TextButton);

      assert(
        readProperty(() => root.Active),
        "Checkbox should start active.",
      );

      disabled(true);
      assert(!readProperty(() => root.Active), "Disabling the checkbox should clear Active.");
      assert(!readProperty(() => root.Selectable), "Disabling the checkbox should clear Selectable.");

      disabled(false);
      assert(
        readProperty(() => root.Active),
        "Re-enabling the checkbox should restore Active.",
      );

      destroy();
    });

    it("lets a consumer prop override a neutral default", () => {
      const [destroy, root] = Vide.root(() => Checkbox.Root({ BackgroundTransparency: 0 }) as TextButton);

      assert(root.BackgroundTransparency === 0, "Consumer props should win over neutral defaults.");

      destroy();
    });

    it("mounts the indicator only while the box is checked", () => {
      const checked = Vide.source<boolean>(false);
      const [destroy, root] = Vide.root(
        () =>
          Checkbox.Root({
            checked,
            children: () => Checkbox.Indicator({}),
          }) as TextButton,
      );

      assert(findChildOfClass(root, "Frame") === undefined, "Indicator should not mount while unchecked.");

      checked(true);
      assert(findChildOfClass(root, "Frame") !== undefined, "Indicator should mount once checked.");

      checked(false);
      assert(findChildOfClass(root, "Frame") === undefined, "Indicator should unmount once cleared.");

      destroy();
    });

    it("keeps a forceMounted indicator mounted and drives Visible instead", () => {
      const checked = Vide.source<boolean>(false);
      const [destroy, root] = Vide.root(
        () =>
          Checkbox.Root({
            checked,
            children: () => Checkbox.Indicator({ forceMount: true }),
          }) as TextButton,
      );

      const indicator = findChildOfClass(root, "Frame");
      assert(indicator !== undefined, "A forceMounted indicator should mount while unchecked.");
      assert(!readProperty(() => indicator.Visible), "A forceMounted indicator should be hidden while unchecked.");

      checked(true);
      assert(
        readProperty(() => indicator.Visible),
        "Checking the box should reveal the forceMounted indicator.",
      );

      destroy();
    });

    it("treats indeterminate as present", () => {
      const [destroy, root] = Vide.root(
        () =>
          Checkbox.Root({
            defaultChecked: "indeterminate",
            children: () => Checkbox.Indicator({}),
          }) as TextButton,
      );

      assert(findChildOfClass(root, "Frame") !== undefined, "An indeterminate checkbox shows its indicator.");

      destroy();
    });
  });
};
