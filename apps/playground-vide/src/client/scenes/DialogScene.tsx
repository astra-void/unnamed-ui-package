import { Dialog } from "@lattice-ui/vide-dialog";
import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { buttonRecipe, panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

export function DialogScene() {
  const { theme } = useTheme();
  const open = Vide.source(false);
  const deleted = Vide.source(false);

  return (
    <SceneRoot
      title="Dialog — modal surface, focus trap, destructive confirmation"
      summary={() => (deleted() ? "Workspace deleted." : "Nothing has been deleted yet.")}
    >
      <ScenePanel heading="DANGER ZONE" order={1}>
        <Dialog.Root open={open} modal onOpenChange={(nextOpen) => open(nextOpen)}>
          {() => [
            <Dialog.Trigger
              {...bindDerivedProps<TextButton>(() =>
                mergeGuiProps(buttonRecipe({ intent: "danger", size: "sm" }, theme()), {
                  LayoutOrder: 1,
                  Size: UDim2.fromOffset(220, 36),
                  Text: "Delete workspace…",
                }),
              )}
            >
              {() => <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />}
            </Dialog.Trigger>,
            <Dialog.Portal>
              {() => [
                <Dialog.Overlay
                  AutoButtonColor={false}
                  BackgroundColor3={() => theme().colors.overlay}
                  BackgroundTransparency={0.35}
                  BorderSizePixel={0}
                  Size={UDim2.fromScale(1, 1)}
                  Text=""
                />,
                <Dialog.Content
                  trapFocus
                  {...bindDerivedProps<Frame>(() =>
                    mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                      AnchorPoint: new Vector2(0.5, 0.5),
                      Position: UDim2.fromScale(0.5, 0.5),
                      Size: UDim2.fromOffset(420, 190),
                    }),
                  )}
                >
                  {() => [
                    <uicorner CornerRadius={() => new UDim(0, theme().radius.lg)} />,
                    <uipadding
                      PaddingBottom={() => new UDim(0, theme().space[16])}
                      PaddingLeft={() => new UDim(0, theme().space[16])}
                      PaddingRight={() => new UDim(0, theme().space[16])}
                      PaddingTop={() => new UDim(0, theme().space[16])}
                    />,
                    <Text
                      BackgroundTransparency={1}
                      Size={UDim2.fromOffset(388, 26)}
                      Text="Delete this workspace?"
                      TextColor3={() => theme().colors.textPrimary}
                      TextSize={() => theme().typography.titleMd.textSize}
                      TextXAlignment={Enum.TextXAlignment.Left}
                    />,
                    <Text
                      BackgroundTransparency={1}
                      Position={UDim2.fromOffset(0, 34)}
                      Size={UDim2.fromOffset(388, 56)}
                      Text="Every scene, theme and preset in it goes with it. This cannot be undone."
                      TextColor3={() => theme().colors.textSecondary}
                      TextSize={() => theme().typography.bodyMd.textSize}
                      TextWrapped
                      TextXAlignment={Enum.TextXAlignment.Left}
                      TextYAlignment={Enum.TextYAlignment.Top}
                    />,
                    <Dialog.Close
                      {...bindDerivedProps<TextButton>(() =>
                        mergeGuiProps(buttonRecipe({ intent: "surface", size: "sm" }, theme()), {
                          Position: UDim2.fromOffset(0, 108),
                          Size: UDim2.fromOffset(150, 36),
                          Text: "Keep it",
                        }),
                      )}
                    >
                      {() => <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />}
                    </Dialog.Close>,
                    <Dialog.Close
                      {...bindDerivedProps<TextButton>(() =>
                        mergeGuiProps(buttonRecipe({ intent: "danger", size: "sm" }, theme()), {
                          Position: UDim2.fromOffset(162, 108),
                          Size: UDim2.fromOffset(150, 36),
                          Text: "Delete",
                        }),
                      )}
                      Activated={() => deleted(true)}
                    >
                      {() => <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />}
                    </Dialog.Close>,
                  ]}
                </Dialog.Content>,
              ]}
            </Dialog.Portal>,
          ]}
        </Dialog.Root>
        <SceneReadout
          order={2}
          text="Modal blocks pointer input outside the content and restores focus to the trigger on close."
        />
      </ScenePanel>
    </SceneRoot>
  );
}
