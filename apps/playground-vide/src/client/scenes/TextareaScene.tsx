import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, useTheme } from "@lattice-ui/vide-style";
import { Textarea } from "@lattice-ui/vide-textarea";
import { panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

const MAX_LENGTH = 240;

export function TextareaScene() {
  const { theme } = useTheme();
  const body = Vide.source("Lattice UI ships behaviour, not appearance.\nType here to watch the box grow.");
  const committed = Vide.source(body());

  const remaining = () => MAX_LENGTH - body().size();
  const overLimit = () => remaining() < 0;

  return (
    <SceneRoot
      title="Textarea — auto-resize between a minimum and maximum row count"
      summary={() => `${body().size()}/${MAX_LENGTH} characters · committed ${committed().size()}`}
    >
      <ScenePanel heading="RELEASE NOTE" order={1} width={680}>
        <Textarea.Root
          value={body}
          autoResize
          minRows={3}
          maxRows={8}
          invalid={overLimit}
          onValueChange={(nextValue) => body(nextValue)}
          onValueCommit={(nextValue) => committed(nextValue)}
        >
          {() => (
            <frame
              AutomaticSize={Enum.AutomaticSize.Y}
              BackgroundTransparency={1}
              LayoutOrder={1}
              Size={UDim2.fromOffset(636, 0)}
            >
              <uilistlayout
                FillDirection={Enum.FillDirection.Vertical}
                Padding={() => new UDim(0, theme().space[6])}
                SortOrder={Enum.SortOrder.LayoutOrder}
              />
              <Textarea.Label
                AutoButtonColor={false}
                BackgroundTransparency={1}
                LayoutOrder={1}
                Size={UDim2.fromOffset(636, 20)}
                Text="WHAT CHANGED"
                TextColor3={() => theme().colors.textSecondary}
                TextSize={() => theme().typography.labelSm.textSize}
                TextXAlignment={Enum.TextXAlignment.Left}
              />
              <Textarea.Input
                {...bindDerivedProps<TextBox>(() =>
                  mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                    ClearTextOnFocus: false,
                    LayoutOrder: 2,
                    Size: UDim2.fromOffset(600, 72),
                    TextColor3: theme().colors.textPrimary,
                    TextSize: theme().typography.bodyMd.textSize,
                    TextXAlignment: Enum.TextXAlignment.Left,
                    TextYAlignment: Enum.TextYAlignment.Top,
                  }),
                )}
              >
                {() => [
                  <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />,
                  <uipadding
                    PaddingBottom={() => new UDim(0, theme().space[8])}
                    PaddingLeft={() => new UDim(0, theme().space[10])}
                    PaddingRight={() => new UDim(0, theme().space[10])}
                    PaddingTop={() => new UDim(0, theme().space[8])}
                  />,
                ]}
              </Textarea.Input>
              <Textarea.Description
                BackgroundTransparency={1}
                LayoutOrder={3}
                Size={UDim2.fromOffset(636, 18)}
                Text={() =>
                  overLimit()
                    ? `${-remaining()} characters over the limit.`
                    : `${remaining()} characters left. The box stops growing at eight rows.`
                }
                TextColor3={() => (overLimit() ? theme().colors.danger : theme().colors.textSecondary)}
                TextSize={() => theme().typography.labelSm.textSize}
                TextXAlignment={Enum.TextXAlignment.Left}
              />
            </frame>
          )}
        </Textarea.Root>
        <SceneReadout
          order={2}
          text="The resize pass runs twice per edit: TextBounds lags the change that caused it."
        />
      </ScenePanel>
    </SceneRoot>
  );
}
