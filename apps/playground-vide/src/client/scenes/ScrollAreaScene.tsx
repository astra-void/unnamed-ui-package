import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { ScrollArea } from "@lattice-ui/vide-scroll-area";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

const LINES: string[] = [];
for (let index = 1; index <= 24; index++) {
  LINES.push(`Commit ${index} — behaviour moved into a framework-free core.`);
}

export function ScrollAreaScene() {
  const { theme } = useTheme();

  return (
    <SceneRoot
      title="ScrollArea — a scrollbar that hides when nothing is happening"
      summary='type="scroll" shows the bar while scrolling and hides it after the idle delay.'
    >
      <ScenePanel heading="CHANGELOG" order={1}>
        <ScrollArea.Root type="scroll" scrollHideDelayMs={800}>
          {() => (
            <frame
              {...bindDerivedProps<Frame>(() =>
                mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                  LayoutOrder: 1,
                  Size: UDim2.fromOffset(636, 240),
                }),
              )}
            >
              <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />
              <ScrollArea.Viewport
                AutomaticCanvasSize={Enum.AutomaticSize.Y}
                CanvasSize={new UDim2()}
                Position={UDim2.fromOffset(0, 0)}
                Size={UDim2.fromOffset(620, 240)}
              >
                {() => [
                  <uilistlayout
                    FillDirection={Enum.FillDirection.Vertical}
                    Padding={() => new UDim(0, theme().space[4])}
                    SortOrder={Enum.SortOrder.LayoutOrder}
                  />,
                  <uipadding
                    PaddingBottom={() => new UDim(0, theme().space[10])}
                    PaddingLeft={() => new UDim(0, theme().space[12])}
                    PaddingRight={() => new UDim(0, theme().space[12])}
                    PaddingTop={() => new UDim(0, theme().space[10])}
                  />,
                  ...LINES.map((line, index) => (
                    <Text
                      BackgroundTransparency={1}
                      LayoutOrder={index + 1}
                      Size={UDim2.fromOffset(580, 22)}
                      Text={line}
                      TextColor3={() => theme().colors.textSecondary}
                      TextSize={() => theme().typography.bodyMd.textSize}
                      TextXAlignment={Enum.TextXAlignment.Left}
                      truncate
                    />
                  )),
                ]}
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar
                orientation="vertical"
                BackgroundColor3={() => theme().colors.surface}
                BorderSizePixel={0}
                Position={UDim2.fromOffset(624, 4)}
                Size={UDim2.fromOffset(8, 232)}
              >
                {() => [
                  <uicorner CornerRadius={new UDim(1, 0)} />,
                  <ScrollArea.Thumb
                    orientation="vertical"
                    BackgroundColor3={() => theme().colors.accent}
                    BorderSizePixel={0}
                  >
                    {() => <uicorner CornerRadius={new UDim(1, 0)} />}
                  </ScrollArea.Thumb>,
                ]}
              </ScrollArea.Scrollbar>
            </frame>
          )}
        </ScrollArea.Root>
        <SceneReadout order={2} text="Thumb size and position are geometry computed from the canvas, not appearance." />
      </ScenePanel>
    </SceneRoot>
  );
}
