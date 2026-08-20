import { Vide } from "@lattice-ui/vide-runtime";
import { ToggleGroup } from "@lattice-ui/vide-toggle-group";
import { readProperty } from "../../test-utils/videHarness";

export = () => {
  describe("vide toggle group", () => {
    it("neutralizes its items and follows a per-item disabled source", () => {
      const disabled = Vide.source(false);

      const [destroy, items] = Vide.root(() => {
        const rendered: Record<string, TextButton> = {};

        ToggleGroup.Root({
          type: "multiple",
          defaultValue: ["bold"],
          children: () => {
            rendered.bold = ToggleGroup.Item({ value: "bold" }) as TextButton;
            rendered.italic = ToggleGroup.Item({ value: "italic", disabled }) as TextButton;
            return [rendered.bold, rendered.italic];
          },
        });

        return rendered;
      });

      assert(readProperty(() => items.bold.AutoButtonColor) === false, "Items should neutralize AutoButtonColor.");
      assert(
        readProperty(() => items.italic.Active),
        "An enabled item is active.",
      );

      disabled(true);
      assert(!readProperty(() => items.italic.Active), "Disabling an item should clear Active.");
      assert(!readProperty(() => items.italic.Selectable), "…and Selectable with it.");

      destroy();
    });

    it("disables every item when the group is disabled", () => {
      const [destroy, items] = Vide.root(() => {
        const rendered: TextButton[] = [];

        ToggleGroup.Root({
          type: "single",
          disabled: true,
          children: () => {
            rendered.push(ToggleGroup.Item({ value: "left" }) as TextButton);
            rendered.push(ToggleGroup.Item({ value: "right" }) as TextButton);
            return rendered;
          },
        });

        return rendered;
      });

      for (const item of items) {
        assert(!readProperty(() => item.Active), "A disabled group disables every item in it.");
      }

      destroy();
    });
  });
};
