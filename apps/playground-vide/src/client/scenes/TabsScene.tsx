import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { Tabs } from "@lattice-ui/vide-tabs";
import { buttonRecipe, panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

const PANELS = [
  { value: "overview", label: "Overview", body: "One core drives both layers; this panel is the Vide one." },
  { value: "activity", label: "Activity", body: "Selection settles once the whole batch of triggers has registered." },
  { value: "settings", label: "Settings", body: "Directional navigation steps along the list and escapes across it." },
];

export function TabsScene() {
  const { theme } = useTheme();
  const active = Vide.source("overview");

  return (
    <SceneRoot title="Tabs — one selected panel, ordered navigation" summary={() => `Active tab: ${active()}`}>
      <ScenePanel heading="PROJECT" order={1}>
        <Tabs.Root value={active} onValueChange={(nextValue) => active(nextValue)}>
          {() => [
            <Tabs.List BackgroundTransparency={1} LayoutOrder={1} Size={UDim2.fromOffset(636, 40)}>
              {() => [
                <uilistlayout
                  FillDirection={Enum.FillDirection.Horizontal}
                  Padding={() => new UDim(0, theme().space[8])}
                  SortOrder={Enum.SortOrder.LayoutOrder}
                  VerticalAlignment={Enum.VerticalAlignment.Center}
                />,
                ...PANELS.map((panel, index) => (
                  <Tabs.Trigger
                    value={panel.value}
                    {...bindDerivedProps<TextButton>(() =>
                      mergeGuiProps(
                        buttonRecipe({ intent: active() === panel.value ? "primary" : "surface", size: "sm" }, theme()),
                        {
                          LayoutOrder: index + 1,
                          Size: UDim2.fromOffset(150, 34),
                          Text: panel.label,
                        },
                      ),
                    )}
                  >
                    {() => <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />}
                  </Tabs.Trigger>
                )),
              ]}
            </Tabs.List>,
            ...PANELS.map((panel) => (
              <Tabs.Content
                value={panel.value}
                {...bindDerivedProps<Frame>(() =>
                  mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                    LayoutOrder: 2,
                    Size: UDim2.fromOffset(636, 96),
                  }),
                )}
              >
                {() => [
                  <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />,
                  <uipadding
                    PaddingBottom={() => new UDim(0, theme().space[12])}
                    PaddingLeft={() => new UDim(0, theme().space[12])}
                    PaddingRight={() => new UDim(0, theme().space[12])}
                    PaddingTop={() => new UDim(0, theme().space[12])}
                  />,
                  <Text
                    BackgroundTransparency={1}
                    Size={UDim2.fromScale(1, 1)}
                    Text={panel.body}
                    TextColor3={() => theme().colors.textSecondary}
                    TextSize={() => theme().typography.bodyMd.textSize}
                    TextWrapped
                    TextXAlignment={Enum.TextXAlignment.Left}
                    TextYAlignment={Enum.TextYAlignment.Top}
                  />,
                ]}
              </Tabs.Content>
            )),
          ]}
        </Tabs.Root>
        <SceneReadout order={3} text="Only the selected panel is mounted; forceMount keeps a panel alive instead." />
      </ScenePanel>
    </SceneRoot>
  );
}
