import { Progress } from "@lattice-ui/react-progress";
import { React } from "@lattice-ui/react-runtime";

function SectionHeader(props: { text: string; order: number }) {
  return (
    <textlabel
      LayoutOrder={props.order}
      Size={UDim2.fromOffset(860, 18)}
      Text={props.text}
      className="text-ink-400 text-sm text-left"
    />
  );
}

function ProgressBar(props: {
  order: number;
  label: string;
  value?: number;
  max?: number;
  indeterminate?: boolean;
  /** Indicator fill as a class; see ToastBasicScene for why this is a string. */
  colorClass?: string;
  width?: number;
}) {
  const width = props.width ?? 860;
  const max = props.max ?? 100;
  const colorClass = props.colorClass ?? "bg-accent";
  const percentText = props.indeterminate ? "…" : `${math.floor(((props.value ?? 0) / math.max(1, max)) * 100)}%`;

  return (
    <frame LayoutOrder={props.order} Size={UDim2.fromOffset(width, 40)} className="bg-transparent flex-col gap-1">
      <frame LayoutOrder={1} Size={UDim2.fromOffset(width, 18)} className="bg-transparent">
        <textlabel Size={UDim2.fromOffset(width - 60, 18)} Text={props.label} className="text-ink text-sm text-left" />
        <textlabel
          AnchorPoint={new Vector2(1, 0)}
          Position={new UDim2(1, 0, 0, 0)}
          Size={UDim2.fromOffset(60, 18)}
          Text={percentText}
          className="text-ink-400 text-sm text-right"
        />
      </frame>

      <Progress.Root indeterminate={props.indeterminate} max={max} value={props.value}>
        <frame LayoutOrder={2} Size={UDim2.fromOffset(width, 14)} className="bg-surface-100 rounded-sm">
          <Progress.Indicator asChild>
            <frame Size={UDim2.fromScale(1, 1)} className={[colorClass, "rounded-sm"]} />
          </Progress.Indicator>
        </frame>
      </Progress.Root>
    </frame>
  );
}

export function ProgressBasicScene() {
  const [value, setValue] = React.useState(35);

  return (
    <frame className="w-235 h-165 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(920, 28)}
        Text="Progress: determinate values, semantic states, indeterminate + spinner, interactive"
        className="text-ink text-xl text-left truncate"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(920, 22)}
        Text={`Interactive value: ${value}%`}
        className="text-ink-400 text-base text-left"
      />

      <frame className="top-16.5 w-235 h-145 bg-transparent flex-col gap-4">
        {/* Determinate */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={1}
          className="w-225 bg-surface rounded-lg p-3 flex-col gap-2.5"
        >
          <SectionHeader text="DETERMINATE" order={1} />
          <ProgressBar order={2} label="Empty" value={0} />
          <ProgressBar order={3} label="Quarter" value={25} />
          <ProgressBar order={4} label="Half" value={50} />
          <ProgressBar order={5} label="Almost done" value={85} />
          <ProgressBar order={6} label="Complete" value={100} />
        </frame>

        {/* Semantic states */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={2}
          className="w-225 bg-surface rounded-lg p-3 flex-col gap-2.5"
        >
          <SectionHeader text="SEMANTIC STATES" order={1} />
          <ProgressBar order={2} label="Success — upload complete" value={100} colorClass="bg-[#74b05f]" />
          <ProgressBar order={3} label="Warning — storage nearly full" value={78} colorClass="bg-[#d6ad5a]" />
          <ProgressBar order={4} label="Danger — quota exceeded" value={95} colorClass="bg-danger" />
        </frame>

        {/* Indeterminate + spinner */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={3}
          className="w-225 bg-surface rounded-lg p-3 flex-col gap-2.5"
        >
          <SectionHeader text="INDETERMINATE + SPINNER" order={1} />
          <ProgressBar order={2} label="Loading (indeterminate)" indeterminate />
          <Progress.Spinner asChild speedDegPerSecond={240} spinning>
            <frame LayoutOrder={3} className="w-6 h-6 bg-transparent rounded-full border-2 border-accent">
              <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                Position={UDim2.fromScale(0.5, 0.1)}
                className="w-1 h-1 bg-accent rounded-full"
              />
            </frame>
          </Progress.Spinner>
        </frame>

        {/* Interactive */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={4}
          className="w-225 bg-surface rounded-lg p-3 flex-col gap-2.5"
        >
          <SectionHeader text="INTERACTIVE" order={1} />
          <ProgressBar order={2} label="Adjustable value" value={value} />
          <frame LayoutOrder={3} Size={UDim2.fromOffset(300, 36)} className="bg-transparent flex-row gap-2">
            <textbutton
              AutoButtonColor={false}
              Event={{
                Activated: () => {
                  setValue((current) => math.max(0, current - 10));
                },
              }}
              Text="-10"
              className="w-30 h-8.5 bg-surface text-ink text-base"
            />
            <textbutton
              AutoButtonColor={false}
              Event={{
                Activated: () => {
                  setValue((current) => math.min(100, current + 10));
                },
              }}
              Text="+10"
              className="w-30 h-8.5 bg-accent text-accent-50 text-base"
            />
          </frame>
        </frame>
      </frame>
    </frame>
  );
}
