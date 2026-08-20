import type { PopperPlacement } from "@lattice-ui/vide-popover";
import { Popover } from "@lattice-ui/vide-popover";
import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { buttonRecipe, panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

const PLACEMENTS: PopperPlacement[] = ["bottom", "top", "right", "left"];

export function PopoverScene() {
  const { theme } = useTheme();
  const openCount = Vide.source(0);
  const placement = Vide.source<PopperPlacement>("bottom");

  const cyclePlacement = () => {
    const index = PLACEMENTS.indexOf(placement());
    placement(PLACEMENTS[(index + 1) % PLACEMENTS.size()]);
  };

  return (
    <SceneRoot
      title="Popover — portalled content, anchored geometry, dismissal"
      summary={() => `Placement ${placement()} · opened ${openCount()} times`}
    >
      <ScenePanel heading="ANCHORED PANEL" order={1}>
        <frame BackgroundTransparency={1} LayoutOrder={1} Size={UDim2.fromOffset(636, 44)}>
          <uilistlayout
            FillDirection={Enum.FillDirection.Horizontal}
            Padding={() => new UDim(0, theme().space[8])}
            SortOrder={Enum.SortOrder.LayoutOrder}
            VerticalAlignment={Enum.VerticalAlignment.Center}
          />
          <Popover.Root onOpenChange={(open) => open && openCount(openCount() + 1)}>
            {() => [
              <Popover.Trigger
                {...bindDerivedProps<TextButton>(() =>
                  mergeGuiProps(buttonRecipe({ intent: "primary", size: "sm" }, theme()), {
                    LayoutOrder: 1,
                    Size: UDim2.fromOffset(180, 36),
                    Text: "Open details",
                  }),
                )}
              >
                {() => <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />}
              </Popover.Trigger>,
              <Popover.Portal>
                {() => (
                  <Popover.Content
                    placement={placement}
                    sideOffset={8}
                    collisionPadding={12}
                    {...bindDerivedProps<Frame>(() =>
                      mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                        Size: UDim2.fromOffset(280, 132),
                      }),
                    )}
                  >
                    {() => [
                      <uicorner CornerRadius={() => new UDim(0, theme().radius.lg)} />,
                      <uipadding
                        PaddingBottom={() => new UDim(0, theme().space[12])}
                        PaddingLeft={() => new UDim(0, theme().space[12])}
                        PaddingRight={() => new UDim(0, theme().space[12])}
                        PaddingTop={() => new UDim(0, theme().space[12])}
                      />,
                      <Text
                        BackgroundTransparency={1}
                        Size={UDim2.fromOffset(256, 22)}
                        Text="Release channel"
                        TextColor3={() => theme().colors.textPrimary}
                        TextSize={() => theme().typography.bodyMd.textSize}
                        TextXAlignment={Enum.TextXAlignment.Left}
                      />,
                      <Text
                        BackgroundTransparency={1}
                        Position={UDim2.fromOffset(0, 26)}
                        Size={UDim2.fromOffset(256, 44)}
                        Text="Clicking outside dismisses this layer. Escape closes the topmost one first."
                        TextColor3={() => theme().colors.textSecondary}
                        TextSize={() => theme().typography.labelSm.textSize}
                        TextWrapped
                        TextXAlignment={Enum.TextXAlignment.Left}
                        TextYAlignment={Enum.TextYAlignment.Top}
                      />,
                      <Popover.Close
                        {...bindDerivedProps<TextButton>(() =>
                          mergeGuiProps(buttonRecipe({ intent: "surface", size: "sm" }, theme()), {
                            Position: UDim2.fromOffset(0, 78),
                            Size: UDim2.fromOffset(120, 30),
                            Text: "Close",
                          }),
                        )}
                      >
                        {() => <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />}
                      </Popover.Close>,
                    ]}
                  </Popover.Content>
                )}
              </Popover.Portal>,
            ]}
          </Popover.Root>
          <textbutton
            {...bindDerivedProps<TextButton>(() =>
              mergeGuiProps(buttonRecipe({ intent: "surface", size: "sm" }, theme()), {
                LayoutOrder: 2,
                Size: UDim2.fromOffset(220, 36),
                Text: `Placement · ${placement()}`,
              }),
            )}
            Activated={cyclePlacement}
          >
            <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />
          </textbutton>
        </frame>
        <SceneReadout
          order={2}
          text="The content is a ScreenGui of its own, parented to the PlayerGui rather than to the trigger."
        />
      </ScenePanel>
    </SceneRoot>
  );
}
