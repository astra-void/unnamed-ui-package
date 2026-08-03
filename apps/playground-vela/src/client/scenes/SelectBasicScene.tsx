import { React } from "@lattice-ui/react-runtime";
import { Select } from "@lattice-ui/react-select";

const LONG_OPTIONS = [
  "argon",
  "boron",
  "carbon",
  "helium",
  "iodine",
  "krypton",
  "lithium",
  "neon",
  "oxygen",
  "radon",
  "sodium",
  "xenon",
];

function SectionHeader(props: { text: string }) {
  return (
    <textlabel
      LayoutOrder={0}
      Size={UDim2.fromOffset(860, 20)}
      Text={props.text}
      className="text-ink-400 text-sm text-left"
    />
  );
}

function OptionItem(props: { value: string; label?: string; disabled?: boolean; width?: number }) {
  const label = props.label ?? props.value;
  return (
    <Select.Item asChild disabled={props.disabled} textValue={label} value={props.value}>
      {props.disabled === true ? (
        <textbutton
          Active={false}
          AutoButtonColor={false}
          Selectable={false}
          Size={UDim2.fromOffset(props.width ?? 296, 30)}
          Text={label}
          className="bg-surface text-ink-400 text-sm text-left pl-2.5"
        />
      ) : (
        <textbutton
          AutoButtonColor={false}
          Size={UDim2.fromOffset(props.width ?? 296, 30)}
          Text={label}
          className="bg-surface-100 text-ink text-sm text-left pl-2.5"
        />
      )}
    </Select.Item>
  );
}

function GroupLabel(props: { text: string }) {
  return (
    <Select.Label asChild>
      <textlabel Size={UDim2.fromOffset(300, 18)} Text={props.text} className="text-ink-400 text-sm text-left" />
    </Select.Label>
  );
}

function TriggerButton(props: { label: string; placeholder: string; disabled?: boolean }) {
  return (
    <Select.Trigger asChild disabled={props.disabled}>
      <textbutton AutoButtonColor={false} Text="" className="w-80 h-10 bg-surface text-ink text-base">
        <textlabel
          Position={UDim2.fromOffset(12, 0)}
          Size={UDim2.fromOffset(84, 40)}
          Text={props.label}
          className="text-ink-400 text-sm text-left"
        />
        <Select.Value asChild placeholder={props.placeholder}>
          {props.disabled === true ? (
            <textlabel
              Position={UDim2.fromOffset(88, 0)}
              Size={UDim2.fromOffset(220, 40)}
              className="text-ink-400 text-base text-left"
            />
          ) : (
            <textlabel
              Position={UDim2.fromOffset(88, 0)}
              Size={UDim2.fromOffset(220, 40)}
              className="text-ink text-base text-left"
            />
          )}
        </Select.Value>
      </textbutton>
    </Select.Trigger>
  );
}

export function SelectBasicScene() {
  const [controlledOpen, setControlledOpen] = React.useState(false);
  const [controlledValue, setControlledValue] = React.useState("alpha");

  return (
    <frame className="w-235 h-180 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(920, 28)}
        Text="Select: single choice with controlled state and outside dismiss"
        className="text-ink text-xl text-left"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(920, 24)}
        Text={`Controlled open: ${controlledOpen ? "true" : "false"} | Controlled value: ${controlledValue}`}
        className="text-ink-400 text-base text-left"
      />

      <frame
        AutomaticSize={Enum.AutomaticSize.Y}
        className="top-19 w-225 bg-surface rounded-lg px-3 pt-3 pb-4 flex-col gap-5"
      >
        {/* Controlled + grouped options with multiple labels and separators */}
        <frame AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={1} className="w-215 bg-transparent flex-col gap-2">
          <SectionHeader text="Controlled + grouped options" />

          <Select.Root
            onOpenChange={setControlledOpen}
            onValueChange={setControlledValue}
            open={controlledOpen}
            value={controlledValue}
          >
            <TriggerButton label="Mode" placeholder="Pick a mode" />

            <Select.Portal>
              <Select.Content asChild sideOffset={8} placement="bottom">
                <frame className="w-80 h-63.5 bg-surface rounded-md p-2 flex-col gap-1.5">
                  <Select.Group asChild>
                    <frame
                      AutomaticSize={Enum.AutomaticSize.Y}
                      LayoutOrder={1}
                      className="w-75 bg-transparent flex-col gap-1"
                    >
                      <GroupLabel text="Rendering" />
                      <OptionItem value="alpha" />
                      <OptionItem value="beta" />
                      <OptionItem disabled label="gamma (Disabled)" value="gamma" />
                    </frame>
                  </Select.Group>

                  <Select.Separator asChild>
                    <frame LayoutOrder={2} Size={UDim2.fromOffset(300, 1)} className="bg-edge" />
                  </Select.Separator>

                  <Select.Group asChild>
                    <frame
                      AutomaticSize={Enum.AutomaticSize.Y}
                      LayoutOrder={3}
                      className="w-75 bg-transparent flex-col gap-1"
                    >
                      <GroupLabel text="Experimental" />
                      <OptionItem value="delta" />
                      <OptionItem value="epsilon" />
                    </frame>
                  </Select.Group>
                </frame>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </frame>

        {/* Uncontrolled */}
        <frame AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={2} className="w-215 bg-transparent flex-col gap-2">
          <SectionHeader text="Uncontrolled (defaultValue)" />

          <Select.Root defaultValue="beta">
            <TriggerButton label="Quality" placeholder="Pick quality" />

            <Select.Portal>
              <Select.Content asChild sideOffset={8} placement="bottom">
                <frame className="w-80 h-31.5 bg-surface rounded-md p-2 flex-col gap-1">
                  <OptionItem value="low" />
                  <OptionItem value="beta" />
                  <OptionItem value="high" />
                </frame>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </frame>

        {/* Long scrolling list (12 items) */}
        <frame AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={3} className="w-215 bg-transparent flex-col gap-2">
          <SectionHeader text="Long list — scrolls inside Content (12 items)" />

          <Select.Root defaultValue="neon">
            <TriggerButton label="Element" placeholder="Pick element" />

            <Select.Portal>
              <Select.Content asChild sideOffset={8} placement="bottom">
                <frame className="w-80 h-50 bg-surface rounded-md p-2">
                  <scrollingframe
                    Active
                    AutomaticCanvasSize={Enum.AutomaticSize.Y}
                    CanvasSize={new UDim2()}
                    ScrollBarThickness={4}
                    ScrollingDirection={Enum.ScrollingDirection.Y}
                    Size={UDim2.fromScale(1, 1)}
                    className="bg-transparent flex-col gap-1"
                  >
                    {LONG_OPTIONS.map((option) => (
                      <OptionItem key={option} value={option} width={288} />
                    ))}
                  </scrollingframe>
                </frame>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </frame>

        {/* Disabled trigger */}
        <frame AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={4} className="w-215 bg-transparent flex-col gap-2">
          <SectionHeader text="Disabled trigger (cannot open)" />

          <Select.Root defaultValue="beta" disabled>
            <TriggerButton disabled label="Locked" placeholder="Unavailable" />

            <Select.Portal>
              <Select.Content asChild sideOffset={8} placement="bottom">
                <frame className="w-80 h-24 bg-surface rounded-md p-2 flex-col gap-1">
                  <OptionItem value="alpha" />
                  <OptionItem value="beta" />
                </frame>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </frame>
      </frame>
    </frame>
  );
}
