import { RadioGroup } from "@lattice-ui/vide-radio-group";
import { Vide } from "@lattice-ui/vide-runtime";
import { findChildOfClass, readProperty } from "../../test-utils/videHarness";

function renderGroup(value: Vide.Source<string>) {
  return Vide.root(() => {
    const items: Record<string, TextButton> = {};

    RadioGroup.Root({
      value,
      children: () => {
        items.first = RadioGroup.Item({
          value: "first",
          children: () => RadioGroup.Indicator({}),
        }) as TextButton;
        items.second = RadioGroup.Item({
          value: "second",
          disabled: true,
          children: () => RadioGroup.Indicator({}),
        }) as TextButton;
        return [items.first, items.second];
      },
    });

    return items;
  });
}

export = () => {
  describe("vide radio group", () => {
    it("mounts the indicator only on the selected item", () => {
      const value = Vide.source("first");
      const [destroy, items] = renderGroup(value);

      assert(findChildOfClass(items.first, "Frame") !== undefined, "The selected item shows its indicator.");
      assert(findChildOfClass(items.second, "Frame") === undefined, "An unselected item does not.");

      value("second");

      assert(findChildOfClass(items.second, "Frame") !== undefined, "Selection should move the indicator.");
      assert(findChildOfClass(items.first, "Frame") === undefined, "The old selection should drop it.");

      destroy();
    });

    it("keeps a disabled item out of the focus flow", () => {
      const value = Vide.source("first");
      const [destroy, items] = renderGroup(value);

      assert(
        readProperty(() => items.first.Active),
        "An enabled item is active.",
      );
      assert(!readProperty(() => items.second.Active), "A disabled item is not.");
      assert(!readProperty(() => items.second.Selectable), "A disabled item is not selectable either.");

      destroy();
    });
  });
};
