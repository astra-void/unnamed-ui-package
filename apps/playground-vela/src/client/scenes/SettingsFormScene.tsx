import { RadioGroup } from "@lattice-ui/react-radio-group";
import { React } from "@lattice-ui/react-runtime";
import { Select } from "@lattice-ui/react-select";
import { Slider } from "@lattice-ui/react-slider";
import { Switch } from "@lattice-ui/react-switch";
import { TextField } from "@lattice-ui/react-text-field";

type SwitchRowProps = {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  layoutOrder: number;
};

function SwitchRow(props: SwitchRowProps) {
  return (
    <frame
      AutomaticSize={Enum.AutomaticSize.Y}
      LayoutOrder={props.layoutOrder}
      Size={UDim2.fromOffset(560, 0)}
      className="bg-transparent"
    >
      <textlabel
        Position={UDim2.fromOffset(0, 2)}
        Size={UDim2.fromOffset(440, 20)}
        Text={props.label}
        className="text-ink text-base text-left"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 24)}
        Size={UDim2.fromOffset(440, 18)}
        Text={props.description}
        className="text-ink-400 text-sm text-left"
      />
      <Switch.Root asChild checked={props.checked} onCheckedChange={props.onCheckedChange}>
        {props.checked ? (
          <textbutton
            AutoButtonColor={false}
            Position={UDim2.fromOffset(510, 8)}
            Text=""
            className="w-11.5 h-6 bg-accent rounded-full"
          >
            <Switch.Thumb asChild>
              <frame className="w-5 h-5 bg-accent-50 rounded-full" />
            </Switch.Thumb>
          </textbutton>
        ) : (
          <textbutton
            AutoButtonColor={false}
            Position={UDim2.fromOffset(510, 8)}
            Text=""
            className="w-11.5 h-6 bg-surface-100 rounded-full"
          >
            <Switch.Thumb asChild>
              <frame className="w-5 h-5 bg-accent-50 rounded-full" />
            </Switch.Thumb>
          </textbutton>
        )}
      </Switch.Root>
    </frame>
  );
}

type SectionProps = {
  title: string;
  layoutOrder: number;
  height?: number;
  children: React.ReactNode;
};

function Section(props: SectionProps) {
  return (
    <frame
      AutomaticSize={props.height !== undefined ? Enum.AutomaticSize.None : Enum.AutomaticSize.Y}
      LayoutOrder={props.layoutOrder}
      Size={UDim2.fromOffset(580, props.height ?? 0)}
      className="bg-transparent flex-col gap-2.5"
    >
      <textlabel
        LayoutOrder={0}
        Size={UDim2.fromOffset(580, 18)}
        Text={props.title}
        className="text-ink-400 text-sm text-left"
      />
      {props.children}
    </frame>
  );
}

const themeOptions = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const densityOptions = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
];

function DensityPill(props: { value: string; label: string; active: boolean }) {
  return (
    <RadioGroup.Item asChild value={props.value}>
      {props.active ? (
        <textbutton
          AutoButtonColor={false}
          Text={props.label}
          className="w-42.5 h-8.5 bg-accent text-accent-50 text-base"
        />
      ) : (
        <textbutton AutoButtonColor={false} Text={props.label} className="w-42.5 h-8.5 bg-surface text-ink text-base" />
      )}
    </RadioGroup.Item>
  );
}

export function SettingsFormScene() {
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [emailEnabled, setEmailEnabled] = React.useState(false);
  const [themeChoice, setThemeChoice] = React.useState("system");
  const [themeOpen, setThemeOpen] = React.useState(false);
  const [density, setDensity] = React.useState("comfortable");
  const [displayName, setDisplayName] = React.useState("Astra");
  const [volume, setVolume] = React.useState(70);
  const [savedSummary, setSavedSummary] = React.useState<string | undefined>(undefined);

  const nameInvalid = displayName.size() < 2;
  const canSave = !nameInvalid;

  const resolvedTheme = themeOptions.find((option) => option.value === themeChoice)?.label ?? themeChoice;

  return (
    <frame className="w-235 h-175 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(920, 28)}
        Text="Settings form: Switch, Select, RadioGroup, TextField and Slider composed into one panel"
        className="text-ink text-xl text-left truncate"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(920, 24)}
        Text={`push=${pushEnabled ? "on" : "off"} | email=${emailEnabled ? "on" : "off"} | theme=${themeChoice} | density=${density} | name="${displayName}" | volume=${math.floor(volume)}`}
        className="text-ink-400 text-base text-left"
      />

      <frame className="top-18 w-155 h-150 bg-surface rounded-lg border border-edge p-4 flex-col gap-5">
        <Section title="NOTIFICATIONS" layoutOrder={1}>
          <SwitchRow
            label="Push notifications"
            description="Receive alerts on this device."
            checked={pushEnabled}
            onCheckedChange={setPushEnabled}
            layoutOrder={1}
          />
          <SwitchRow
            label="Email digest"
            description="A weekly summary sent to your inbox."
            checked={emailEnabled}
            onCheckedChange={setEmailEnabled}
            layoutOrder={2}
          />
        </Section>

        <Section title="APPEARANCE" layoutOrder={2} height={130}>
          <Select.Root onOpenChange={setThemeOpen} onValueChange={setThemeChoice} open={themeOpen} value={themeChoice}>
            <Select.Trigger asChild>
              <textbutton
                AutoButtonColor={false}
                LayoutOrder={1}
                Text=""
                className="w-70 h-10 bg-surface text-ink text-base"
              >
                <textlabel
                  Position={UDim2.fromOffset(12, 0)}
                  Size={UDim2.fromOffset(80, 40)}
                  Text="Theme"
                  className="text-ink-400 text-sm text-left"
                />
                <Select.Value asChild placeholder="Pick theme">
                  <textlabel
                    Position={UDim2.fromOffset(88, 0)}
                    Size={UDim2.fromOffset(180, 40)}
                    Text={resolvedTheme}
                    className="text-ink text-base text-left"
                  />
                </Select.Value>
              </textbutton>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content asChild placement="bottom" sideOffset={8}>
                <frame className="w-70 h-31.5 bg-surface-100 rounded-md border border-edge p-2 flex-col gap-1">
                  {themeOptions.map((option) => (
                    <Select.Item key={option.value} asChild textValue={option.label} value={option.value}>
                      <textbutton
                        AutoButtonColor={false}
                        Size={UDim2.fromOffset(264, 30)}
                        Text={option.label}
                        className="bg-surface-100 text-ink text-sm text-left pl-2.5"
                      />
                    </Select.Item>
                  ))}
                </frame>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          <RadioGroup.Root onValueChange={setDensity} orientation="horizontal" value={density}>
            <frame LayoutOrder={2} className="w-140 h-8.5 bg-transparent flex-row gap-2">
              {densityOptions.map((option) => (
                <DensityPill
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  active={density === option.value}
                />
              ))}
            </frame>
          </RadioGroup.Root>
        </Section>

        <Section title="PROFILE" layoutOrder={3}>
          <TextField.Root invalid={nameInvalid} onValueChange={setDisplayName} value={displayName}>
            <frame LayoutOrder={1} className="w-140 h-20.5 bg-transparent flex-col gap-1">
              <TextField.Label asChild>
                <textbutton
                  AutoButtonColor={false}
                  Size={UDim2.fromOffset(560, 20)}
                  Text="Display name"
                  className="bg-transparent text-ink text-sm text-left"
                />
              </TextField.Label>
              <TextField.Input asChild>
                {nameInvalid ? (
                  <textbox
                    PlaceholderText="Your name"
                    Size={UDim2.fromOffset(560, 36)}
                    Text={displayName}
                    className="bg-surface-100 text-ink text-base text-left rounded-md border border-danger px-2.5"
                  />
                ) : (
                  <textbox
                    PlaceholderText="Your name"
                    Size={UDim2.fromOffset(560, 36)}
                    Text={displayName}
                    className="bg-surface-100 text-ink text-base text-left rounded-md border border-edge px-2.5"
                  />
                )}
              </TextField.Input>
              <TextField.Message asChild>
                {nameInvalid ? (
                  <textlabel
                    Size={UDim2.fromOffset(560, 16)}
                    Text="Name must be at least 2 characters."
                    className="text-danger text-sm text-left"
                  />
                ) : (
                  <textlabel
                    Size={UDim2.fromOffset(560, 16)}
                    Text="Looks good."
                    className="text-ink-400 text-sm text-left"
                  />
                )}
              </TextField.Message>
            </frame>
          </TextField.Root>

          <frame LayoutOrder={2} className="w-140 h-13 bg-transparent">
            <textlabel
              Size={UDim2.fromOffset(560, 20)}
              Text={`Volume — ${math.floor(volume)}%`}
              className="text-ink text-sm text-left"
            />
            <Slider.Root max={100} min={0} onValueChange={setVolume} step={1} value={volume}>
              <Slider.Track asChild>
                <frame Position={UDim2.fromOffset(0, 30)} className="w-140 h-2.5 bg-surface-100 rounded-full">
                  <Slider.Range asChild>
                    <frame className="bg-accent rounded-full" />
                  </Slider.Range>
                  <Slider.Thumb asChild>
                    <textbutton AutoButtonColor={false} Text="" className="w-4.5 h-4.5 bg-accent-50 rounded-full" />
                  </Slider.Thumb>
                </frame>
              </Slider.Track>
            </Slider.Root>
          </frame>
        </Section>

        <frame LayoutOrder={4} className="w-145 h-11 bg-transparent flex-row items-center gap-2">
          {canSave ? (
            <textbutton
              AutoButtonColor={false}
              Event={{
                Activated: () => {
                  setSavedSummary(`Saved · theme ${themeChoice}, density ${density}, volume ${math.floor(volume)}%`);
                },
              }}
              LayoutOrder={1}
              Text="Save changes"
              className="w-37.5 h-10 bg-accent text-accent-50 text-base"
            />
          ) : (
            <textbutton
              Active={false}
              AutoButtonColor={false}
              LayoutOrder={1}
              Text="Save changes"
              className="w-37.5 h-10 bg-surface text-ink-400 text-base"
            />
          )}
          <textbutton
            AutoButtonColor={false}
            Event={{
              Activated: () => {
                setPushEnabled(true);
                setEmailEnabled(false);
                setThemeChoice("system");
                setDensity("comfortable");
                setDisplayName("Astra");
                setVolume(70);
                setSavedSummary(undefined);
              },
            }}
            LayoutOrder={2}
            Text="Reset"
            className="w-30 h-10 bg-surface text-ink text-base"
          />
        </frame>
      </frame>

      {savedSummary !== undefined ? (
        <frame
          Position={UDim2.fromOffset(652, 72)}
          className="w-70 h-18 bg-surface-100 rounded-md border border-accent px-3 pt-2.5"
        >
          <textlabel Size={UDim2.fromOffset(256, 20)} Text="Settings saved" className="text-ink text-sm text-left" />
          <textlabel
            Position={UDim2.fromOffset(0, 24)}
            Size={UDim2.fromOffset(256, 36)}
            Text={savedSummary}
            TextWrapped={true}
            className="text-ink-400 text-sm text-left align-top"
          />
        </frame>
      ) : undefined}
    </frame>
  );
}
