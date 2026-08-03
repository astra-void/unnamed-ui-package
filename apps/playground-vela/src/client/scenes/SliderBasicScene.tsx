import { React } from "@lattice-ui/react-runtime";
import { Slider } from "@lattice-ui/react-slider";

const LEFT_X = 12;
const TRACK_W = 480;
const STEP_TICKS = [0, 25, 50, 75, 100];

function SectionLabel(props: { text: string; position: UDim2; width?: number }) {
  return (
    <textlabel
      Position={props.position}
      Size={UDim2.fromOffset(props.width ?? 860, 20)}
      Text={props.text}
      className="text-ink text-sm text-left"
    />
  );
}

function HSlider(props: {
  value: number;
  onValueChange: (value: number) => void;
  onCommit?: (value: number) => void;
  position: UDim2;
  width: number;
  min?: number;
  max?: number;
  step?: number;
  height?: number;
  showBadge?: boolean;
}) {
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const height = props.height ?? 12;

  return (
    <Slider.Root
      max={max}
      min={min}
      onValueChange={props.onValueChange}
      onValueCommit={props.onCommit}
      step={props.step ?? 1}
      value={props.value}
    >
      <Slider.Track asChild>
        <frame
          Position={props.position}
          Size={UDim2.fromOffset(props.width, height)}
          className="bg-surface-100 rounded-full"
        >
          <Slider.Range asChild>
            <frame className="bg-accent rounded-full" />
          </Slider.Range>

          <Slider.Thumb asChild>
            <textbutton AutoButtonColor={false} Text="" className="w-5 h-5 bg-accent-50 rounded-full">
              {props.showBadge === true ? (
                <frame
                  AnchorPoint={new Vector2(0.5, 1)}
                  Position={new UDim2(new UDim(0.5, 0), new UDim(0, -6))}
                  className="w-9.5 h-5 bg-accent rounded-sm"
                >
                  <textlabel
                    Size={UDim2.fromScale(1, 1)}
                    Text={`${math.floor(props.value)}`}
                    className="text-accent-50 text-sm"
                  />
                </frame>
              ) : undefined}
            </textbutton>
          </Slider.Thumb>
        </frame>
      </Slider.Track>
    </Slider.Root>
  );
}

export function SliderBasicScene() {
  const [horizontalValue, setHorizontalValue] = React.useState(42);
  const [verticalValue, setVerticalValue] = React.useState(68);
  const [steppedValue, setSteppedValue] = React.useState(50);
  const [fineValue, setFineValue] = React.useState(50);
  const [coarseValue, setCoarseValue] = React.useState(50);
  const [lastCommit, setLastCommit] = React.useState("none");

  return (
    <frame className="w-235 h-140 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(920, 28)}
        Text="Slider: pointer drag, stepped values, and commit feedback"
        className="text-ink text-xl text-left"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(920, 24)}
        Text={`Horizontal: ${math.floor(horizontalValue)} (${math.floor(horizontalValue)}%) | Vertical: ${math.floor(verticalValue)} | Stepped: ${math.floor(steppedValue)} | Last commit: ${lastCommit}`}
        className="text-ink-400 text-base text-left"
      />

      <frame className="top-19 w-225 h-87.5 bg-surface rounded-lg">
        {/* Horizontal with live percentage + thumb value badge */}
        <SectionLabel
          position={UDim2.fromOffset(LEFT_X, 12)}
          text="Horizontal (drag) — value badge on thumb"
          width={480}
        />
        <textlabel
          Position={UDim2.fromOffset(LEFT_X + 400, 12)}
          Size={UDim2.fromOffset(80, 20)}
          Text={`${math.floor(horizontalValue)}%`}
          className="text-accent text-sm text-right"
        />
        <HSlider
          onCommit={(value) => setLastCommit(`horizontal:${math.floor(value)}`)}
          onValueChange={setHorizontalValue}
          position={UDim2.fromOffset(LEFT_X, 46)}
          showBadge
          value={horizontalValue}
          width={TRACK_W}
        />

        {/* Stepped slider with visible tick marks + labels */}
        <SectionLabel
          position={UDim2.fromOffset(LEFT_X, 90)}
          text="Stepped (step 25) — snaps to tick marks"
          width={480}
        />
        <HSlider
          onCommit={(value) => setLastCommit(`stepped:${math.floor(value)}`)}
          onValueChange={setSteppedValue}
          position={UDim2.fromOffset(LEFT_X, 128)}
          step={25}
          value={steppedValue}
          width={TRACK_W}
        />
        <frame Position={UDim2.fromOffset(LEFT_X, 128)} Size={UDim2.fromOffset(TRACK_W, 12)} className="bg-transparent">
          {STEP_TICKS.map((tick) => (
            <frame
              key={`tick-${tick}`}
              AnchorPoint={new Vector2(0.5, 0)}
              Position={new UDim2(new UDim(tick / 100, 0), new UDim(0, -4))}
              Size={UDim2.fromOffset(2, 20)}
              className="bg-edge"
            />
          ))}
        </frame>
        <frame Position={UDim2.fromOffset(LEFT_X, 150)} Size={UDim2.fromOffset(TRACK_W, 16)} className="bg-transparent">
          {STEP_TICKS.map((tick) =>
            steppedValue === tick ? (
              <textlabel
                key={`label-${tick}`}
                AnchorPoint={new Vector2(0.5, 0)}
                Position={new UDim2(new UDim(tick / 100, 0), new UDim(0, 0))}
                Size={UDim2.fromOffset(40, 16)}
                Text={`${tick}`}
                className="text-accent text-sm"
              />
            ) : (
              <textlabel
                key={`label-${tick}`}
                AnchorPoint={new Vector2(0.5, 0)}
                Position={new UDim2(new UDim(tick / 100, 0), new UDim(0, 0))}
                Size={UDim2.fromOffset(40, 16)}
                Text={`${tick}`}
                className="text-ink-400 text-sm"
              />
            ),
          )}
        </frame>

        {/* Fine vs coarse step comparison */}
        <SectionLabel position={UDim2.fromOffset(LEFT_X, 194)} text="Step granularity — fine vs coarse" width={480} />
        <textlabel
          Position={UDim2.fromOffset(LEFT_X, 220)}
          Size={UDim2.fromOffset(480, 16)}
          Text={`fine · step 1 → ${math.floor(fineValue)}`}
          className="text-ink-400 text-sm text-left"
        />
        <HSlider
          height={8}
          onValueChange={setFineValue}
          position={UDim2.fromOffset(LEFT_X, 240)}
          step={1}
          value={fineValue}
          width={TRACK_W}
        />
        <textlabel
          Position={UDim2.fromOffset(LEFT_X, 262)}
          Size={UDim2.fromOffset(480, 16)}
          Text={`coarse · step 25 → ${math.floor(coarseValue)}`}
          className="text-ink-400 text-sm text-left"
        />
        <HSlider
          height={8}
          onValueChange={setCoarseValue}
          position={UDim2.fromOffset(LEFT_X, 282)}
          step={25}
          value={coarseValue}
          width={TRACK_W}
        />

        {/* Vertical (right column) */}
        <SectionLabel position={UDim2.fromOffset(560, 12)} text="Vertical (step 5)" width={320} />
        <Slider.Root
          max={100}
          min={0}
          onValueChange={setVerticalValue}
          onValueCommit={(value) => {
            setLastCommit(`vertical:${math.floor(value)}`);
          }}
          orientation="vertical"
          step={5}
          value={verticalValue}
        >
          <Slider.Track asChild>
            <frame Position={UDim2.fromOffset(572, 46)} className="w-3 h-50 bg-surface-100 rounded-full">
              <Slider.Range asChild>
                <frame className="bg-accent rounded-full" />
              </Slider.Range>

              <Slider.Thumb asChild>
                <textbutton AutoButtonColor={false} Text="" className="w-5 h-5 bg-accent-50 rounded-full" />
              </Slider.Thumb>
            </frame>
          </Slider.Track>
        </Slider.Root>

        {/* Disabled (right column) */}
        <SectionLabel position={UDim2.fromOffset(620, 12)} text="Disabled" width={260} />
        <Slider.Root defaultValue={30} disabled max={100} min={0}>
          <Slider.Track asChild>
            <frame Position={UDim2.fromOffset(620, 46)} className="w-65 h-2.5 bg-surface-100 rounded-full">
              <Slider.Range asChild>
                <frame className="bg-ink-400 rounded-full" />
              </Slider.Range>

              <Slider.Thumb asChild>
                <textbutton AutoButtonColor={false} Text="" className="w-4 h-4 bg-ink-400 rounded-full" />
              </Slider.Thumb>
            </frame>
          </Slider.Track>
        </Slider.Root>
      </frame>

      <frame
        Position={UDim2.fromOffset(0, 440)}
        Size={UDim2.fromOffset(420, 40)}
        className="bg-transparent flex-row gap-2"
      >
        <textbutton
          AutoButtonColor={false}
          Event={{
            Activated: () => {
              setHorizontalValue(0);
              setVerticalValue(100);
            },
          }}
          Text="Set 0/100"
          className="w-30 h-9 bg-surface text-ink text-base"
        />

        <textbutton
          AutoButtonColor={false}
          Event={{
            Activated: () => {
              setHorizontalValue(50);
              setVerticalValue(50);
            },
          }}
          Text="Set Mid"
          className="w-30 h-9 bg-accent text-accent-50 text-base"
        />
      </frame>
    </frame>
  );
}
