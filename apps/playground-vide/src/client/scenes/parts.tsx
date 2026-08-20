import { bindDerivedProps, type Derivable, read, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import type VideTypes from "@rbxts/vide";
import { buttonRecipe, panelRecipe } from "../theme/recipes";

/**
 * The scene chrome every demo shares.
 *
 * These are plain Vide components, so each one runs once; anything that has to follow the theme is
 * written as a getter rather than read at call time.
 */

export type SceneRootProps = {
  title: string;
  summary: Derivable<string>;
  children?: VideTypes.Node;
};

export function SceneRoot(props: SceneRootProps) {
  const { theme } = useTheme();

  return (
    <frame BackgroundTransparency={1} Size={UDim2.fromOffset(920, 640)}>
      <Text
        BackgroundTransparency={1}
        Size={UDim2.fromOffset(880, 28)}
        Text={props.title}
        TextColor3={() => theme().colors.textPrimary}
        TextSize={() => theme().typography.titleMd.textSize - 2}
        TextXAlignment={Enum.TextXAlignment.Left}
        truncate
      />
      <Text
        BackgroundTransparency={1}
        Position={UDim2.fromOffset(0, 32)}
        Size={UDim2.fromOffset(880, 22)}
        Text={() => read(props.summary)}
        TextColor3={() => theme().colors.textSecondary}
        TextSize={() => theme().typography.bodyMd.textSize}
        TextXAlignment={Enum.TextXAlignment.Left}
        truncate
      />
      <frame BackgroundTransparency={1} Position={UDim2.fromOffset(0, 64)} Size={UDim2.fromOffset(920, 570)}>
        <uilistlayout
          FillDirection={Enum.FillDirection.Vertical}
          Padding={() => new UDim(0, theme().space[12])}
          SortOrder={Enum.SortOrder.LayoutOrder}
        />
        {props.children}
      </frame>
    </frame>
  );
}

export type ScenePanelProps = {
  heading: string;
  order?: number;
  width?: number;
  children?: VideTypes.Node;
};

export function ScenePanel(props: ScenePanelProps) {
  const { theme } = useTheme();

  return (
    <frame
      {...bindDerivedProps<Frame>(() =>
        mergeGuiProps(panelRecipe({ tone: "surface" }, theme()), {
          AutomaticSize: Enum.AutomaticSize.Y,
          LayoutOrder: props.order ?? 1,
          Size: UDim2.fromOffset(props.width ?? 660, 0),
        }),
      )}
    >
      <uicorner CornerRadius={() => new UDim(0, theme().radius.lg)} />
      <uipadding
        PaddingBottom={() => new UDim(0, theme().space[12])}
        PaddingLeft={() => new UDim(0, theme().space[12])}
        PaddingRight={() => new UDim(0, theme().space[12])}
        PaddingTop={() => new UDim(0, theme().space[12])}
      />
      <uilistlayout
        FillDirection={Enum.FillDirection.Vertical}
        Padding={() => new UDim(0, theme().space[8])}
        SortOrder={Enum.SortOrder.LayoutOrder}
      />
      <Text
        BackgroundTransparency={1}
        LayoutOrder={0}
        Size={UDim2.fromOffset((props.width ?? 660) - 24, 18)}
        Text={props.heading}
        TextColor3={() => theme().colors.textSecondary}
        TextSize={() => theme().typography.labelSm.textSize}
        TextXAlignment={Enum.TextXAlignment.Left}
      />
      {props.children}
    </frame>
  );
}

export type SceneReadoutProps = {
  text: Derivable<string>;
  order?: number;
  width?: number;
};

export function SceneReadout(props: SceneReadoutProps) {
  const { theme } = useTheme();

  return (
    <Text
      BackgroundTransparency={1}
      LayoutOrder={props.order ?? 1}
      Size={UDim2.fromOffset(props.width ?? 636, 20)}
      Text={() => read(props.text)}
      TextColor3={() => theme().colors.textSecondary}
      TextSize={() => theme().typography.bodyMd.textSize}
      TextXAlignment={Enum.TextXAlignment.Left}
      truncate
    />
  );
}

export type SceneButtonProps = {
  label: Derivable<string>;
  onActivated: () => void;
  intent?: "primary" | "surface" | "danger";
  order?: number;
  width?: number;
};

export function SceneButton(props: SceneButtonProps) {
  const { theme } = useTheme();

  return (
    <textbutton
      {...bindDerivedProps<TextButton>(() =>
        mergeGuiProps(buttonRecipe({ intent: props.intent ?? "surface", size: "sm" }, theme()), {
          LayoutOrder: props.order ?? 1,
          Size: UDim2.fromOffset(props.width ?? 220, 34),
          Text: read(props.label),
        }),
      )}
      Activated={props.onActivated}
    >
      <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />
    </textbutton>
  );
}

/** A horizontal strip, for rows of controls inside a panel. */
export function SceneRow(props: { order?: number; height?: number; gap?: number; children?: VideTypes.Node }) {
  const { theme } = useTheme();

  return (
    <frame BackgroundTransparency={1} LayoutOrder={props.order ?? 1} Size={UDim2.fromOffset(636, props.height ?? 36)}>
      <uilistlayout
        FillDirection={Enum.FillDirection.Horizontal}
        Padding={() => new UDim(0, props.gap ?? theme().space[8])}
        SortOrder={Enum.SortOrder.LayoutOrder}
        VerticalAlignment={Enum.VerticalAlignment.Center}
      />
      {props.children}
    </frame>
  );
}
