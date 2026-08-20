import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { Toast, useToast } from "@lattice-ui/vide-toast";
import { buttonRecipe, panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

function ToastControls() {
  const { theme } = useTheme();
  const toast = useToast();
  const counter = Vide.source(0);

  const push = (durationMs?: number) => {
    counter(counter() + 1);
    toast.enqueue({
      title: `Build #${counter()}`,
      description: durationMs === undefined ? "Stays until dismissed." : `Clears itself in ${durationMs / 1000}s.`,
      durationMs,
    });
  };

  return (
    <frame BackgroundTransparency={1} LayoutOrder={1} Size={UDim2.fromOffset(636, 44)}>
      <uilistlayout
        FillDirection={Enum.FillDirection.Horizontal}
        Padding={() => new UDim(0, theme().space[8])}
        SortOrder={Enum.SortOrder.LayoutOrder}
        VerticalAlignment={Enum.VerticalAlignment.Center}
      />
      <textbutton
        {...bindDerivedProps<TextButton>(() =>
          mergeGuiProps(buttonRecipe({ intent: "primary", size: "sm" }, theme()), {
            LayoutOrder: 1,
            Size: UDim2.fromOffset(180, 36),
            Text: "Toast (4s)",
          }),
        )}
        Activated={() => push(4000)}
      >
        <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />
      </textbutton>
      <textbutton
        {...bindDerivedProps<TextButton>(() =>
          mergeGuiProps(buttonRecipe({ intent: "surface", size: "sm" }, theme()), {
            LayoutOrder: 2,
            Size: UDim2.fromOffset(180, 36),
            Text: "Sticky toast",
          }),
        )}
        Activated={() => push(undefined)}
      >
        <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />
      </textbutton>
    </frame>
  );
}

function ToastStack() {
  const { theme } = useTheme();
  const toast = useToast();

  return (
    <Toast.Viewport
      AnchorPoint={new Vector2(1, 1)}
      BackgroundTransparency={1}
      Position={UDim2.fromScale(1, 1)}
      Size={UDim2.fromOffset(320, 400)}
    >
      {() => [
        <uilistlayout
          FillDirection={Enum.FillDirection.Vertical}
          HorizontalAlignment={Enum.HorizontalAlignment.Right}
          Padding={() => new UDim(0, theme().space[8])}
          SortOrder={Enum.SortOrder.LayoutOrder}
          VerticalAlignment={Enum.VerticalAlignment.Bottom}
        />,
        // Keyed by the record rather than by position: a toast leaving the middle of the stack must
        // not hand its scope — and its id — to the one that slides up into its place.
        Vide.values(toast.visibleToasts, (record, index) => (
          <Toast.Root
            visible={() => record.exiting !== true}
            onExitComplete={() => toast.finalize(record.id)}
            {...bindDerivedProps<Frame>(() =>
              mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                LayoutOrder: index(),
                Size: UDim2.fromOffset(300, 74),
              }),
            )}
          >
            {() => [
              <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />,
              <uipadding
                PaddingBottom={() => new UDim(0, theme().space[10])}
                PaddingLeft={() => new UDim(0, theme().space[12])}
                PaddingRight={() => new UDim(0, theme().space[12])}
                PaddingTop={() => new UDim(0, theme().space[10])}
              />,
              <Toast.Title
                BackgroundTransparency={1}
                Size={UDim2.fromOffset(200, 20)}
                Text={record.title ?? ""}
                TextColor3={() => theme().colors.textPrimary}
                TextSize={() => theme().typography.bodyMd.textSize}
                TextXAlignment={Enum.TextXAlignment.Left}
              />,
              <Toast.Description
                BackgroundTransparency={1}
                Position={UDim2.fromOffset(0, 24)}
                Size={UDim2.fromOffset(276, 30)}
                Text={record.description ?? ""}
                TextColor3={() => theme().colors.textSecondary}
                TextSize={() => theme().typography.labelSm.textSize}
                TextWrapped
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Top}
              />,
              <Toast.Close
                toastId={record.id}
                AutoButtonColor={false}
                BackgroundTransparency={1}
                Position={UDim2.fromOffset(252, -2)}
                Size={UDim2.fromOffset(24, 24)}
                Text="×"
                TextColor3={() => theme().colors.textSecondary}
                TextSize={() => theme().typography.bodyMd.textSize + 4}
              />,
            ]}
          </Toast.Root>
        )),
      ]}
    </Toast.Viewport>
  );
}

export function ToastScene() {
  return (
    <SceneRoot
      title="Toast — a queue with a visible window and a timer per entry"
      summary="Push more than three and the rest wait their turn."
    >
      <Toast.Provider defaultDurationMs={4000} maxVisible={3}>
        {() => (
          <ScenePanel heading="BUILD NOTIFICATIONS" order={1}>
            <ToastControls />
            <ToastStack />
            <SceneReadout order={3} text="A sticky toast has no timer; closing it lets a queued one through." />
          </ScenePanel>
        )}
      </Toast.Provider>
    </SceneRoot>
  );
}
