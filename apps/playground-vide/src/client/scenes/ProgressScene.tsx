import { Progress } from "@lattice-ui/vide-progress";
import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { panelRecipe } from "../theme/recipes";
import { SceneButton, ScenePanel, SceneReadout, SceneRoot } from "./parts";

export function ProgressScene() {
  const { theme } = useTheme();
  const value = Vide.source(35);
  const indeterminate = Vide.source(false);

  return (
    <SceneRoot
      title="Progress — a determinate bar, an indeterminate one and a spinner"
      summary={() => (indeterminate() ? "Indeterminate: length is unknown." : `Uploading ${math.floor(value())}%`)}
    >
      <ScenePanel heading="UPLOAD" order={1}>
        <Progress.Root value={value} max={100} indeterminate={indeterminate}>
          {() => (
            <frame BackgroundTransparency={1} LayoutOrder={1} Size={UDim2.fromOffset(636, 24)}>
              <frame
                {...bindDerivedProps<Frame>(() =>
                  mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                    Position: UDim2.fromOffset(0, 8),
                    Size: UDim2.fromOffset(560, 10),
                  }),
                )}
              >
                <uicorner CornerRadius={new UDim(1, 0)} />
                {/* The indicator's width is the primitive's; only the paint is the demo's. */}
                <Progress.Indicator
                  BackgroundColor3={() => theme().colors.accent}
                  BorderSizePixel={0}
                  transition={{ settle: { tempo: "swift" } }}
                >
                  {() => <uicorner CornerRadius={new UDim(1, 0)} />}
                </Progress.Indicator>
              </frame>
            </frame>
          )}
        </Progress.Root>
        <SceneButton label="+15%" order={2} onActivated={() => value(math.min(100, value() + 15))} intent="primary" />
        <SceneButton label="Reset" order={3} onActivated={() => value(0)} />
        <SceneButton
          label={() => (indeterminate() ? "Show a known length" : "Make it indeterminate")}
          order={4}
          onActivated={() => indeterminate(!indeterminate())}
        />
      </ScenePanel>

      <ScenePanel heading="SPINNER" order={2}>
        <frame BackgroundTransparency={1} LayoutOrder={1} Size={UDim2.fromOffset(636, 48)}>
          <Progress.Spinner
            BackgroundTransparency={1}
            Position={UDim2.fromOffset(0, 6)}
            Size={UDim2.fromOffset(36, 36)}
            speedDegPerSecond={220}
          >
            {() => (
              <Text
                BackgroundTransparency={1}
                Size={UDim2.fromScale(1, 1)}
                Text="◜"
                TextColor3={() => theme().colors.accent}
                TextSize={() => theme().typography.titleMd.textSize + 10}
              />
            )}
          </Progress.Spinner>
          <Text
            BackgroundTransparency={1}
            Position={UDim2.fromOffset(52, 6)}
            Size={UDim2.fromOffset(400, 36)}
            Text="The spinner owns the rotation; the glyph inside it is yours."
            TextColor3={() => theme().colors.textSecondary}
            TextSize={() => theme().typography.bodyMd.textSize}
            TextXAlignment={Enum.TextXAlignment.Left}
          />
        </frame>
        <SceneReadout order={2} text="Response motion eases the bar toward its target instead of snapping." />
      </ScenePanel>
    </SceneRoot>
  );
}
