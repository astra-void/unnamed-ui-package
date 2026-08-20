import { Vide } from "@lattice-ui/vide-runtime";
import { Textarea } from "@lattice-ui/vide-textarea";
import { getLocalPlayerGui } from "../../test-utils/playerGui";
import { readProperty } from "../../test-utils/videHarness";

export = () => {
  describe("vide textarea", () => {
    it("grows with the text and stops at the maximum row count", () => {
      const value = Vide.source("one line");

      const [destroy, input] = Vide.root(() => {
        let rendered: TextBox | undefined;

        Textarea.Root({
          value,
          autoResize: true,
          minRows: 1,
          maxRows: 3,
          children: () => {
            rendered = Textarea.Input({ lineHeight: 20 }) as TextBox;
            return rendered;
          },
        });

        return rendered as TextBox;
      });

      // TextBounds only means anything once the box is on screen.
      const screen = new Instance("ScreenGui");
      screen.Parent = getLocalPlayerGui();
      input.Size = UDim2.fromOffset(200, 20);
      input.Parent = screen;
      task.wait();

      const oneLine = readProperty(() => input.Size.Y.Offset);

      value("one line\ntwo lines\nthree lines\nfour lines\nfive lines");
      // The resize pass runs twice per edit, because TextBounds lags the change that caused it.
      task.wait();
      task.wait();

      const many = readProperty(() => input.Size.Y.Offset);

      assert(many >= oneLine, "More text should never make the box shorter.");
      assert(many <= oneLine + 20 * 3, "The box stops growing at the maximum row count.");

      screen.Destroy();
      destroy();
    });

    it("reports a commit separately from every keystroke", () => {
      const commits: string[] = [];
      const value = Vide.source("draft");

      const [destroy] = Vide.root(() => {
        Textarea.Root({
          value,
          onValueCommit: (committed) => commits.push(committed),
          children: () => Textarea.Input({}),
        });

        return undefined;
      });

      // Nothing has been committed by rendering alone; a commit is an edit ending, not an edit.
      assert(commits.size() === 0, "Rendering should not report a commit.");

      destroy();
    });
  });
};
