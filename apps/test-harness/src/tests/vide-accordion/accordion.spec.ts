import { Accordion } from "@lattice-ui/vide-accordion";
import { Vide } from "@lattice-ui/vide-runtime";

export = () => {
  describe("vide accordion", () => {
    it("keeps one section open at a time", () => {
      const value = Vide.source<string | string[]>("install");

      const [destroy, sections] = Vide.root(() => {
        const rendered: Record<string, () => Frame | undefined> = {};

        Accordion.Root({
          type: "single",
          value,
          children: () => {
            const install = Accordion.Item({
              value: "install",
              children: () => {
                rendered.install = Accordion.Content({}) as () => Frame | undefined;
                return rendered.install;
              },
            });
            const theming = Accordion.Item({
              value: "theming",
              children: () => {
                rendered.theming = Accordion.Content({}) as () => Frame | undefined;
                return rendered.theming;
              },
            });
            return [install, theming];
          },
        });

        return rendered;
      });

      assert(sections.install() !== undefined, "The open section's content is mounted.");
      assert(sections.theming() === undefined, "A closed section's content is not.");

      value("theming");

      assert(sections.theming() !== undefined, "Opening another section mounts its content.");
      assert(sections.install() === undefined, "…and closes the one that was open.");

      destroy();
    });

    it("lets a collapsible group close the section that is open", () => {
      const value = Vide.source<string | string[]>("install");

      const [destroy, content] = Vide.root(() => {
        let rendered: (() => Frame | undefined) | undefined;

        Accordion.Root({
          type: "single",
          collapsible: true,
          value,
          children: () =>
            Accordion.Item({
              value: "install",
              children: () => {
                rendered = Accordion.Content({}) as () => Frame | undefined;
                return rendered;
              },
            }),
        });

        return rendered as () => Frame | undefined;
      });

      assert(content() !== undefined, "The section starts open.");

      // An empty value is what a collapsible group settles on; a plain single group has no way to
      // reach this state at all.
      value("");
      assert(content() === undefined, "A collapsible group can close the section that is open.");

      destroy();
    });
  });
};
