// `bindDerivedProps` is the seam between a props table computed from reactive state and the only
// shape Vide re-applies: a function. These specs pin the three rules it has to keep.

import { bindDerivedProps, composeCallbacks, Vide } from "@lattice-ui/vide-runtime";
import { readProperty } from "../../test-utils/videHarness";

export = () => {
  describe("vide runtime derived props", () => {
    it("re-applies a value that its source changed", () => {
      const width = Vide.source(100);

      const [destroy, frame] = Vide.root(
        () =>
          Vide.create("Frame")(
            bindDerivedProps<Frame>(() => ({
              BackgroundTransparency: 1,
              Size: UDim2.fromOffset(width(), 10),
            })) as never,
          ) as Frame,
      );

      assert(readProperty(() => frame.Size.X.Offset) === 100, "The first resolution should reach the instance.");

      width(240);
      assert(readProperty(() => frame.Size.X.Offset) === 240, "A later resolution should reach it too.");

      destroy();
    });

    it("hands a function value through untouched, so an event still connects", () => {
      let fired = 0;

      // A BindableEvent stands in for a button here because it is the one signal a spec can raise
      // itself. The rule under test is the same one: Vide connects a function whose property is a
      // signal, and wrapping that function in a getter would have made it write the handler to the
      // property instead.
      const [destroy, bindable] = Vide.root(
        () =>
          Vide.create("BindableEvent")(
            bindDerivedProps<BindableEvent>(() => ({
              Name: "DerivedProps",
              Event: () => {
                fired += 1;
              },
            })) as never,
          ) as BindableEvent,
      );

      bindable.Fire();
      task.wait();

      assert(fired === 1, "A function value should be connected as an event listener.");

      destroy();
    });

    it("keeps a property that a later resolution stopped mentioning", () => {
      const withBorder = Vide.source(true);

      const [destroy, frame] = Vide.root(
        () =>
          Vide.create("Frame")(
            bindDerivedProps<Frame>(() =>
              withBorder() ? { BackgroundTransparency: 1, BorderSizePixel: 4 } : { BackgroundTransparency: 1 },
            ) as never,
          ) as Frame,
      );

      assert(readProperty(() => frame.BorderSizePixel) === 4, "The first resolution decides the key set.");

      withBorder(false);
      assert(
        readProperty(() => frame.BorderSizePixel) === 4,
        "A property nobody mentions any more has no correct value to be written, so it keeps its first one.",
      );

      destroy();
    });
  });

  describe("vide runtime callback composition", () => {
    it("runs the consumer's handler before the primitive's", () => {
      const order: string[] = [];
      const composed = composeCallbacks(
        () => order.push("consumer"),
        () => order.push("own"),
      );

      composed();

      assert(order.size() === 2, "Both handlers should run.");
      assert(order[0] === "consumer" && order[1] === "own", "The consumer's handler runs first.");
    });

    it("returns the primitive's handler when there is nothing to compose with", () => {
      let ran = false;
      const composed = composeCallbacks(undefined, () => {
        ran = true;
      });

      composed();
      assert(ran, "The primitive's handler should still run.");
    });
  });
};
