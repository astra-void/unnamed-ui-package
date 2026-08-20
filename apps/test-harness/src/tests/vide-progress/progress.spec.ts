import { Progress } from "@lattice-ui/vide-progress";
import { Vide } from "@lattice-ui/vide-runtime";
import { readProperty } from "../../test-utils/videHarness";

export = () => {
  describe("vide progress", () => {
    it("sizes the indicator from the value", () => {
      const value = Vide.source(25);

      const [destroy, indicator] = Vide.root(() => {
        let rendered: Frame | undefined;

        Progress.Root({
          value,
          max: 100,
          children: () => {
            // The transition is left off so the width is the core's arithmetic rather than a frame
            // of an animation toward it.
            rendered = Progress.Indicator({}) as Frame;
            return rendered;
          },
        });

        return rendered as Frame;
      });

      assert(math.abs(readProperty(() => indicator.Size.X.Scale) - 0.25) < 0.001, "A quarter of the way is 0.25.");

      value(80);
      task.wait();
      assert(readProperty(() => indicator.Size.X.Scale) > 0.25, "Raising the value should widen the indicator.");

      destroy();
    });

    it("clamps a value beyond the maximum", () => {
      const [destroy, indicator] = Vide.root(() => {
        let rendered: Frame | undefined;

        Progress.Root({
          value: 500,
          max: 100,
          children: () => {
            rendered = Progress.Indicator({}) as Frame;
            return rendered;
          },
        });

        return rendered as Frame;
      });

      assert(readProperty(() => indicator.Size.X.Scale) <= 1, "A value past the maximum is still a full bar.");

      destroy();
    });

    it("renders a spinner that owns its own rotation", () => {
      const [destroy, spinner] = Vide.root(() => Progress.Spinner({ speedDegPerSecond: 360 }) as Frame);

      const before = readProperty(() => spinner.Rotation);
      task.wait(0.2);
      assert(readProperty(() => spinner.Rotation) !== before, "A spinning spinner should have turned.");

      destroy();
    });
  });
};
