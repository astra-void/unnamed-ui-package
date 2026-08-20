import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { Tooltip } from "@lattice-ui/vide-tooltip";
import { buttonRecipe, panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

function TipTarget(props: { label: string; tip: string; order: number; delayDuration?: number }) {
  const { theme } = useTheme();

  return (
    <Tooltip.Root delayDuration={props.delayDuration}>
      {() => [
        <Tooltip.Trigger
          {...bindDerivedProps<TextButton>(() =>
            mergeGuiProps(buttonRecipe({ intent: "surface", size: "sm" }, theme()), {
              LayoutOrder: props.order,
              Size: UDim2.fromOffset(190, 36),
              Text: props.label,
            }),
          )}
        >
          {() => <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />}
        </Tooltip.Trigger>,
        <Tooltip.Portal>
          {() => (
            <Tooltip.Content
              placement="top"
              sideOffset={8}
              collisionPadding={12}
              {...bindDerivedProps<Frame>(() =>
                mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                  Size: UDim2.fromOffset(220, 40),
                }),
              )}
            >
              {() => [
                <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />,
                <Text
                  BackgroundTransparency={1}
                  Size={UDim2.fromScale(1, 1)}
                  Text={props.tip}
                  TextColor3={() => theme().colors.textPrimary}
                  TextSize={() => theme().typography.labelSm.textSize}
                />,
              ]}
            </Tooltip.Content>
          )}
        </Tooltip.Portal>,
      ]}
    </Tooltip.Root>
  );
}

export function TooltipScene() {
  const { theme } = useTheme();

  return (
    <SceneRoot
      title="Tooltip — the first one waits, the next one does not"
      summary="Hover the first target, then move straight to the second: the group's skip window is already open."
    >
      <ScenePanel heading="TOOLBAR" order={1}>
        <frame BackgroundTransparency={1} LayoutOrder={1} Size={UDim2.fromOffset(636, 44)}>
          <uilistlayout
            FillDirection={Enum.FillDirection.Horizontal}
            Padding={() => new UDim(0, theme().space[8])}
            SortOrder={Enum.SortOrder.LayoutOrder}
            VerticalAlignment={Enum.VerticalAlignment.Center}
          />
          <TipTarget label="Publish" tip="Ships the current build." order={1} />
          <TipTarget label="Roll back" tip="Restores the previous build." order={2} />
          <TipTarget label="Instant tip" tip="This one opens with no delay." order={3} delayDuration={0} />
        </frame>
        <SceneReadout
          order={2}
          text="One provider owns the delay policy; a per-root delayDuration overrides it for that root only."
        />
      </ScenePanel>
    </SceneRoot>
  );
}
