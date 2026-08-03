import { RadioGroup } from "@lattice-ui/react-radio-group";
import { React } from "@lattice-ui/react-runtime";

type DensityOption = {
  value: string;
  label: string;
  description: string;
};

const DENSITY_OPTIONS: Array<DensityOption> = [
  { value: "comfortable", label: "Comfortable", description: "Balanced spacing for everyday reading." },
  { value: "compact", label: "Compact", description: "Denser rows to fit more on screen." },
  { value: "spacious", label: "Spacious", description: "Extra breathing room between items." },
];

function SectionHeader(props: { text: string; order: number }) {
  return (
    <textlabel
      LayoutOrder={props.order}
      Size={UDim2.fromOffset(860, 20)}
      Text={props.text}
      className="text-ink-400 text-sm text-left"
    />
  );
}

/**
 * `renderPillItem(value, label, selected)` in the sibling scene is one call
 * feeding `buttonRecipe({ intent: selected ? "primary" : "surface" })`. The
 * variant selection has to become a JSX branch here, and it cannot be hoisted
 * into a helper component because `RadioGroup.Item asChild` hands its merged
 * props to a single host child.
 */
function PillItem(props: { value: string; label: string; selected: boolean }) {
  return (
    <RadioGroup.Item asChild value={props.value}>
      {props.selected ? (
        <textbutton
          AutoButtonColor={false}
          Text={props.label}
          className="w-37.5 h-8.5 bg-accent text-accent-50 text-base rounded-md"
        />
      ) : (
        <textbutton
          AutoButtonColor={false}
          Text={props.label}
          className="w-37.5 h-8.5 bg-surface text-ink text-base rounded-md"
        />
      )}
    </RadioGroup.Item>
  );
}

function DensityCard(props: { option: DensityOption; selected: boolean; order: number }) {
  const option = props.option;

  return (
    <RadioGroup.Item asChild value={option.value}>
      {props.selected ? (
        <textbutton
          AutoButtonColor={false}
          LayoutOrder={props.order}
          Text=""
          className="w-105 h-14 bg-accent rounded-md px-2.5 py-2 flex-col gap-0.5"
        >
          <textlabel
            LayoutOrder={1}
            Size={UDim2.fromOffset(400, 18)}
            Text={option.label}
            className="text-accent-50 text-base text-left"
          />
          <textlabel
            LayoutOrder={2}
            Size={UDim2.fromOffset(400, 16)}
            Text={option.description}
            className="text-accent-50 text-sm text-left"
          />
        </textbutton>
      ) : (
        <textbutton
          AutoButtonColor={false}
          LayoutOrder={props.order}
          Text=""
          className="w-105 h-14 bg-surface rounded-md px-2.5 py-2 flex-col gap-0.5"
        >
          <textlabel
            LayoutOrder={1}
            Size={UDim2.fromOffset(400, 18)}
            Text={option.label}
            className="text-ink text-base text-left"
          />
          <textlabel
            LayoutOrder={2}
            Size={UDim2.fromOffset(400, 16)}
            Text={option.description}
            className="text-ink-400 text-sm text-left"
          />
        </textbutton>
      )}
    </RadioGroup.Item>
  );
}

export function RadioGroupDisabledScene() {
  const [density, setDensity] = React.useState("comfortable");
  const [horizontal, setHorizontal] = React.useState("list");
  const [vertical, setVertical] = React.useState("newest");
  const [value, setValue] = React.useState("file");

  return (
    <frame AutomaticSize={Enum.AutomaticSize.Y} className="w-235 bg-transparent flex-col gap-2">
      <textlabel
        LayoutOrder={1}
        Size={UDim2.fromOffset(920, 28)}
        Text="RadioGroup: card options, orientation, controlled readout, and disabled edge cases"
        className="text-ink text-xl text-left truncate"
      />
      <textlabel
        LayoutOrder={2}
        Size={UDim2.fromOffset(920, 22)}
        Text={`density=${density}  |  layout=${horizontal}  |  sort=${vertical}  |  edge=${value}`}
        className="text-ink-400 text-base text-left"
      />

      {/* Card-style options with label + description, controlled */}
      <frame
        AutomaticSize={Enum.AutomaticSize.Y}
        LayoutOrder={3}
        className="w-230 bg-surface rounded-lg p-3 flex-col gap-2"
      >
        <SectionHeader order={1} text="Card options (controlled value drives the readout above)" />

        <RadioGroup.Root onValueChange={setDensity} value={density}>
          <frame AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={2} className="w-220 bg-transparent flex-col gap-1.5">
            {DENSITY_OPTIONS.map((option, index) => (
              <DensityCard key={option.value} option={option} selected={density === option.value} order={index} />
            ))}
          </frame>
        </RadioGroup.Root>
      </frame>

      {/* Orientation: horizontal vs vertical */}
      <frame
        AutomaticSize={Enum.AutomaticSize.Y}
        LayoutOrder={4}
        className="w-230 bg-surface rounded-lg p-3 flex-col gap-2"
      >
        <SectionHeader order={1} text="Horizontal orientation (arrow keys move left/right)" />

        <RadioGroup.Root onValueChange={setHorizontal} orientation="horizontal" value={horizontal}>
          <frame LayoutOrder={2} className="w-220 h-8.5 bg-transparent flex-row gap-1.5">
            <PillItem value="list" label="List" selected={horizontal === "list"} />
            <PillItem value="grid" label="Grid" selected={horizontal === "grid"} />
            <PillItem value="board" label="Board" selected={horizontal === "board"} />
          </frame>
        </RadioGroup.Root>

        <SectionHeader order={3} text="Vertical orientation (arrow keys move up/down)" />

        <RadioGroup.Root onValueChange={setVertical} orientation="vertical" value={vertical}>
          <frame LayoutOrder={4} className="w-45 h-29 bg-transparent flex-col gap-1.5">
            <PillItem value="newest" label="Newest first" selected={vertical === "newest"} />
            <PillItem value="oldest" label="Oldest first" selected={vertical === "oldest"} />
            <PillItem value="az" label="Alphabetical" selected={vertical === "az"} />
          </frame>
        </RadioGroup.Root>
      </frame>

      {/* Edge cases: partial disabled skip + group disabled */}
      <frame
        AutomaticSize={Enum.AutomaticSize.Y}
        LayoutOrder={5}
        className="w-230 bg-surface rounded-lg p-3 flex-col gap-2"
      >
        <SectionHeader order={1} text="Partial disabled (middle item is disabled and should be skipped)" />

        <RadioGroup.Root onValueChange={setValue} value={value}>
          <frame LayoutOrder={2} className="w-145 h-31 bg-transparent flex-col gap-1.5">
            <RadioGroup.Item asChild value="file">
              {value === "file" ? (
                <textbutton
                  AutoButtonColor={false}
                  Text="File"
                  className="w-75 h-8.5 bg-accent text-accent-50 text-base"
                />
              ) : (
                <textbutton AutoButtonColor={false} Text="File" className="w-75 h-8.5 bg-surface text-ink text-base" />
              )}
            </RadioGroup.Item>

            <RadioGroup.Item asChild disabled value="edit">
              <textbutton
                Active={false}
                AutoButtonColor={false}
                Selectable={false}
                Text="Edit (Disabled)"
                className="w-75 h-8.5 bg-surface text-ink-400 text-base"
              />
            </RadioGroup.Item>

            <RadioGroup.Item asChild value="view">
              {value === "view" ? (
                <textbutton
                  AutoButtonColor={false}
                  Text="View"
                  className="w-75 h-8.5 bg-accent text-accent-50 text-base"
                />
              ) : (
                <textbutton AutoButtonColor={false} Text="View" className="w-75 h-8.5 bg-surface text-ink text-base" />
              )}
            </RadioGroup.Item>
          </frame>
        </RadioGroup.Root>

        <SectionHeader order={3} text="Group disabled (selection stays fixed)" />

        <RadioGroup.Root defaultValue="fixed" disabled orientation="horizontal">
          <frame LayoutOrder={4} className="w-145 h-8.5 bg-transparent flex-row gap-1.5">
            <RadioGroup.Item asChild value="fixed">
              <textbutton
                Active={false}
                AutoButtonColor={false}
                Selectable={false}
                Text="Fixed"
                className="w-37.5 h-8.5 bg-surface text-ink-400 text-base"
              />
            </RadioGroup.Item>

            <RadioGroup.Item asChild value="other">
              <textbutton
                Active={false}
                AutoButtonColor={false}
                Selectable={false}
                Text="Other"
                className="w-37.5 h-8.5 bg-surface text-ink-400 text-base"
              />
            </RadioGroup.Item>
          </frame>
        </RadioGroup.Root>
      </frame>
    </frame>
  );
}
