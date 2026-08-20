import { PortalProvider, Vide } from "@lattice-ui/vide-runtime";
import { Select } from "@lattice-ui/vide-select";
import { getLocalPlayerGui } from "../../test-utils/playerGui";
import { readProperty } from "../../test-utils/videHarness";

function renderSelect(value: Vide.Source<string>, open: Vide.Source<boolean>) {
  const playerGui = getLocalPlayerGui();

  return Vide.root(() => {
    const rendered: Record<string, GuiObject> = {};

    PortalProvider({
      container: playerGui,
      children: () =>
        Select.Root({
          value,
          open,
          children: () => [
            Select.Trigger({
              children: () => {
                rendered.value = Select.Value({ placeholder: "Pick a region" }) as TextLabel;
                return rendered.value;
              },
            }),
            Select.Portal({
              children: () =>
                Select.Content({
                  children: () => [
                    Select.Item({ value: "us-east", textValue: "US East (Ohio)" }),
                    Select.Item({ value: "eu-central", textValue: "EU Central (Frankfurt)" }),
                  ],
                }),
            }),
          ],
        }),
    });

    return rendered;
  });
}

export = () => {
  describe("vide select", () => {
    it("keeps a selection's label after the popup that held its item has closed", () => {
      const value = Vide.source("eu-central");
      const open = Vide.source(true);
      const [destroy, parts] = renderSelect(value, open);
      const label = parts.value as TextLabel;

      task.wait();
      assert(
        readProperty(() => label.Text) === "EU Central (Frankfurt)",
        "An open select shows the selected item's text.",
      );

      // Items exist only while the popup is open, so the trigger has to read the label from a cache
      // rather than from the live registry.
      open(false);
      task.wait();

      assert(
        readProperty(() => label.Text) === "EU Central (Frankfurt)",
        "Closing the popup should not cost the value its name.",
      );

      destroy();
    });

    it("falls back to the placeholder when nothing is selected", () => {
      const value = Vide.source("");
      const open = Vide.source(false);
      const [destroy, parts] = renderSelect(value, open);
      const label = parts.value as TextLabel;

      task.wait();
      assert(readProperty(() => label.Text) === "Pick a region", "An empty select shows its placeholder.");

      destroy();
    });
  });
};
