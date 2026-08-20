import { bindDerivedProps, PortalProvider, Vide } from "@lattice-ui/vide-runtime";
import { defaultDarkTheme, defaultLightTheme, mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import type { DensityToken } from "@lattice-ui/vide-system";
import { SystemProvider, useSystemTheme } from "@lattice-ui/vide-system";
import { Tooltip } from "@lattice-ui/vide-tooltip";
import type VideTypes from "@rbxts/vide";
import { AccordionScene } from "./scenes/AccordionScene";
import { AvatarScene } from "./scenes/AvatarScene";
import { CheckboxScene } from "./scenes/CheckboxScene";
import { ComboboxScene } from "./scenes/ComboboxScene";
import { ContextMenuScene } from "./scenes/ContextMenuScene";
import { DialogScene } from "./scenes/DialogScene";
import { FocusScene } from "./scenes/FocusScene";
import { MenuScene } from "./scenes/MenuScene";
import { MotionScene } from "./scenes/MotionScene";
import { PopoverScene } from "./scenes/PopoverScene";
import { ProgressScene } from "./scenes/ProgressScene";
import { RadioGroupScene } from "./scenes/RadioGroupScene";
import { ScrollAreaScene } from "./scenes/ScrollAreaScene";
import { SelectScene } from "./scenes/SelectScene";
import { SliderScene } from "./scenes/SliderScene";
import { SwitchScene } from "./scenes/SwitchScene";
import { SystemScene } from "./scenes/SystemScene";
import { TabsScene } from "./scenes/TabsScene";
import { TextareaScene } from "./scenes/TextareaScene";
import { TextFieldScene } from "./scenes/TextFieldScene";
import { ToastScene } from "./scenes/ToastScene";
import { ToggleGroupScene } from "./scenes/ToggleGroupScene";
import { TooltipScene } from "./scenes/TooltipScene";
import { buttonRecipe, panelRecipe, sceneTabRecipe } from "./theme/recipes";

export type SceneKey =
  | "checkbox"
  | "switch"
  | "radio-group"
  | "toggle-group"
  | "text-field"
  | "textarea"
  | "slider"
  | "popover"
  | "tooltip"
  | "dialog"
  | "menu"
  | "context-menu"
  | "select"
  | "combobox"
  | "toast"
  | "tabs"
  | "accordion"
  | "scroll-area"
  | "progress"
  | "avatar"
  | "focus"
  | "motion"
  | "system";

type SceneCategory = "Forms" | "Overlays" | "Navigation" | "Feedback" | "System";

type SceneOption = {
  key: SceneKey;
  label: string;
  description: string;
  category: SceneCategory;
};

const sceneOptions: SceneOption[] = [
  { key: "checkbox", label: "Checkbox", description: "Tri-state parent over three children.", category: "Forms" },
  { key: "switch", label: "Switch", description: "Controlled and disabled switches.", category: "Forms" },
  {
    key: "radio-group",
    label: "RadioGroup",
    description: "Single selection with a disabled option.",
    category: "Forms",
  },
  {
    key: "toggle-group",
    label: "ToggleGroup",
    description: "Multiple and single selection over one group.",
    category: "Forms",
  },
  { key: "text-field", label: "TextField", description: "Validation and read-only write-back.", category: "Forms" },
  { key: "textarea", label: "Textarea", description: "Auto-resize between row bounds.", category: "Forms" },
  { key: "slider", label: "Slider", description: "Continuous, stepped and disabled tracks.", category: "Forms" },
  { key: "popover", label: "Popover", description: "Portalled content with anchored geometry.", category: "Overlays" },
  { key: "tooltip", label: "Tooltip", description: "Group delay and the skip window.", category: "Overlays" },
  { key: "dialog", label: "Dialog", description: "Modal surface with a focus trap.", category: "Overlays" },
  { key: "menu", label: "Menu", description: "Groups, a separator and a disabled item.", category: "Overlays" },
  {
    key: "context-menu",
    label: "ContextMenu",
    description: "A menu anchored to the pointer.",
    category: "Overlays",
  },
  { key: "select", label: "Select", description: "A label that survives the popup closing.", category: "Overlays" },
  { key: "combobox", label: "Combobox", description: "Typing filters, selecting fills.", category: "Overlays" },
  { key: "toast", label: "Toast", description: "A queue with a visible window.", category: "Overlays" },
  { key: "tabs", label: "Tabs", description: "One panel at a time, ordered navigation.", category: "Navigation" },
  { key: "accordion", label: "Accordion", description: "Single and collapsible sections.", category: "Navigation" },
  {
    key: "scroll-area",
    label: "ScrollArea",
    description: "A scrollbar that hides while idle.",
    category: "Navigation",
  },
  {
    key: "progress",
    label: "Progress",
    description: "Determinate, indeterminate and a spinner.",
    category: "Feedback",
  },
  { key: "avatar", label: "Avatar", description: "A fallback that waits before appearing.", category: "Feedback" },
  { key: "focus", label: "FocusScope", description: "Ordered navigation and a focus trap.", category: "System" },
  { key: "motion", label: "Motion", description: "A policy that switches transitions off.", category: "System" },
  { key: "system", label: "Style & System", description: "Tokens, layout and a density scope.", category: "System" },
];

const sceneComponents = {
  checkbox: CheckboxScene,
  switch: SwitchScene,
  "radio-group": RadioGroupScene,
  "toggle-group": ToggleGroupScene,
  "text-field": TextFieldScene,
  textarea: TextareaScene,
  slider: SliderScene,
  popover: PopoverScene,
  tooltip: TooltipScene,
  dialog: DialogScene,
  menu: MenuScene,
  "context-menu": ContextMenuScene,
  select: SelectScene,
  combobox: ComboboxScene,
  toast: ToastScene,
  tabs: TabsScene,
  accordion: AccordionScene,
  "scroll-area": ScrollAreaScene,
  progress: ProgressScene,
  avatar: AvatarScene,
  focus: FocusScene,
  motion: MotionScene,
  system: SystemScene,
} satisfies Record<SceneKey, () => VideTypes.Node>;

const densityOrder: DensityToken[] = ["compact", "comfortable", "spacious"];

function nextDensity(current: DensityToken): DensityToken {
  const index = densityOrder.indexOf(current);
  return densityOrder[((index >= 0 ? index : 0) + 1) % densityOrder.size()];
}

export type PlaygroundWorkspaceProps = {
  playerGui: PlayerGui;
  initialScene?: SceneKey;
};

/**
 * Tracks the topbar inset.
 *
 * The workspace paints full-bleed, so the header would otherwise sit under the Roblox topbar. The
 * inset is not always known on the first frame, which is why this follows the signal rather than
 * reading once.
 */
function useTopInset() {
  const guiService = game.GetService("GuiService");
  const inset = Vide.source(0);

  const update = () => {
    const [topLeftInset] = guiService.GetGuiInset();
    inset(topLeftInset.Y);
  };

  update();
  const connection = guiService.GetPropertyChangedSignal("TopbarInset").Connect(update);
  Vide.cleanup(connection);

  return inset;
}

function SceneTab(props: { option: SceneOption; activeScene: () => SceneKey; onSelect: (key: SceneKey) => void }) {
  const { theme } = useTheme();
  const selected = () => props.activeScene() === props.option.key;

  return (
    <textbutton
      {...bindDerivedProps<TextButton>(() =>
        mergeGuiProps(sceneTabRecipe({ selected: selected() ? "true" : "false" }, theme()), {
          AutomaticSize: Enum.AutomaticSize.None,
          Size: new UDim2(1, 0, 0, 32),
          Text: props.option.label,
          TextXAlignment: Enum.TextXAlignment.Left,
        }),
      )}
      Activated={() => props.onSelect(props.option.key)}
    >
      <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />
      <uipadding
        PaddingLeft={() => new UDim(0, theme().space[10])}
        PaddingRight={() => new UDim(0, theme().space[8])}
      />
    </textbutton>
  );
}

function AppContent(props: { activeScene: Vide.Source<SceneKey>; darkMode: Vide.Source<boolean> }) {
  const { theme, density, setDensity } = useSystemTheme();
  const topInset = useTopInset();
  const activeScene = props.activeScene;

  const activeMeta = () => sceneOptions.find((scene) => scene.key === activeScene()) ?? sceneOptions[0];

  const outerPadding = () => theme().space[16];
  const headerHeight = 96;
  const navWidth = 260;

  return (
    <screengui IgnoreGuiInset={true} ResetOnSpawn={false}>
      <frame
        BackgroundColor3={() => theme().colors.background}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0, 0)}
        Size={UDim2.fromScale(1, 1)}
      >
        <uigradient
          Color={() =>
            new ColorSequence([
              new ColorSequenceKeypoint(0, theme().colors.background),
              new ColorSequenceKeypoint(1, theme().colors.surfaceElevated),
            ])
          }
          Rotation={90}
        />

        {/* Header */}
        <frame
          {...bindDerivedProps<Frame>(() =>
            mergeGuiProps(panelRecipe({ tone: "surface" }, theme()), {
              Position: UDim2.fromOffset(outerPadding(), outerPadding() + topInset()),
              Size: new UDim2(1, -outerPadding() * 2, 0, headerHeight),
            }),
          )}
        >
          <uicorner CornerRadius={() => new UDim(0, theme().radius.lg)} />
          <uipadding
            PaddingBottom={() => new UDim(0, theme().space[12])}
            PaddingLeft={() => new UDim(0, theme().space[16])}
            PaddingRight={() => new UDim(0, theme().space[16])}
            PaddingTop={() => new UDim(0, theme().space[12])}
          />

          <frame BackgroundTransparency={1} Size={new UDim2(1, -280, 1, 0)}>
            <Text
              BackgroundTransparency={1}
              Size={new UDim2(1, 0, 0, 28)}
              Text="Lattice UI — Vide Playground"
              TextColor3={() => theme().colors.textPrimary}
              TextSize={() => theme().typography.titleMd.textSize + 4}
              TextXAlignment={Enum.TextXAlignment.Left}
            />
            <Text
              BackgroundTransparency={1}
              Position={UDim2.fromOffset(0, 34)}
              Size={new UDim2(1, 0, 0, 22)}
              Text={() => `${activeMeta().category} / ${activeMeta().description}`}
              TextColor3={() => theme().colors.textSecondary}
              TextSize={() => theme().typography.bodyMd.textSize}
              TextXAlignment={Enum.TextXAlignment.Left}
              truncate
            />
            <Text
              BackgroundTransparency={1}
              Position={UDim2.fromOffset(0, 58)}
              Size={new UDim2(1, 0, 0, 18)}
              Text={() => `Every primitive here runs on the same core the React layer uses.`}
              TextColor3={() => theme().colors.textSecondary}
              TextSize={() => theme().typography.labelSm.textSize}
              TextXAlignment={Enum.TextXAlignment.Left}
              truncate
            />
          </frame>

          <frame
            AnchorPoint={new Vector2(1, 0)}
            AutomaticSize={Enum.AutomaticSize.X}
            BackgroundTransparency={1}
            Position={new UDim2(1, 0, 0, 0)}
            Size={new UDim2(0, 0, 0, 36)}
          >
            <uilistlayout
              FillDirection={Enum.FillDirection.Horizontal}
              HorizontalAlignment={Enum.HorizontalAlignment.Right}
              Padding={() => new UDim(0, theme().space[8])}
              SortOrder={Enum.SortOrder.LayoutOrder}
              VerticalAlignment={Enum.VerticalAlignment.Center}
            />
            <textbutton
              {...bindDerivedProps<TextButton>(() =>
                mergeGuiProps(buttonRecipe({ intent: "primary", size: "sm" }, theme()), {
                  AutomaticSize: Enum.AutomaticSize.X,
                  LayoutOrder: 1,
                  Size: new UDim2(0, 0, 0, 34),
                  Text: props.darkMode() ? "Theme · Dark" : "Theme · Light",
                }),
              )}
              Activated={() => props.darkMode(!props.darkMode())}
            >
              <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />
              <uipadding
                PaddingLeft={() => new UDim(0, theme().space[16])}
                PaddingRight={() => new UDim(0, theme().space[16])}
              />
            </textbutton>
            <textbutton
              {...bindDerivedProps<TextButton>(() =>
                mergeGuiProps(buttonRecipe({ intent: "surface", size: "sm" }, theme()), {
                  AutomaticSize: Enum.AutomaticSize.X,
                  LayoutOrder: 2,
                  Size: new UDim2(0, 0, 0, 34),
                  Text: `Density · ${density()}`,
                }),
              )}
              Activated={() => setDensity(nextDensity(density()))}
            >
              <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />
              <uipadding
                PaddingLeft={() => new UDim(0, theme().space[16])}
                PaddingRight={() => new UDim(0, theme().space[16])}
              />
            </textbutton>
          </frame>
        </frame>

        {/* Body: navigation + active scene */}
        <frame
          BackgroundTransparency={1}
          Position={() => UDim2.fromOffset(outerPadding(), outerPadding() * 2 + headerHeight + topInset())}
          Size={() => new UDim2(1, -outerPadding() * 2, 1, -(outerPadding() * 3 + headerHeight + topInset()))}
        >
          <frame
            {...bindDerivedProps<Frame>(() =>
              mergeGuiProps(panelRecipe({ tone: "surface" }, theme()), {
                Size: new UDim2(0, navWidth, 1, 0),
              }),
            )}
          >
            <uicorner CornerRadius={() => new UDim(0, theme().radius.lg)} />
            <uipadding
              PaddingBottom={() => new UDim(0, theme().space[8])}
              PaddingLeft={() => new UDim(0, theme().space[8])}
              PaddingRight={() => new UDim(0, theme().space[8])}
              PaddingTop={() => new UDim(0, theme().space[8])}
            />
            <scrollingframe
              AutomaticCanvasSize={Enum.AutomaticSize.Y}
              BackgroundTransparency={1}
              BorderSizePixel={0}
              CanvasSize={new UDim2()}
              ScrollBarThickness={4}
              Size={UDim2.fromScale(1, 1)}
            >
              <uilistlayout
                FillDirection={Enum.FillDirection.Vertical}
                Padding={() => new UDim(0, theme().space[4])}
                SortOrder={Enum.SortOrder.LayoutOrder}
              />
              {sceneOptions.map((option) => (
                <SceneTab option={option} activeScene={activeScene} onSelect={(key) => activeScene(key)} />
              ))}
            </scrollingframe>
          </frame>

          <frame
            {...bindDerivedProps<Frame>(() =>
              mergeGuiProps(panelRecipe({ tone: "surface" }, theme()), {
                Position: UDim2.fromOffset(navWidth + theme().space[12], 0),
                Size: new UDim2(1, -(navWidth + theme().space[12]), 1, 0),
              }),
            )}
          >
            <uicorner CornerRadius={() => new UDim(0, theme().radius.lg)} />
            <uipadding
              PaddingBottom={() => new UDim(0, theme().space[16])}
              PaddingLeft={() => new UDim(0, theme().space[16])}
              PaddingRight={() => new UDim(0, theme().space[16])}
              PaddingTop={() => new UDim(0, theme().space[16])}
            />
            {/* One scene at a time: `match` destroys the previous scene's scope before building the next. */}
            {Vide.match(activeScene)(sceneComponents)}
          </frame>
        </frame>
      </frame>
    </screengui>
  );
}

export function PlaygroundWorkspace(props: PlaygroundWorkspaceProps) {
  const activeScene = Vide.source<SceneKey>(props.initialScene ?? "checkbox");
  const darkMode = Vide.source(true);

  // The theme is controlled from here, so the toggle is the single source of truth and
  // `setBaseTheme` is deliberately not the path the demo takes.
  return SystemProvider({
    theme: () => (darkMode() ? defaultDarkTheme : defaultLightTheme),
    defaultDensity: "comfortable",
    children: () =>
      PortalProvider({
        container: props.playerGui,
        children: () =>
          Tooltip.Provider({
            children: () => AppContent({ activeScene, darkMode }),
          }),
      }),
  });
}
