import { ContextMenu } from "@lattice-ui/vide-context-menu";
import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { menuItemRecipe, panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

const ACTIONS = [
  { id: "open", text: "Open in new tab" },
  { id: "copy", text: "Copy link" },
  { id: "pin", text: "Pin to sidebar" },
];

export function ContextMenuScene() {
  const { theme } = useTheme();
  const lastAction = Vide.source("none");

  return (
    <SceneRoot
      title="ContextMenu — a menu anchored to the pointer, not to a trigger"
      summary={() => `Last action: ${lastAction()}`}
    >
      <ScenePanel heading="RIGHT-CLICK THE CANVAS" order={1}>
        <ContextMenu.Root>
          {() => [
            <ContextMenu.Trigger
              {...bindDerivedProps<TextButton>(() =>
                mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                  AutoButtonColor: false,
                  LayoutOrder: 1,
                  Size: UDim2.fromOffset(600, 180),
                  Text: "Right-click anywhere in this panel",
                  TextColor3: theme().colors.textSecondary,
                  TextSize: theme().typography.bodyMd.textSize,
                }),
              )}
            >
              {() => <uicorner CornerRadius={() => new UDim(0, theme().radius.lg)} />}
            </ContextMenu.Trigger>,
            <ContextMenu.Portal>
              {() => (
                <ContextMenu.Content
                  placement="bottom"
                  sideOffset={2}
                  {...bindDerivedProps<Frame>(() =>
                    mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                      AutomaticSize: Enum.AutomaticSize.Y,
                      Size: UDim2.fromOffset(216, 0),
                    }),
                  )}
                >
                  {() => [
                    <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />,
                    <uipadding
                      PaddingBottom={() => new UDim(0, theme().space[6])}
                      PaddingLeft={() => new UDim(0, theme().space[8])}
                      PaddingRight={() => new UDim(0, theme().space[8])}
                      PaddingTop={() => new UDim(0, theme().space[6])}
                    />,
                    <uilistlayout
                      FillDirection={Enum.FillDirection.Vertical}
                      Padding={() => new UDim(0, theme().space[2])}
                      SortOrder={Enum.SortOrder.LayoutOrder}
                    />,
                    ...ACTIONS.map((action, index) => (
                      <ContextMenu.Item
                        onSelect={() => lastAction(action.id)}
                        {...bindDerivedProps<TextButton>(() =>
                          mergeGuiProps(menuItemRecipe({ intent: "default", disabled: "false" }, theme()), {
                            LayoutOrder: index + 1,
                            Size: UDim2.fromOffset(200, 30),
                            Text: action.text,
                          }),
                        )}
                      >
                        {() => (
                          <uipadding
                            PaddingLeft={() => new UDim(0, theme().space[10])}
                            PaddingRight={() => new UDim(0, theme().space[10])}
                          />
                        )}
                      </ContextMenu.Item>
                    )),
                  ]}
                </ContextMenu.Content>
              )}
            </ContextMenu.Portal>,
          ]}
        </ContextMenu.Root>
        <SceneReadout
          order={2}
          text="The anchor is a one-pixel rectangle at the pointer, so the same popper geometry places it."
        />
      </ScenePanel>
    </SceneRoot>
  );
}
