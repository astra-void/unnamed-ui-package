import { Accordion } from "@lattice-ui/vide-accordion";
import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { buttonRecipe, panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

const SECTIONS = [
  { value: "install", title: "Installation", body: "Add the package, then wire the provider your framework needs." },
  { value: "theming", title: "Theming", body: "Tokens live in the theme; a recipe turns a variant into props." },
  { value: "motion", title: "Motion", body: "Presence timing belongs to the primitive; the animation is yours." },
];

export function AccordionScene() {
  const { theme } = useTheme();
  const open = Vide.source<string | string[]>("install");

  const isOpen = (value: string) => {
    const current = open();
    return typeIs(current, "table") ? (current as string[]).includes(value) : current === value;
  };

  return (
    <SceneRoot
      title="Accordion — one section at a time, and collapsible"
      summary={() => `Open: ${typeIs(open(), "table") ? (open() as string[]).join(", ") : (open() as string)}`}
    >
      <ScenePanel heading="DOCUMENTATION" order={1}>
        <Accordion.Root type="single" collapsible value={open} onValueChange={(nextValue) => open(nextValue)}>
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
              {SECTIONS.map((section, index) => (
                <Accordion.Item
                  value={section.value}
                  AutomaticSize={Enum.AutomaticSize.Y}
                  BackgroundTransparency={1}
                  LayoutOrder={index + 1}
                  Size={UDim2.fromOffset(636, 0)}
                >
                  {() => [
                    <uilistlayout
                      FillDirection={Enum.FillDirection.Vertical}
                      Padding={() => new UDim(0, theme().space[4])}
                      SortOrder={Enum.SortOrder.LayoutOrder}
                    />,
                    <Accordion.Header BackgroundTransparency={1} LayoutOrder={1} Size={UDim2.fromOffset(636, 36)}>
                      {() => (
                        <Accordion.Trigger
                          {...bindDerivedProps<TextButton>(() =>
                            mergeGuiProps(buttonRecipe({ intent: "surface", size: "sm" }, theme()), {
                              Size: UDim2.fromOffset(636, 36),
                              Text: `${isOpen(section.value) ? "▾" : "▸"}  ${section.title}`,
                              TextXAlignment: Enum.TextXAlignment.Left,
                            }),
                          )}
                        >
                          {() => [
                            <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />,
                            <uipadding PaddingLeft={() => new UDim(0, theme().space[12])} />,
                          ]}
                        </Accordion.Trigger>
                      )}
                    </Accordion.Header>,
                    <Accordion.Content
                      {...bindDerivedProps<Frame>(() =>
                        mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                          LayoutOrder: 2,
                          Size: UDim2.fromOffset(636, 56),
                        }),
                      )}
                    >
                      {() => [
                        <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />,
                        <uipadding
                          PaddingLeft={() => new UDim(0, theme().space[12])}
                          PaddingRight={() => new UDim(0, theme().space[12])}
                          PaddingTop={() => new UDim(0, theme().space[10])}
                        />,
                        <Text
                          BackgroundTransparency={1}
                          Size={UDim2.fromScale(1, 1)}
                          Text={section.body}
                          TextColor3={() => theme().colors.textSecondary}
                          TextSize={() => theme().typography.bodyMd.textSize}
                          TextWrapped
                          TextXAlignment={Enum.TextXAlignment.Left}
                          TextYAlignment={Enum.TextYAlignment.Top}
                        />,
                      ]}
                    </Accordion.Content>,
                  ]}
                </Accordion.Item>
              ))}
            </frame>
          )}
        </Accordion.Root>
        <SceneReadout
          order={2}
          text="collapsible lets the open section close itself, which a plain single group cannot."
        />
      </ScenePanel>
    </SceneRoot>
  );
}
