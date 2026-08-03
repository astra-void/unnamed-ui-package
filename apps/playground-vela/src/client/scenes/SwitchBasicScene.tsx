import { React } from "@lattice-ui/react-runtime";
import { Switch } from "@lattice-ui/react-switch";

// The thumb sits inside the track by 2px on every side: 26 - 2 * 2 = 22 tall, and the travel is the
// padded width minus the thumb. The primitive centers the thumb and parks it on the track's edges,
// so the inset is padding on the track (`p-0.5`), never a nudge on the thumb — motion owns the
// thumb's placement and would overwrite it.
const THUMB = "w-5.5 h-5.5 bg-accent-50 rounded-full";
const TRACK = "w-11.5 h-6.5 rounded-full p-0.5";

function toSwitchLabel(checked: boolean) {
  return checked ? "on" : "off";
}

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

/** A settings row: title + description on the left, a consumer-owned switch on the right. */
function SettingRow(props: {
  order: number;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  // `TRACK` is a plain constant, not a literal at the JSX site, so these class
  // values are dynamic and take vela's runtime path. Everything they carry —
  // `bg-*`, `rounded-*`, `w-*`, `h-*`, `p-*` — is in the runtime resolver's
  // supported set, which is why the constants only hold those families.
  const trackClass = props.disabled
    ? `${TRACK} bg-surface-100`
    : props.checked
      ? `${TRACK} bg-accent`
      : `${TRACK} bg-surface-100`;

  return (
    <frame LayoutOrder={props.order} Size={UDim2.fromOffset(610, 46)} className="bg-transparent">
      {props.disabled === true ? (
        <textlabel
          Position={UDim2.fromOffset(0, 2)}
          Size={UDim2.fromOffset(540, 20)}
          Text={props.title}
          className="text-ink-400 text-base text-left"
        />
      ) : (
        <textlabel
          Position={UDim2.fromOffset(0, 2)}
          Size={UDim2.fromOffset(540, 20)}
          Text={props.title}
          className="text-ink text-base text-left"
        />
      )}
      <textlabel
        Position={UDim2.fromOffset(0, 24)}
        Size={UDim2.fromOffset(540, 18)}
        Text={props.description}
        className="text-ink-400 text-sm text-left"
      />
      <Switch.Root asChild checked={props.checked} disabled={props.disabled} onCheckedChange={props.onCheckedChange}>
        <textbutton
          AnchorPoint={new Vector2(1, 0.5)}
          AutoButtonColor={false}
          Position={new UDim2(1, 0, 0.5, 0)}
          Text=""
          className={trackClass}
        >
          <Switch.Thumb asChild>
            <frame className={THUMB} />
          </Switch.Thumb>
        </textbutton>
      </Switch.Root>
    </frame>
  );
}

const SETTINGS = [
  { title: "Wi-Fi", description: "Connect to available networks automatically" },
  { title: "Bluetooth", description: "Discoverable while settings is open" },
  { title: "Airplane mode", description: "Disable all wireless radios" },
];

export function SwitchBasicScene() {
  const [passthroughStyled, setPassthroughStyled] = React.useState(false);
  const [asChildStyled, setAsChildStyled] = React.useState(false);
  const [settings, setSettings] = React.useState<Array<boolean>>([true, false, false]);

  const enabledCount = settings.filter((value) => value).size();

  const setSettingAt = React.useCallback((index: number, nextValue: boolean) => {
    setSettings((current) => current.map((value, i) => (i === index ? nextValue : value)));
  }, []);

  return (
    <frame className="w-230 h-155 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(860, 28)}
        Text="Switch: settings rows + consumer-owned styling (passthrough props vs asChild)"
        className="text-ink text-xl text-left truncate"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(860, 22)}
        Text={`Passthrough-styled: ${toSwitchLabel(passthroughStyled)} | asChild-styled: ${toSwitchLabel(asChildStyled)} | Settings enabled ${enabledCount}/${settings.size()}`}
        className="text-ink-400 text-base text-left"
      />

      <frame className="top-17 w-230 h-135 bg-transparent flex-col gap-4">
        {/* Settings list */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={1}
          className="w-160 bg-surface rounded-lg p-3 flex-col gap-1.5"
        >
          <SectionHeader text="SETTINGS" order={1} />
          {settings.map((enabled, index) => (
            <SettingRow
              key={`setting-${index}`}
              order={2 + index}
              title={SETTINGS[index].title}
              description={SETTINGS[index].description}
              checked={enabled}
              onCheckedChange={(nextChecked) => {
                setSettingAt(index, nextChecked);
              }}
            />
          ))}
          <SettingRow order={20} title="Developer mode" description="Locked by administrator" checked={true} disabled />
        </frame>

        {/* Consumer-owned styling: passthrough props vs asChild */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={2}
          className="w-160 bg-surface rounded-lg p-3 flex-col gap-2"
        >
          <SectionHeader text="CONSUMER-OWNED STYLING" order={1} />

          {/*
            The primitive is unstyled: it neutralizes Roblox instance defaults and nothing else.
            Every color below is picked by this scene from the current `checked`/`disabled` state.
            Route 1 - style the primitive's own instances. `Switch.Root` is a component, so vela
            resolves the class list and hands it over as ordinary props — which works only because
            the primitive forwards what it does not consume down to a host element.
          */}
          <frame LayoutOrder={2} Size={UDim2.fromOffset(610, 44)} className="bg-transparent">
            {passthroughStyled ? (
              <Switch.Root
                checked={true}
                onCheckedChange={setPassthroughStyled}
                Position={UDim2.fromOffset(0, 9)}
                className="w-11.5 h-6.5 bg-accent rounded-full p-0.5"
              >
                <Switch.Thumb className="w-5.5 h-5.5 bg-accent-50 rounded-full" />
              </Switch.Root>
            ) : (
              <Switch.Root
                checked={false}
                onCheckedChange={setPassthroughStyled}
                Position={UDim2.fromOffset(0, 9)}
                className="w-11.5 h-6.5 bg-surface-100 rounded-full p-0.5"
              >
                <Switch.Thumb className="w-5.5 h-5.5 bg-accent-50 rounded-full" />
              </Switch.Root>
            )}
            <textlabel
              Position={UDim2.fromOffset(56, 0)}
              Size={UDim2.fromOffset(540, 44)}
              Text={`Passthrough props on the primitive: ${toSwitchLabel(passthroughStyled)}`}
              className="text-ink text-base text-left"
            />
          </frame>

          {/* Route 2 - hand the primitive your own instances with `asChild`. */}
          <frame LayoutOrder={3} Size={UDim2.fromOffset(610, 44)} className="bg-transparent">
            <Switch.Root asChild checked={asChildStyled} onCheckedChange={setAsChildStyled}>
              {asChildStyled ? (
                <textbutton
                  AutoButtonColor={false}
                  Position={UDim2.fromOffset(0, 9)}
                  Text=""
                  className="w-11.5 h-6.5 bg-accent rounded-full p-0.5"
                >
                  <Switch.Thumb asChild>
                    <frame className="w-5.5 h-5.5 bg-accent-50 rounded-full" />
                  </Switch.Thumb>
                </textbutton>
              ) : (
                <textbutton
                  AutoButtonColor={false}
                  Position={UDim2.fromOffset(0, 9)}
                  Text=""
                  className="w-11.5 h-6.5 bg-surface-100 rounded-full p-0.5"
                >
                  <Switch.Thumb asChild>
                    <frame className="w-5.5 h-5.5 bg-accent-50 rounded-full" />
                  </Switch.Thumb>
                </textbutton>
              )}
            </Switch.Root>
            <textlabel
              Position={UDim2.fromOffset(56, 0)}
              Size={UDim2.fromOffset(540, 44)}
              Text={`asChild with your own instances: ${toSwitchLabel(asChildStyled)}`}
              className="text-ink text-base text-left"
            />
          </frame>

          {/* `disabled` is behavior only - the muted palette is this scene's choice. */}
          <frame LayoutOrder={4} Size={UDim2.fromOffset(610, 44)} className="bg-transparent">
            <Switch.Root asChild checked={true} disabled>
              <textbutton
                AutoButtonColor={false}
                Position={UDim2.fromOffset(0, 9)}
                Text=""
                className="w-11.5 h-6.5 bg-surface-100 rounded-full p-0.5"
              >
                <Switch.Thumb asChild>
                  <frame className="w-5.5 h-5.5 bg-ink-400 rounded-full" />
                </Switch.Thumb>
              </textbutton>
            </Switch.Root>
            <textlabel
              Position={UDim2.fromOffset(56, 0)}
              Size={UDim2.fromOffset(540, 44)}
              Text="Disabled: the consumer supplies the muted palette"
              className="text-ink-400 text-base text-left"
            />
          </frame>
        </frame>
      </frame>
    </frame>
  );
}
