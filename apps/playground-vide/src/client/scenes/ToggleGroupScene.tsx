import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, useTheme } from "@lattice-ui/vide-style";
import { ToggleGroup } from "@lattice-ui/vide-toggle-group";
import { buttonRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

const MARKS = [
  { value: "bold", text: "Bold" },
  { value: "italic", text: "Italic" },
  { value: "underline", text: "Underline" },
];

const ALIGNMENTS = [
  { value: "left", text: "Left" },
  { value: "center", text: "Center" },
  { value: "right", text: "Right" },
];

function ToggleButton(props: { value: string; text: string; order: number; active: () => boolean }) {
  const { theme } = useTheme();

  return (
    <ToggleGroup.Item
      value={props.value}
      {...bindDerivedProps<TextButton>(() =>
        mergeGuiProps(buttonRecipe({ intent: props.active() ? "primary" : "surface", size: "sm" }, theme()), {
          LayoutOrder: props.order,
          Size: UDim2.fromOffset(130, 34),
          Text: props.text,
        }),
      )}
    >
      {() => <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />}
    </ToggleGroup.Item>
  );
}

export function ToggleGroupScene() {
  const { theme } = useTheme();
  const marks = Vide.source<string[]>(["bold"]);
  const alignment = Vide.source<string | undefined>("left");

  const isMarked = (value: string) => marks().includes(value);

  return (
    <SceneRoot
      title="ToggleGroup — multiple and single selection"
      summary={() => `Marks: ${marks().size() > 0 ? marks().join(", ") : "none"} · Align: ${alignment() ?? "none"}`}
    >
      <ScenePanel heading="TEXT MARKS (MULTIPLE)" order={1}>
        <ToggleGroup.Root type="multiple" value={marks} onValueChange={(nextValue) => marks(nextValue)}>
          {() => (
            <frame BackgroundTransparency={1} LayoutOrder={1} Size={UDim2.fromOffset(636, 34)}>
              <uilistlayout
                FillDirection={Enum.FillDirection.Horizontal}
                Padding={() => new UDim(0, theme().space[8])}
                SortOrder={Enum.SortOrder.LayoutOrder}
              />
              {MARKS.map((mark, index) => (
                <ToggleButton
                  value={mark.value}
                  text={mark.text}
                  order={index + 1}
                  active={() => isMarked(mark.value)}
                />
              ))}
            </frame>
          )}
        </ToggleGroup.Root>
      </ScenePanel>

      <ScenePanel heading="ALIGNMENT (SINGLE, DESELECTABLE)" order={2}>
        <ToggleGroup.Root type="single" value={alignment} onValueChange={(nextValue) => alignment(nextValue)}>
          {() => (
            <frame BackgroundTransparency={1} LayoutOrder={1} Size={UDim2.fromOffset(636, 34)}>
              <uilistlayout
                FillDirection={Enum.FillDirection.Horizontal}
                Padding={() => new UDim(0, theme().space[8])}
                SortOrder={Enum.SortOrder.LayoutOrder}
              />
              {ALIGNMENTS.map((option, index) => (
                <ToggleButton
                  value={option.value}
                  text={option.text}
                  order={index + 1}
                  active={() => alignment() === option.value}
                />
              ))}
            </frame>
          )}
        </ToggleGroup.Root>
        <SceneReadout order={2} text="Pressing the active item again clears the single group." />
      </ScenePanel>
    </SceneRoot>
  );
}
