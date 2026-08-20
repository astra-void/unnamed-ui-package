import { Combobox } from "@lattice-ui/vide-combobox";
import { PortalProvider, Vide } from "@lattice-ui/vide-runtime";
import { getLocalPlayerGui } from "../../test-utils/playerGui";
import { readProperty } from "../../test-utils/videHarness";

const LANGUAGES = ["TypeScript", "Luau", "Rust"];

function renderCombobox(options: {
  value: Vide.Source<string | undefined>;
  inputValue: Vide.Source<string>;
  open: Vide.Source<boolean>;
}) {
  const playerGui = getLocalPlayerGui();

  return Vide.root(() => {
    const rendered: Record<string, GuiObject> = {};

    PortalProvider({
      container: playerGui,
      children: () =>
        Combobox.Root({
          value: options.value,
          inputValue: options.inputValue,
          open: options.open,
          children: () => {
            rendered.input = Combobox.Input({}) as TextBox;
            rendered.value = Combobox.Value({ placeholder: "Start typing…" }) as TextLabel;

            return [
              rendered.input,
              rendered.value,
              Combobox.Portal({
                children: () =>
                  Combobox.Content({
                    children: () => LANGUAGES.map((language) => Combobox.Item({ value: language })),
                  }),
              }),
            ];
          },
        }),
    });

    return rendered;
  });
}

export = () => {
  describe("vide combobox", () => {
    it("binds the input to the controlled query", () => {
      const value = Vide.source<string | undefined>(undefined);
      const inputValue = Vide.source("Lu");
      const open = Vide.source(true);
      const [destroy, parts] = renderCombobox({ value, inputValue, open });
      const input = parts.input as TextBox;

      task.wait();
      assert(readProperty(() => input.Text) === "Lu", "The input starts on the controlled query.");

      inputValue("Rus");
      assert(readProperty(() => input.Text) === "Rus", "Changing the query should reach the input.");

      destroy();
    });

    it("keeps a selection's label after the popup has closed", () => {
      const value = Vide.source<string | undefined>("Luau");
      const inputValue = Vide.source("");
      const open = Vide.source(true);
      const [destroy, parts] = renderCombobox({ value, inputValue, open });
      const label = parts.value as TextLabel;

      task.wait();
      assert(readProperty(() => label.Text) === "Luau", "An open combobox shows the selection's text.");

      open(false);
      task.wait();

      // The cache is the point: an item exists only while the popup holding it is open.
      assert(readProperty(() => label.Text) === "Luau", "Closing the popup should not cost the value its name.");

      destroy();
    });
  });
};
