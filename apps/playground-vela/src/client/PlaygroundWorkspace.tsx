import { PortalProvider } from "@lattice-ui/react-layer";
import { React } from "@lattice-ui/react-runtime";
import { defaultDarkTheme } from "@lattice-ui/react-style";
import type { DensityToken } from "@lattice-ui/react-system";
import { SystemProvider, useSystemTheme } from "@lattice-ui/react-system";
import { AccordionBasicScene } from "./scenes/AccordionBasicScene";
import { AvatarBasicScene } from "./scenes/AvatarBasicScene";
import { CheckboxBasicScene } from "./scenes/CheckboxBasicScene";
import { ComboboxBasicScene } from "./scenes/ComboboxBasicScene";
import { ConfirmDialogScene } from "./scenes/ConfirmDialogScene";
import { ContextMenuBasicScene } from "./scenes/ContextMenuBasicScene";
import { DensityScopeScene } from "./scenes/DensityScopeScene";
import { DialogBasicScene } from "./scenes/DialogBasicScene";
import { DialogModalBlockScene } from "./scenes/DialogModalBlockScene";
import { DialogNestedScene } from "./scenes/DialogNestedScene";
import { GridShowcaseScene } from "./scenes/GridShowcaseScene";
import { InsetHitTestScene } from "./scenes/InsetHitTestScene";
import { LayerDismissScene } from "./scenes/LayerDismissScene";
import { MenuBasicScene } from "./scenes/MenuBasicScene";
import { ModalBlockScene } from "./scenes/ModalBlockScene";
import { NestedStackScene } from "./scenes/NestedStackScene";
import { PopoverBasicScene } from "./scenes/PopoverBasicScene";
import { PopoverFlipClampScene } from "./scenes/PopoverFlipClampScene";
import { PopoverNestedScene } from "./scenes/PopoverNestedScene";
import { PresenceScene } from "./scenes/PresenceScene";
import { ProgressBasicScene } from "./scenes/ProgressBasicScene";
import { RadioGroupDisabledScene } from "./scenes/RadioGroupDisabledScene";
import { ScrollAreaBasicScene } from "./scenes/ScrollAreaBasicScene";
import { SelectBasicScene } from "./scenes/SelectBasicScene";
import { SettingsFormScene } from "./scenes/SettingsFormScene";
import { SliderBasicScene } from "./scenes/SliderBasicScene";
import { StackShowcaseScene } from "./scenes/StackShowcaseScene";
import { SurfaceShowcaseScene } from "./scenes/SurfaceShowcaseScene";
import { SwitchBasicScene } from "./scenes/SwitchBasicScene";
import { TabsBasicScene } from "./scenes/TabsBasicScene";
import { TextareaBasicScene } from "./scenes/TextareaBasicScene";
import { TextFieldBasicScene } from "./scenes/TextFieldBasicScene";
import { ToastBasicScene } from "./scenes/ToastBasicScene";
import { ToggleGroupBasicScene } from "./scenes/ToggleGroupBasicScene";
import { TooltipDelayScene } from "./scenes/TooltipDelayScene";
import { TooltipFollowScene } from "./scenes/TooltipFollowScene";
import { UserMenuScene } from "./scenes/UserMenuScene";

export type SceneKey =
  | "dismiss"
  | "nested"
  | "modal"
  | "presence"
  | "inset"
  | "checkbox-basic"
  | "switch-basic"
  | "radio-disabled"
  | "text-field-basic"
  | "textarea-basic"
  | "select-basic"
  | "combobox-basic"
  | "slider-basic"
  | "progress-basic"
  | "avatar-basic"
  | "toggle-basic"
  | "dialog-basic"
  | "dialog-nested"
  | "dialog-modal"
  | "menu-basic"
  | "context-menu-basic"
  | "popover-basic"
  | "popover-flip"
  | "popover-nested"
  | "tabs-basic"
  | "tooltip-delay"
  | "tooltip-follow"
  | "toast-basic"
  | "density-scope"
  | "scroll-area-basic"
  | "surface-showcase"
  | "stack-showcase"
  | "grid-showcase"
  | "accordion-basic"
  | "settings-form"
  | "user-menu"
  | "confirm-dialog";

type SceneCategory = "Patterns" | "Layering" | "Forms" | "Selection" | "Showcase";

type SceneOption = {
  key: SceneKey;
  label: string;
  description: string;
  category: SceneCategory;
  hasMotion?: boolean;
};

const sceneOptions = [
  {
    key: "settings-form",
    label: "Settings Form",
    description: "Switch, Select, RadioGroup, TextField and Slider composed into one panel.",
    category: "Patterns",
    hasMotion: true,
  },
  {
    key: "user-menu",
    label: "Account Menu",
    description: "Avatar trigger opening a popover with a status switch and menu actions.",
    category: "Patterns",
    hasMotion: true,
  },
  {
    key: "confirm-dialog",
    label: "Confirm Dialog",
    description: "Modal destructive confirmation flow with cancel and delete.",
    category: "Patterns",
    hasMotion: true,
  },
  {
    key: "dismiss",
    label: "Layer Dismiss",
    description: "Outside click dismissal orchestration.",
    category: "Layering",
  },
  {
    key: "nested",
    label: "Nested Stack",
    description: "Layer ownership and nested portal behavior.",
    category: "Layering",
  },
  {
    key: "modal",
    label: "Modal Block",
    description: "Modal surfaces with outside interaction blocking.",
    category: "Layering",
  },
  {
    key: "presence",
    label: "Presence",
    description: "Mount and unmount transitions with presence states.",
    category: "Layering",
    hasMotion: true,
  },
  {
    key: "inset",
    label: "Inset Hit-Test",
    description: "Pointer hit region tuning for small controls.",
    category: "Layering",
  },
  {
    key: "dialog-basic",
    label: "Dialog Basic",
    description: "Core dialog primitives and focus handoff.",
    category: "Layering",
    hasMotion: true,
  },
  {
    key: "dialog-nested",
    label: "Dialog Nested",
    description: "Nested dialog sequencing and layering.",
    category: "Layering",
    hasMotion: true,
  },
  {
    key: "dialog-modal",
    label: "Dialog Modal Block",
    description: "Modal dialog that locks external interaction.",
    category: "Layering",
    hasMotion: true,
  },
  {
    key: "menu-basic",
    label: "Menu Basic",
    description: "Grouped menu items with selection and dismissal.",
    category: "Layering",
    hasMotion: true,
  },
  {
    key: "context-menu-basic",
    label: "Context Menu Basic",
    description: "Right-click a region to open a pointer-anchored menu.",
    category: "Layering",
    hasMotion: true,
  },
  {
    key: "popover-basic",
    label: "Popover Basic",
    description: "Anchored popover positioning with portals.",
    category: "Layering",
    hasMotion: true,
  },
  {
    key: "popover-flip",
    label: "Popover Flip/Clamp",
    description: "Viewport-aware popover fallback placement.",
    category: "Layering",
    hasMotion: true,
  },
  {
    key: "popover-nested",
    label: "Popover Nested",
    description: "Layer stack behavior with nested popovers.",
    category: "Layering",
    hasMotion: true,
  },
  {
    key: "tooltip-delay",
    label: "Tooltip Delay",
    description: "Open/close delay behavior for tooltips.",
    category: "Layering",
    hasMotion: true,
  },
  {
    key: "tooltip-follow",
    label: "Tooltip Follow",
    description: "Tooltip movement following pointer position.",
    category: "Layering",
    hasMotion: true,
  },
  {
    key: "toast-basic",
    label: "Toast Basic",
    description: "Declarative toast composition examples.",
    category: "Layering",
    hasMotion: true,
  },
  {
    key: "checkbox-basic",
    label: "Checkbox Basic",
    description: "Checkbox states and controlled usage.",
    category: "Forms",
    hasMotion: true,
  },
  {
    key: "switch-basic",
    label: "Switch Basic",
    description: "Switch interactions and state labels.",
    category: "Forms",
    hasMotion: true,
  },
  {
    key: "text-field-basic",
    label: "TextField Basic",
    description: "Single-line text input variants.",
    category: "Forms",
  },
  {
    key: "textarea-basic",
    label: "Textarea Basic",
    description: "Multi-line input and helper text.",
    category: "Forms",
  },
  {
    key: "select-basic",
    label: "Select Basic",
    description: "Trigger/content select composition.",
    category: "Forms",
    hasMotion: true,
  },
  {
    key: "combobox-basic",
    label: "Combobox Basic",
    description: "Text input with option filtering behavior.",
    category: "Forms",
    hasMotion: true,
  },
  {
    key: "slider-basic",
    label: "Slider Basic",
    description: "Single and range slider interaction.",
    category: "Forms",
    hasMotion: true,
  },
  {
    key: "progress-basic",
    label: "Progress Basic",
    description: "Progress indicators with semantic states.",
    category: "Forms",
    hasMotion: true,
  },
  {
    key: "avatar-basic",
    label: "Avatar Basic",
    description: "Avatar fallbacks, sizing and status.",
    category: "Forms",
  },
  {
    key: "radio-disabled",
    label: "Radio Disabled",
    description: "Disabled radio behavior and focus rules.",
    category: "Selection",
  },
  {
    key: "toggle-basic",
    label: "Toggle Basic",
    description: "Single toggle pressed state behavior.",
    category: "Selection",
  },
  {
    key: "tabs-basic",
    label: "Tabs Basic",
    description: "Tabs activation, indicators and content.",
    category: "Selection",
    hasMotion: true,
  },
  {
    key: "accordion-basic",
    label: "Accordion Basic",
    description: "Expandable sections with animated disclosure.",
    category: "Selection",
    hasMotion: true,
  },
  {
    key: "density-scope",
    label: "Density Scope",
    description: "Per-scope density overrides across components.",
    category: "Showcase",
  },
  {
    key: "scroll-area-basic",
    label: "ScrollArea Basic",
    description: "Custom XY viewport and thumb composition.",
    category: "Showcase",
  },
  {
    key: "surface-showcase",
    label: "Surface Showcase",
    description: "Surface tone tokens and elevation structure.",
    category: "Showcase",
  },
  {
    key: "stack-showcase",
    label: "Stack Showcase",
    description: "Vertical composition and spacing primitives.",
    category: "Showcase",
  },
  {
    key: "grid-showcase",
    label: "Grid Showcase",
    description: "Grid composition and responsive track setup.",
    category: "Showcase",
  },
] satisfies ReadonlyArray<SceneOption>;

const sceneCategories = [
  { key: "Patterns", label: "Composed Patterns" },
  { key: "Layering", label: "Layering & Overlays" },
  { key: "Forms", label: "Forms & Inputs" },
  { key: "Selection", label: "Selection Patterns" },
  { key: "Showcase", label: "System & Layout" },
] as const satisfies ReadonlyArray<{ key: SceneCategory; label: string }>;

const scenesByCategory = sceneCategories.map((category) => ({
  key: category.key,
  label: category.label,
  scenes: sceneOptions.filter((scene) => scene.category === category.key),
}));

const sceneComponents = {
  "settings-form": SettingsFormScene,
  "user-menu": UserMenuScene,
  "confirm-dialog": ConfirmDialogScene,
  dismiss: LayerDismissScene,
  nested: NestedStackScene,
  modal: ModalBlockScene,
  presence: PresenceScene,
  inset: InsetHitTestScene,
  "checkbox-basic": CheckboxBasicScene,
  "switch-basic": SwitchBasicScene,
  "radio-disabled": RadioGroupDisabledScene,
  "text-field-basic": TextFieldBasicScene,
  "textarea-basic": TextareaBasicScene,
  "select-basic": SelectBasicScene,
  "combobox-basic": ComboboxBasicScene,
  "slider-basic": SliderBasicScene,
  "progress-basic": ProgressBasicScene,
  "avatar-basic": AvatarBasicScene,
  "toggle-basic": ToggleGroupBasicScene,
  "dialog-basic": DialogBasicScene,
  "dialog-nested": DialogNestedScene,
  "dialog-modal": DialogModalBlockScene,
  "menu-basic": MenuBasicScene,
  "context-menu-basic": ContextMenuBasicScene,
  "popover-basic": PopoverBasicScene,
  "popover-flip": PopoverFlipClampScene,
  "popover-nested": PopoverNestedScene,
  "tabs-basic": TabsBasicScene,
  "tooltip-delay": TooltipDelayScene,
  "tooltip-follow": TooltipFollowScene,
  "toast-basic": ToastBasicScene,
  "density-scope": DensityScopeScene,
  "scroll-area-basic": ScrollAreaBasicScene,
  "surface-showcase": SurfaceShowcaseScene,
  "stack-showcase": StackShowcaseScene,
  "grid-showcase": GridShowcaseScene,
  "accordion-basic": AccordionBasicScene,
} satisfies Record<SceneKey, () => React.ReactNode>;

const densityOrder = ["compact", "comfortable", "spacious"] as const satisfies ReadonlyArray<DensityToken>;

function nextDensity(current: DensityToken): DensityToken {
  const currentIndex = densityOrder.indexOf(current);
  const normalizedIndex = currentIndex >= 0 ? currentIndex : 0;
  return densityOrder[(normalizedIndex + 1) % densityOrder.size()];
}

export type PlaygroundWorkspaceProps = {
  playerGui: PlayerGui;
  initialScene?: SceneKey;
};

/**
 * The navigator entry, written as two static branches rather than one class
 * string with a ternary inside it.
 *
 * A `className` the compiler cannot fold to a constant takes vela's runtime
 * path, and that resolver only understands `bg-*`, `border*`, `rounded-*`,
 * spacing, sizing, `divide-*`, the text transforms and motion — `text-ink`,
 * `text-sm` and `text-left` would be dropped with no diagnostic. Branching on
 * the element keeps both variants on the compile-time path, where the full
 * utility set applies. The sibling playground expresses this as one
 * `sceneTabRecipe` with a `selected` variant.
 */
function SceneTab(props: { label: string; selected: boolean; onActivate: () => void }) {
  if (props.selected) {
    return (
      <textbutton
        AutoButtonColor={false}
        Event={{ Activated: props.onActivate }}
        LayoutOrder={2}
        Size={new UDim2(1, -4, 0, 32)}
        Text={props.label}
        className="bg-accent text-accent-50 text-base text-left rounded-md px-2.5 border border-accent"
      />
    );
  }

  return (
    <textbutton
      AutoButtonColor={false}
      Event={{ Activated: props.onActivate }}
      LayoutOrder={2}
      Size={new UDim2(1, -4, 0, 32)}
      Text={props.label}
      className="bg-surface text-ink text-base text-left rounded-md px-2.5 border border-edge"
    />
  );
}

function AppContent(props: PlaygroundWorkspaceProps) {
  const [activeScene, setActiveScene] = React.useState<SceneKey>(props.initialScene ?? "dismiss");
  const { density, setDensity } = useSystemTheme();
  const activeSceneMeta = sceneOptions.find((scene) => scene.key === activeScene) ?? sceneOptions[0];
  const ActiveScene = sceneComponents[activeScene];

  // Full-bleed background ignores the topbar inset; offset the content by it so
  // the header does not sit under the Roblox topbar. The inset is not always
  // ready on the first render, so track it and react to topbar changes.
  const [topInset, setTopInset] = React.useState(0);
  React.useEffect(() => {
    const guiService = game.GetService("GuiService");
    const update = () => {
      const [topLeftInset] = guiService.GetGuiInset();
      setTopInset(topLeftInset.Y);
    };
    update();
    const connection = guiService.GetPropertyChangedSignal("TopbarInset").Connect(update);
    return () => {
      connection.Disconnect();
    };
  }, []);

  return (
    <PortalProvider container={props.playerGui}>
      <screengui IgnoreGuiInset={true} ResetOnSpawn={false}>
        {/*
          The sibling playground paints `theme.colors.background` and layers a
          `uigradient` down to `surfaceElevated`. `bg-gradient-to-b` emits the
          same UIGradient; the accompanying `bg-*` is dropped, since any gradient
          stop forces BackgroundColor3 to white.
        */}
        <frame className="w-full h-full bg-gradient-to-b from-canvas to-surface-100">
          {/* Header. Position depends on the runtime topbar inset, so it stays a prop. */}
          <frame
            Position={UDim2.fromOffset(16, 16 + topInset)}
            Size={new UDim2(1, -32, 0, 104)}
            className="bg-surface rounded-lg border border-edge px-4 py-3"
          >
            <frame Size={new UDim2(1, -266, 1, 0)}>
              <textlabel
                Size={new UDim2(1, 0, 0, 30)}
                Text="Lattice UI Playground · vela"
                className="text-ink text-2xl text-left"
              />
              <textlabel
                Position={UDim2.fromOffset(0, 36)}
                Size={new UDim2(1, 0, 0, 22)}
                Text={`${activeSceneMeta.category} / ${activeSceneMeta.description}`}
                className="text-ink-400 text-base text-left truncate"
              />
              <textlabel
                Position={UDim2.fromOffset(0, 60)}
                Size={new UDim2(1, 0, 0, 18)}
                Text={`Active Scene: ${activeSceneMeta.label}`}
                className="text-ink-400 text-sm text-left"
              />
            </frame>

            <frame
              AnchorPoint={new Vector2(1, 0)}
              AutomaticSize={Enum.AutomaticSize.X}
              Position={new UDim2(1, 0, 0, 0)}
              Size={new UDim2(0, 0, 0, 40)}
              className="flex-row justify-end items-center gap-2"
            >
              {/*
                The sibling playground puts a light/dark toggle here. vela has no
                `dark:` variant and folds every class at compile time, so this app
                is built against one theme — see `vela.config.ts`.
              */}
              <textlabel
                AutomaticSize={Enum.AutomaticSize.X}
                Size={new UDim2(0, 0, 0, 36)}
                Text="Theme · Dark (compile-time)"
                className="bg-surface-100 text-ink-400 text-base rounded-md px-4 border border-edge"
              />
              <textbutton
                AutoButtonColor={false}
                AutomaticSize={Enum.AutomaticSize.X}
                Event={{
                  Activated: () => {
                    setDensity(nextDensity(density));
                  },
                }}
                Size={new UDim2(0, 0, 0, 36)}
                Text={`Density · ${density}`}
                className="bg-surface text-ink text-base rounded-md px-4 border border-edge"
              />
            </frame>
          </frame>

          <frame
            Position={UDim2.fromOffset(16, 32 + 104 + topInset)}
            Size={new UDim2(1, -32, 1, -(48 + 104 + topInset))}
            className="bg-transparent"
          >
            {/* Scene navigator */}
            <frame Size={new UDim2(0, 280, 1, 0)} className="bg-surface rounded-lg border border-edge">
              <textlabel
                Position={UDim2.fromOffset(12, 10)}
                Size={new UDim2(1, -24, 0, 20)}
                Text="Scene Navigator"
                className="text-ink text-base text-left"
              />
              <textlabel
                Position={UDim2.fromOffset(12, 30)}
                Size={new UDim2(1, -24, 0, 18)}
                Text={`${sceneOptions.size()} scenes`}
                className="text-ink-400 text-sm text-left"
              />
              <scrollingframe
                AutomaticCanvasSize={Enum.AutomaticSize.Y}
                CanvasSize={UDim2.fromOffset(0, 0)}
                Position={UDim2.fromOffset(8, 58)}
                ScrollBarImageColor3={Color3.fromRGB(72, 80, 98)}
                ScrollBarImageTransparency={0.3}
                ScrollBarThickness={6}
                ScrollingDirection={Enum.ScrollingDirection.Y}
                Size={new UDim2(1, -16, 1, -66)}
                className="flex-col gap-2.5"
              >
                {scenesByCategory.map((category) => (
                  <frame
                    key={category.key}
                    AutomaticSize={Enum.AutomaticSize.Y}
                    Size={new UDim2(1, 0, 0, 0)}
                    className="flex-col gap-1.5"
                  >
                    <textlabel
                      LayoutOrder={1}
                      Size={new UDim2(1, -4, 0, 20)}
                      Text={category.label}
                      className="text-ink-400 text-sm text-left"
                    />
                    {category.scenes.map((scene) => (
                      <SceneTab
                        key={scene.key}
                        label={scene.label}
                        selected={scene.key === activeScene}
                        onActivate={() => {
                          setActiveScene(scene.key);
                        }}
                      />
                    ))}
                  </frame>
                ))}
              </scrollingframe>
            </frame>

            {/* Stage */}
            <frame
              Position={UDim2.fromOffset(292, 0)}
              Size={new UDim2(1, -292, 1, 0)}
              className="bg-surface-100 rounded-lg border border-edge p-3"
            >
              <frame Size={new UDim2(1, 0, 0, 62)} className="bg-transparent">
                <textlabel
                  Size={new UDim2(1, -260, 0, 26)}
                  Text={activeSceneMeta.label}
                  className="text-ink text-xl text-left"
                />
                <textlabel
                  Position={UDim2.fromOffset(0, 28)}
                  Size={new UDim2(1, -12, 0, 18)}
                  Text={activeSceneMeta.description}
                  className="text-ink-400 text-base text-left truncate"
                />
                <frame
                  Position={new UDim2(1, -300, 0, 0)}
                  Size={new UDim2(0, 300, 0, 26)}
                  className="flex-row justify-end items-center gap-2"
                >
                  {activeSceneMeta.hasMotion === true ? (
                    <textlabel
                      Size={UDim2.fromOffset(80, 26)}
                      Text="Motion"
                      className="bg-surface-100 text-ink-400 text-sm rounded-md border border-edge"
                    />
                  ) : undefined}
                  <textlabel
                    Size={UDim2.fromOffset(144, 26)}
                    Text={activeSceneMeta.category}
                    className="bg-surface-100 text-ink-400 text-sm rounded-md border border-edge"
                  />
                </frame>
              </frame>

              <frame
                ClipsDescendants={true}
                Position={UDim2.fromOffset(0, 70)}
                Size={new UDim2(1, 0, 1, -70)}
                className="bg-surface rounded-lg"
              >
                <scrollingframe
                  AutomaticCanvasSize={Enum.AutomaticSize.XY}
                  CanvasSize={new UDim2(0, 0, 0, 0)}
                  ScrollBarImageColor3={Color3.fromRGB(72, 80, 98)}
                  ScrollBarImageTransparency={0.25}
                  ScrollBarThickness={8}
                  ScrollingDirection={Enum.ScrollingDirection.XY}
                  Size={UDim2.fromScale(1, 1)}
                  TopImage="rbxasset://textures/ui/Scroll/scroll-middle.png"
                  className="p-4"
                >
                  <ActiveScene />
                </scrollingframe>
              </frame>
            </frame>
          </frame>
        </frame>
      </screengui>
    </PortalProvider>
  );
}

export function PlaygroundWorkspace(props: PlaygroundWorkspaceProps) {
  return (
    <SystemProvider defaultDensity="comfortable" defaultTheme={defaultDarkTheme}>
      <AppContent playerGui={props.playerGui} initialScene={props.initialScene} />
    </SystemProvider>
  );
}
