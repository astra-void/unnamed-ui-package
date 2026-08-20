import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { Select } from "@lattice-ui/vide-select";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { buttonRecipe, menuItemRecipe, panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

const REGIONS = [
  { value: "us-east", text: "US East (Ohio)" },
  { value: "us-west", text: "US West (Oregon)" },
  { value: "eu-central", text: "EU Central (Frankfurt)" },
  { value: "ap-northeast", text: "Asia Pacific (Seoul)" },
  { value: "sa-east", text: "South America (São Paulo)" },
];

export function SelectScene() {
  const { theme } = useTheme();
  const region = Vide.source("eu-central");

  return (
    <SceneRoot
      title="Select — a value that keeps its label after the popup closes"
      summary={() => `Region: ${region()}`}
    >
      <ScenePanel heading="DEPLOYMENT REGION" order={1}>
        <Select.Root value={region} onValueChange={(nextValue) => region(nextValue)}>
          {() => [
            <Select.Trigger
              {...bindDerivedProps<TextButton>(() =>
                mergeGuiProps(buttonRecipe({ intent: "surface", size: "sm" }, theme()), {
                  LayoutOrder: 1,
                  Size: UDim2.fromOffset(320, 36),
                  Text: "",
                }),
              )}
            >
              {() => [
                <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />,
                <uipadding
                  PaddingLeft={() => new UDim(0, theme().space[10])}
                  PaddingRight={() => new UDim(0, theme().space[10])}
                />,
                <Select.Value
                  BackgroundTransparency={1}
                  placeholder="Pick a region"
                  Size={UDim2.fromScale(1, 1)}
                  TextColor3={() => theme().colors.textPrimary}
                  TextSize={() => theme().typography.bodyMd.textSize}
                  TextXAlignment={Enum.TextXAlignment.Left}
                />,
              ]}
            </Select.Trigger>,
            <Select.Portal>
              {() => (
                <Select.Content
                  placement="bottom"
                  sideOffset={6}
                  {...bindDerivedProps<Frame>(() =>
                    mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                      AutomaticSize: Enum.AutomaticSize.Y,
                      Size: UDim2.fromOffset(320, 0),
                    }),
                  )}
                >
                  {() => [
                    <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />,
                    <uipadding
                      PaddingBottom={() => new UDim(0, theme().space[6])}
                      PaddingLeft={() => new UDim(0, theme().space[6])}
                      PaddingRight={() => new UDim(0, theme().space[6])}
                      PaddingTop={() => new UDim(0, theme().space[6])}
                    />,
                    <uilistlayout
                      FillDirection={Enum.FillDirection.Vertical}
                      Padding={() => new UDim(0, theme().space[2])}
                      SortOrder={Enum.SortOrder.LayoutOrder}
                    />,
                    ...REGIONS.map((option, index) => (
                      <Select.Item
                        value={option.value}
                        textValue={option.text}
                        {...bindDerivedProps<TextButton>(() =>
                          mergeGuiProps(menuItemRecipe({ intent: "default", disabled: "false" }, theme()), {
                            LayoutOrder: index + 1,
                            Size: UDim2.fromOffset(304, 30),
                            Text: option.text,
                          }),
                        )}
                      >
                        {() => (
                          <uipadding
                            PaddingLeft={() => new UDim(0, theme().space[10])}
                            PaddingRight={() => new UDim(0, theme().space[10])}
                          />
                        )}
                      </Select.Item>
                    )),
                  ]}
                </Select.Content>
              )}
            </Select.Portal>,
          ]}
        </Select.Root>
        <SceneReadout
          order={2}
          text="Items exist only while the popup is open, so the trigger reads the label from a cache."
        />
      </ScenePanel>
    </SceneRoot>
  );
}
