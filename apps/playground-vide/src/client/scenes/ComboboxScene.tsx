import { Combobox } from "@lattice-ui/vide-combobox";
import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { menuItemRecipe, panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

const LANGUAGES = ["TypeScript", "Luau", "Rust", "Go", "Python", "Kotlin", "Swift", "Elixir", "Zig", "OCaml"];

export function ComboboxScene() {
  const { theme } = useTheme();
  const language = Vide.source<string | undefined>("Luau");
  const query = Vide.source("");

  return (
    <SceneRoot
      title="Combobox — typing filters the list, selecting fills the input"
      summary={() => `Selected: ${language() ?? "nothing"} · Query "${query()}"`}
    >
      <ScenePanel heading="PRIMARY LANGUAGE" order={1}>
        <Combobox.Root
          value={language}
          inputValue={query}
          onValueChange={(nextValue) => language(nextValue)}
          onInputValueChange={(nextValue) => query(nextValue)}
        >
          {() => [
            <Combobox.Input
              {...bindDerivedProps<TextBox>(() =>
                mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                  ClearTextOnFocus: false,
                  LayoutOrder: 1,
                  PlaceholderText: "Start typing…",
                  Size: UDim2.fromOffset(320, 36),
                  TextColor3: theme().colors.textPrimary,
                  TextSize: theme().typography.bodyMd.textSize,
                  TextXAlignment: Enum.TextXAlignment.Left,
                }),
              )}
            >
              {() => [
                <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />,
                <uipadding
                  PaddingLeft={() => new UDim(0, theme().space[10])}
                  PaddingRight={() => new UDim(0, theme().space[10])}
                />,
              ]}
            </Combobox.Input>,
            <Combobox.Portal>
              {() => (
                <Combobox.Content
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
                    ...LANGUAGES.map((option, index) => (
                      <Combobox.Item
                        value={option}
                        {...bindDerivedProps<TextButton>(() =>
                          mergeGuiProps(menuItemRecipe({ intent: "default", disabled: "false" }, theme()), {
                            LayoutOrder: index + 1,
                            Size: UDim2.fromOffset(304, 30),
                            Text: option,
                          }),
                        )}
                      >
                        {() => (
                          <uipadding
                            PaddingLeft={() => new UDim(0, theme().space[10])}
                            PaddingRight={() => new UDim(0, theme().space[10])}
                          />
                        )}
                      </Combobox.Item>
                    )),
                  ]}
                </Combobox.Content>
              )}
            </Combobox.Portal>,
          ]}
        </Combobox.Root>
        <SceneReadout
          order={2}
          text="The core tells its own write to the input apart from the player typing, so filtering does not fight the selection."
        />
      </ScenePanel>
    </SceneRoot>
  );
}
