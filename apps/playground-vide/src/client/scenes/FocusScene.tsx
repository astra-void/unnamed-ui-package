import { FocusScope } from "@lattice-ui/vide-focus";
import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { buttonRecipe, panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

function FocusTarget(props: { label: string; order: number; onActivated: () => void }) {
  const { theme } = useTheme();

  return (
    <textbutton
      {...bindDerivedProps<TextButton>(() =>
        mergeGuiProps(buttonRecipe({ intent: "surface", size: "sm" }, theme()), {
          LayoutOrder: props.order,
          Selectable: true,
          Size: UDim2.fromOffset(180, 36),
          Text: props.label,
        }),
      )}
      Activated={props.onActivated}
    >
      <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />
    </textbutton>
  );
}

export function FocusScene() {
  const { theme } = useTheme();
  const trapped = Vide.source(false);
  const lastPressed = Vide.source("none");

  return (
    <SceneRoot
      title="FocusScope — ordered navigation, and a trap you can turn on"
      summary={() => `Trapped: ${trapped() ? "yes" : "no"} · Last pressed: ${lastPressed()}`}
    >
      <ScenePanel heading="TOOLBAR SCOPE" order={1}>
        <FocusScope trapped={trapped} navStrategy="ordered" navOrientation="horizontal" navWrap>
          {() => (
            <frame
              {...bindDerivedProps<Frame>(() =>
                mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                  LayoutOrder: 1,
                  Size: UDim2.fromOffset(636, 60),
                }),
              )}
            >
              <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />
              <uilistlayout
                FillDirection={Enum.FillDirection.Horizontal}
                Padding={() => new UDim(0, theme().space[8])}
                SortOrder={Enum.SortOrder.LayoutOrder}
                VerticalAlignment={Enum.VerticalAlignment.Center}
              />
              <uipadding PaddingLeft={() => new UDim(0, theme().space[12])} />
              <FocusTarget label="Cut" order={1} onActivated={() => lastPressed("Cut")} />
              <FocusTarget label="Copy" order={2} onActivated={() => lastPressed("Copy")} />
              <FocusTarget label="Paste" order={3} onActivated={() => lastPressed("Paste")} />
            </frame>
          )}
        </FocusScope>
        <textbutton
          {...bindDerivedProps<TextButton>(() =>
            mergeGuiProps(buttonRecipe({ intent: trapped() ? "danger" : "primary", size: "sm" }, theme()), {
              LayoutOrder: 2,
              Size: UDim2.fromOffset(220, 36),
              Text: trapped() ? "Release the trap" : "Trap focus in the toolbar",
            }),
          )}
          Activated={() => trapped(!trapped())}
        >
          <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />
        </textbutton>
        <SceneReadout
          order={3}
          text="An ordered scope steps along its axis and hands cross-axis moves back to its parent."
        />
      </ScenePanel>
    </SceneRoot>
  );
}
