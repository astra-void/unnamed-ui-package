import { React } from "@lattice-ui/react-runtime";
import { Tabs } from "@lattice-ui/react-tabs";

type DemoTabKey = "overview" | "activity" | "settings";
type ManualTabKey = "alpha" | "beta" | "gamma";

function PanelBody(props: { heading: string; lines: Array<string>; mutedHeading?: boolean }) {
  return (
    <React.Fragment>
      {/*
        The sibling scene puts the panel chrome here as `uicorner`/`uipadding`/
        `uilistlayout` children, which a Fragment can carry. Utilities cannot:
        `rounded-md p-2.5 flex-col gap-1.5` has to live on the element that owns
        the helpers, so it moved up to each `Tabs.Content` frame below.
      */}
      {props.mutedHeading === true ? (
        <textlabel
          LayoutOrder={1}
          Size={UDim2.fromOffset(600, 24)}
          Text={props.heading}
          className="text-ink-400 text-base text-left"
        />
      ) : (
        <textlabel
          LayoutOrder={1}
          Size={UDim2.fromOffset(600, 24)}
          Text={props.heading}
          className="text-ink text-base text-left"
        />
      )}
      {props.lines.map((line, index) => (
        <textlabel
          key={`${index}`}
          LayoutOrder={index + 2}
          Size={UDim2.fromOffset(600, 18)}
          Text={line}
          className="text-ink-400 text-sm text-left"
        />
      ))}
    </React.Fragment>
  );
}

export function TabsBasicScene() {
  const [primaryValue, setPrimaryValue] = React.useState<DemoTabKey>("overview");
  const [secondaryValue, setSecondaryValue] = React.useState<ManualTabKey>("alpha");

  return (
    <frame className="w-230 h-160 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(900, 28)}
        Text="Tabs: horizontal + vertical orientation, a disabled tab, forceMount content, and rich panels."
        className="text-ink text-xl text-left truncate"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(900, 22)}
        Text={`Primary: ${primaryValue} | Secondary: ${secondaryValue}`}
        className="text-ink-400 text-base text-left"
      />

      <frame className="top-17.5 w-225 h-62.5 bg-transparent">
        <textlabel
          Size={UDim2.fromOffset(820, 20)}
          Text="Horizontal orientation (Settings tab is disabled)"
          className="text-ink-400 text-sm text-left"
        />

        <Tabs.Root onValueChange={(nextValue) => setPrimaryValue(nextValue as DemoTabKey)} value={primaryValue}>
          <Tabs.List asChild>
            <frame Position={UDim2.fromOffset(0, 26)} className="w-160 h-10 bg-transparent flex-row gap-2">
              <Tabs.Trigger asChild value="overview">
                {primaryValue === "overview" ? (
                  <textbutton
                    AutoButtonColor={false}
                    Text="Overview"
                    className="w-30 h-8.5 bg-accent text-accent-50 text-base"
                  />
                ) : (
                  <textbutton
                    AutoButtonColor={false}
                    Text="Overview"
                    className="w-30 h-8.5 bg-surface text-ink text-base"
                  />
                )}
              </Tabs.Trigger>

              <Tabs.Trigger asChild value="activity">
                {primaryValue === "activity" ? (
                  <textbutton
                    AutoButtonColor={false}
                    Text="Activity"
                    className="w-30 h-8.5 bg-accent text-accent-50 text-base"
                  />
                ) : (
                  <textbutton
                    AutoButtonColor={false}
                    Text="Activity"
                    className="w-30 h-8.5 bg-surface text-ink text-base"
                  />
                )}
              </Tabs.Trigger>

              <Tabs.Trigger asChild disabled value="settings">
                <textbutton
                  Active={false}
                  AutoButtonColor={false}
                  AutomaticSize={Enum.AutomaticSize.X}
                  Selectable={false}
                  Size={new UDim2(0, 0, 0, 34)}
                  Text="Settings (Disabled)"
                  className="bg-surface text-ink-400 text-base px-3"
                />
              </Tabs.Trigger>
            </frame>
          </Tabs.List>

          <Tabs.Content asChild value="overview">
            <frame
              Position={UDim2.fromOffset(0, 82)}
              className="w-160 h-37.5 bg-surface rounded-md p-2.5 flex-col gap-1.5"
            >
              <PanelBody
                heading="Overview"
                lines={["Status: healthy", "Active sessions: 128", "Uptime: 99.98% over 30 days"]}
              />
            </frame>
          </Tabs.Content>

          <Tabs.Content asChild value="activity">
            <frame
              Position={UDim2.fromOffset(0, 82)}
              className="w-160 h-37.5 bg-surface rounded-md p-2.5 flex-col gap-1.5"
            >
              <PanelBody
                heading="Activity"
                lines={["Deploy #4821 succeeded 5m ago", "3 pull requests merged today", "Alerts: none"]}
              />
            </frame>
          </Tabs.Content>

          <Tabs.Content asChild value="settings">
            <frame
              Position={UDim2.fromOffset(0, 82)}
              className="w-160 h-37.5 bg-surface rounded-md p-2.5 flex-col gap-1.5"
            >
              <PanelBody heading="Settings" mutedHeading lines={["Disabled tabs remain unavailable until enabled."]} />
            </frame>
          </Tabs.Content>
        </Tabs.Root>
      </frame>

      <frame className="top-84.5 w-225 h-65 bg-transparent">
        <textlabel
          Size={UDim2.fromOffset(860, 20)}
          Text="Vertical orientation (Alpha uses forceMount, arrow keys move up/down)"
          className="text-ink-400 text-sm text-left"
        />

        <Tabs.Root
          defaultValue="alpha"
          onValueChange={(nextValue) => setSecondaryValue(nextValue as ManualTabKey)}
          orientation="vertical"
        >
          <frame Position={UDim2.fromOffset(0, 26)} className="w-220 h-50 bg-transparent">
            <Tabs.List asChild>
              <frame className="w-45 h-45 bg-transparent flex-col gap-2">
                <Tabs.Trigger asChild value="alpha">
                  {secondaryValue === "alpha" ? (
                    <textbutton
                      AutoButtonColor={false}
                      Text="Alpha"
                      className="w-42.5 h-8.5 bg-accent text-accent-50 text-base"
                    />
                  ) : (
                    <textbutton
                      AutoButtonColor={false}
                      Text="Alpha"
                      className="w-42.5 h-8.5 bg-surface text-ink text-base"
                    />
                  )}
                </Tabs.Trigger>

                <Tabs.Trigger asChild value="beta">
                  {secondaryValue === "beta" ? (
                    <textbutton
                      AutoButtonColor={false}
                      Text="Beta"
                      className="w-42.5 h-8.5 bg-accent text-accent-50 text-base"
                    />
                  ) : (
                    <textbutton
                      AutoButtonColor={false}
                      Text="Beta"
                      className="w-42.5 h-8.5 bg-surface text-ink text-base"
                    />
                  )}
                </Tabs.Trigger>

                <Tabs.Trigger asChild value="gamma">
                  {secondaryValue === "gamma" ? (
                    <textbutton
                      AutoButtonColor={false}
                      Text="Gamma"
                      className="w-42.5 h-8.5 bg-accent text-accent-50 text-base"
                    />
                  ) : (
                    <textbutton
                      AutoButtonColor={false}
                      Text="Gamma"
                      className="w-42.5 h-8.5 bg-surface text-ink text-base"
                    />
                  )}
                </Tabs.Trigger>
              </frame>
            </Tabs.List>

            <Tabs.Content asChild forceMount value="alpha">
              <frame
                Position={UDim2.fromOffset(196, 0)}
                className="w-165 h-45 bg-surface-100 rounded-md p-2.5 flex-col gap-1.5"
              >
                <PanelBody
                  heading="Alpha (forceMount = true)"
                  lines={[
                    "This panel stays mounted even when another tab is active,",
                    "so its scroll position and inputs survive tab switches.",
                    "Region: us-east | Replicas: 3 | Queue depth: 12",
                  ]}
                />
              </frame>
            </Tabs.Content>

            <Tabs.Content asChild value="beta">
              <frame
                Position={UDim2.fromOffset(196, 0)}
                className="w-165 h-45 bg-surface-100 rounded-md p-2.5 flex-col gap-1.5"
              >
                <PanelBody
                  heading="Beta"
                  lines={["Mounted on demand when selected.", "Region: eu-west | Replicas: 2 | Queue depth: 4"]}
                />
              </frame>
            </Tabs.Content>

            <Tabs.Content asChild value="gamma">
              <frame
                Position={UDim2.fromOffset(196, 0)}
                className="w-165 h-45 bg-surface-100 rounded-md p-2.5 flex-col gap-1.5"
              >
                <PanelBody
                  heading="Gamma"
                  lines={["Mounted on demand when selected.", "Region: ap-south | Replicas: 1 | Queue depth: 0"]}
                />
              </frame>
            </Tabs.Content>
          </frame>
        </Tabs.Root>
      </frame>
    </frame>
  );
}
