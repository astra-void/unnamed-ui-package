import { Vide } from "@lattice-ui/vide-runtime";
import { Tabs } from "@lattice-ui/vide-tabs";
import { readProperty } from "../../test-utils/videHarness";

export = () => {
  describe("vide tabs", () => {
    it("mounts exactly the selected panel", () => {
      const value = Vide.source("overview");

      // Without `forceMount` a panel is a `Vide.show`, so what it returns is a source holding the
      // instance while the panel is present and nothing while it is not.
      const [destroy, panels] = Vide.root(() => {
        const rendered: Record<string, () => Frame | undefined> = {};

        Tabs.Root({
          value,
          children: () => {
            rendered.overview = Tabs.Content({ value: "overview" }) as () => Frame | undefined;
            rendered.activity = Tabs.Content({ value: "activity" }) as () => Frame | undefined;
            return [rendered.overview, rendered.activity];
          },
        });

        return rendered;
      });

      assert(panels.overview() !== undefined, "The selected panel is mounted.");
      assert(panels.activity() === undefined, "An unselected panel is not.");

      value("activity");

      assert(panels.activity() !== undefined, "Selecting a tab mounts its panel.");
      assert(panels.overview() === undefined, "…and unmounts the one that lost the selection.");

      destroy();
    });

    it("keeps a forceMounted panel alive and drives Visible instead", () => {
      const value = Vide.source("overview");

      const [destroy, activity] = Vide.root(() => {
        let content: Frame | undefined;

        Tabs.Root({
          value,
          children: () => {
            content = Tabs.Content({ value: "activity", forceMount: true }) as Frame;
            return content;
          },
        });

        return content as Frame;
      });

      assert(activity !== undefined, "A forceMounted panel exists while another tab is selected.");
      assert(!readProperty(() => activity.Visible), "…and is hidden rather than unmounted.");

      value("activity");
      assert(
        readProperty(() => activity.Visible),
        "Selecting its tab should reveal it.",
      );

      destroy();
    });

    it("settles selection once the whole batch of triggers has registered", () => {
      const [destroy, triggers] = Vide.root(() => {
        const rendered: Record<string, TextButton> = {};

        Tabs.Root({
          children: () => {
            rendered.first = Tabs.Trigger({ value: "first" }) as TextButton;
            rendered.second = Tabs.Trigger({ value: "second" }) as TextButton;
            return [rendered.first, rendered.second];
          },
        });

        return rendered;
      });

      // Resolving after the first registration alone would hand the selection to it, because the
      // rest are not there yet.
      assert(
        readProperty(() => triggers.first.Active),
        "Both triggers should be live after the batch.",
      );
      assert(
        readProperty(() => triggers.second.Active),
        "Both triggers should be live after the batch.",
      );

      destroy();
    });
  });
};
