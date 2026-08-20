import { Vide } from "@lattice-ui/vide-runtime";
import { Slider } from "@lattice-ui/vide-slider";
import { readProperty } from "../../test-utils/videHarness";

function renderSlider(props: {
  value?: Vide.Source<number>;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}) {
  return Vide.root(() => {
    const rendered: Record<string, GuiObject> = {};

    Slider.Root({
      value: props.value,
      min: props.min,
      max: props.max,
      step: props.step,
      disabled: props.disabled,
      children: () => {
        rendered.track = Slider.Track({
          children: () => {
            rendered.range = Slider.Range({}) as Frame;
            rendered.thumb = Slider.Thumb({}) as TextButton;
            return [rendered.range, rendered.thumb];
          },
        }) as Frame;
        return rendered.track;
      },
    });

    return rendered;
  });
}

export = () => {
  describe("vide slider", () => {
    it("neutralizes the thumb it renders", () => {
      const [destroy, parts] = renderSlider({});
      const thumb = parts.thumb as TextButton;

      assert(thumb.IsA("TextButton"), "Slider.Thumb should render a TextButton by default.");
      assert(readProperty(() => thumb.AutoButtonColor) === false, "The thumb should neutralize AutoButtonColor.");
      assert(readProperty(() => thumb.Text) === "", 'The thumb should neutralize the default "Button" text.');

      destroy();
    });

    it("keeps a disabled slider inert", () => {
      const [destroy, parts] = renderSlider({ disabled: true });
      const thumb = parts.thumb as TextButton;

      assert(!readProperty(() => thumb.Active), "A disabled thumb is not active.");
      assert(!readProperty(() => thumb.Selectable), "…and is not reachable by selection.");

      destroy();
    });

    it("maps the value onto the range's width, clamped at both ends", () => {
      const value = Vide.source(25);
      const [destroy, parts] = renderSlider({ value, min: 0, max: 100 });
      const range = parts.range as Frame;

      task.wait();
      assert(math.abs(readProperty(() => range.Size.X.Scale) - 0.25) < 0.02, "A quarter of the way is 0.25 wide.");

      value(500);
      task.wait();
      assert(readProperty(() => range.Size.X.Scale) <= 1, "A value past the maximum is still a full range.");

      value(-40);
      task.wait();
      assert(readProperty(() => range.Size.X.Scale) >= 0, "A value below the minimum is still an empty one.");

      destroy();
    });
  });
};
