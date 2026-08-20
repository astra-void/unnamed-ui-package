import { MotionProvider } from "@lattice-ui/vide-motion";
import { Popover } from "@lattice-ui/vide-popover";
import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { buttonRecipe, panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

const REVEAL = {
  initial: { BackgroundTransparency: 1, Position: UDim2.fromOffset(0, 12) },
  reveal: {
    values: { BackgroundTransparency: 0, Position: UDim2.fromOffset(0, 0) },
    intent: { tempo: "swift" as const },
  },
  exit: {
    values: { BackgroundTransparency: 1, Position: UDim2.fromOffset(0, 8) },
    intent: { tempo: "swift" as const },
  },
};

function AnimatedPopover(props: { label: string; order: number }) {
  const { theme } = useTheme();

  return (
    <Popover.Root>
      {() => [
        <Popover.Trigger
          {...bindDerivedProps<TextButton>(() =>
            mergeGuiProps(buttonRecipe({ intent: "primary", size: "sm" }, theme()), {
              LayoutOrder: props.order,
              Size: UDim2.fromOffset(200, 36),
              Text: props.label,
            }),
          )}
        >
          {() => <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />}
        </Popover.Trigger>,
        <Popover.Portal>
          {() => (
            <Popover.Content
              placement="bottom"
              sideOffset={8}
              transition={REVEAL}
              {...bindDerivedProps<Frame>(() =>
                mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                  Size: UDim2.fromOffset(240, 72),
                }),
              )}
            >
              {() => [
                <uicorner CornerRadius={() => new UDim(0, theme().radius.lg)} />,
                <Text
                  BackgroundTransparency={1}
                  Size={UDim2.fromScale(1, 1)}
                  Text="Presence timing is the primitive's. This fade is the demo's."
                  TextColor3={() => theme().colors.textSecondary}
                  TextSize={() => theme().typography.labelSm.textSize}
                  TextWrapped
                />,
              ]}
            </Popover.Content>
          )}
        </Popover.Portal>,
      ]}
    </Popover.Root>
  );
}

export function MotionScene() {
  const { theme } = useTheme();
  const motionOff = Vide.source(false);

  return (
    <SceneRoot
      title="Motion — a reveal, an exit, and a policy that can switch both off"
      summary={() => (motionOff() ? "Motion is disabled: the layer appears at its final values." : "Motion is on.")}
    >
      {/* The provider's preferences are derivable, so flipping this source reaches every layer under
          it without the tree being rebuilt. */}
      <MotionProvider disableAllMotion={motionOff}>
        {() => (
          <ScenePanel heading="LAYER TRANSITIONS" order={1}>
            <frame BackgroundTransparency={1} LayoutOrder={1} Size={UDim2.fromOffset(636, 44)}>
              <uilistlayout
                FillDirection={Enum.FillDirection.Horizontal}
                Padding={() => new UDim(0, theme().space[8])}
                SortOrder={Enum.SortOrder.LayoutOrder}
                VerticalAlignment={Enum.VerticalAlignment.Center}
              />
              <AnimatedPopover label="Open with motion" order={1} />
              <textbutton
                {...bindDerivedProps<TextButton>(() =>
                  mergeGuiProps(buttonRecipe({ intent: "surface", size: "sm" }, theme()), {
                    LayoutOrder: 2,
                    Size: UDim2.fromOffset(220, 36),
                    Text: motionOff() ? "Motion · off" : "Motion · on",
                  }),
                )}
                Activated={() => motionOff(!motionOff())}
              >
                <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />
              </textbutton>
            </frame>
            <SceneReadout
              order={2}
              text="A reduced-motion system setting disables it too, and that one can change while the UI is up."
            />
          </ScenePanel>
        )}
      </MotionProvider>
    </SceneRoot>
  );
}
