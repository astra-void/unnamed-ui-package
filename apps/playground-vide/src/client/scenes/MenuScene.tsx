import { Menu } from "@lattice-ui/vide-menu";
import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { buttonRecipe, menuItemRecipe, panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

type Action = { id: string; text: string; danger?: boolean; disabled?: boolean };

const FILE_ACTIONS: Action[] = [
  { id: "rename", text: "Rename" },
  { id: "duplicate", text: "Duplicate" },
  { id: "export", text: "Export…", disabled: true },
];

const DANGER_ACTIONS: Action[] = [{ id: "delete", text: "Delete", danger: true }];

function ActionItem(props: { action: Action; order: number; onSelect: (id: string) => void }) {
  const { theme } = useTheme();

  return (
    <Menu.Item
      disabled={props.action.disabled}
      onSelect={() => props.onSelect(props.action.id)}
      {...bindDerivedProps<TextButton>(() =>
        mergeGuiProps(
          menuItemRecipe(
            {
              intent: props.action.danger === true ? "danger" : "default",
              disabled: props.action.disabled === true ? "true" : "false",
            },
            theme(),
          ),
          {
            LayoutOrder: props.order,
            Size: UDim2.fromOffset(200, 30),
            Text: props.action.text,
          },
        ),
      )}
    >
      {() => (
        <uipadding
          PaddingLeft={() => new UDim(0, theme().space[10])}
          PaddingRight={() => new UDim(0, theme().space[10])}
        />
      )}
    </Menu.Item>
  );
}

export function MenuScene() {
  const { theme } = useTheme();
  const lastAction = Vide.source("none");

  return (
    <SceneRoot
      title="Menu — grouped items, a separator and a disabled entry"
      summary={() => `Last action: ${lastAction()}`}
    >
      <ScenePanel heading="FILE MENU" order={1}>
        <Menu.Root>
          {() => [
            <Menu.Trigger
              {...bindDerivedProps<TextButton>(() =>
                mergeGuiProps(buttonRecipe({ intent: "primary", size: "sm" }, theme()), {
                  LayoutOrder: 1,
                  Size: UDim2.fromOffset(160, 36),
                  Text: "File",
                }),
              )}
            >
              {() => <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />}
            </Menu.Trigger>,
            <Menu.Portal>
              {() => (
                <Menu.Content
                  placement="bottom"
                  sideOffset={6}
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
                    <Menu.Group LayoutOrder={1} AutomaticSize={Enum.AutomaticSize.Y} Size={UDim2.fromOffset(200, 0)}>
                      {() => [
                        <uilistlayout
                          FillDirection={Enum.FillDirection.Vertical}
                          Padding={() => new UDim(0, theme().space[2])}
                          SortOrder={Enum.SortOrder.LayoutOrder}
                        />,
                        <Menu.Label
                          BackgroundTransparency={1}
                          LayoutOrder={1}
                          Size={UDim2.fromOffset(200, 20)}
                          Text="THIS FILE"
                          TextColor3={() => theme().colors.textSecondary}
                          TextSize={() => theme().typography.labelSm.textSize}
                          TextXAlignment={Enum.TextXAlignment.Left}
                        />,
                        ...FILE_ACTIONS.map((action, index) => (
                          <ActionItem action={action} order={index + 2} onSelect={(id) => lastAction(id)} />
                        )),
                      ]}
                    </Menu.Group>,
                    <Menu.Separator
                      BackgroundColor3={() => theme().colors.border}
                      BorderSizePixel={0}
                      LayoutOrder={2}
                      Size={UDim2.fromOffset(200, 1)}
                    />,
                    ...DANGER_ACTIONS.map((action, index) => (
                      <ActionItem action={action} order={index + 3} onSelect={(id) => lastAction(id)} />
                    )),
                  ]}
                </Menu.Content>
              )}
            </Menu.Portal>,
          ]}
        </Menu.Root>
        <SceneReadout order={2} text="Highlight follows the pointer and the keyboard; a disabled item takes neither." />
      </ScenePanel>
    </SceneRoot>
  );
}
