import { bindDerivedProps, type Derivable, read, Vide } from "@lattice-ui/vide-runtime";
import { Slider } from "@lattice-ui/vide-slider";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

type SliderRowProps = {
  label: string;
  order: number;
  value: Vide.Source<number>;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  format?: (value: number) => string;
};

function SliderRow(props: SliderRowProps) {
  const { theme } = useTheme();
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const fraction = () => (props.value() - min) / (max - min);
  const format = props.format ?? ((value: number) => `${math.floor(value)}`);

  return (
    <frame BackgroundTransparency={1} LayoutOrder={props.order} Size={UDim2.fromOffset(636, 56)}>
      <Text
        BackgroundTransparency={1}
        Size={UDim2.fromOffset(636, 20)}
        Text={() => `${props.label} — ${format(props.value())}`}
        TextColor3={() => (props.disabled === true ? theme().colors.textSecondary : theme().colors.textPrimary)}
        TextSize={() => theme().typography.bodyMd.textSize}
        TextXAlignment={Enum.TextXAlignment.Left}
      />
      <Slider.Root
        value={props.value}
        min={min}
        max={max}
        step={props.step}
        disabled={props.disabled}
        onValueChange={(nextValue) => props.value(nextValue)}
      >
        {() => (
          <Slider.Track
            {...bindDerivedProps<Frame>(() =>
              mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                Position: UDim2.fromOffset(0, 30),
                Size: UDim2.fromOffset(560, 8),
              }),
            )}
          >
            {() => [
              <uicorner CornerRadius={new UDim(1, 0)} />,
              <Slider.Range
                BackgroundColor3={() => theme().colors.accent}
                BorderSizePixel={0}
                Size={() => UDim2.fromScale(math.clamp(fraction(), 0, 1), 1)}
              >
                {() => <uicorner CornerRadius={new UDim(1, 0)} />}
              </Slider.Range>,
              <Slider.Thumb
                AnchorPoint={new Vector2(0.5, 0.5)}
                AutoButtonColor={false}
                BackgroundColor3={() => theme().colors.accentContrast}
                BorderSizePixel={0}
                Position={() => new UDim2(math.clamp(fraction(), 0, 1), 0, 0.5, 0)}
                Size={UDim2.fromOffset(18, 18)}
                Text=""
              >
                {() => <uicorner CornerRadius={new UDim(1, 0)} />}
              </Slider.Thumb>,
            ]}
          </Slider.Track>
        )}
      </Slider.Root>
    </frame>
  );
}

export function SliderScene() {
  const volume = Vide.source(64);
  const quality = Vide.source(2);
  const locked = Vide.source(40);

  const QUALITY_NAMES = ["Low", "Medium", "High", "Ultra"];

  return (
    <SceneRoot
      title="Slider — continuous, stepped and disabled"
      summary={() => `Volume ${math.floor(volume())} · Quality ${QUALITY_NAMES[quality()]}`}
    >
      <ScenePanel heading="AUDIO" order={1}>
        <SliderRow label="Master volume" order={1} value={volume} format={(v) => `${math.floor(v)}%`} />
      </ScenePanel>
      <ScenePanel heading="GRAPHICS" order={2}>
        <SliderRow
          label="Quality"
          order={1}
          value={quality}
          min={0}
          max={3}
          step={1}
          format={(v) => QUALITY_NAMES[math.floor(v)]}
        />
        <SliderRow label="Render scale (disabled)" order={2} value={locked} disabled />
        <SceneReadout order={3} text="Dragging follows one finger, or any mouse movement once the press has started." />
      </ScenePanel>
    </SceneRoot>
  );
}
