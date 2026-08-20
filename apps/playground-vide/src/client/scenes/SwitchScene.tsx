import { bindDerivedProps, type Derivable, read, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { Switch } from "@lattice-ui/vide-switch";
import { panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

type SwitchRowProps = {
  text: string;
  order: number;
  checked: Derivable<boolean>;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

function SwitchRow(props: SwitchRowProps) {
  const { theme } = useTheme();
  const on = () => read(props.checked);

  return (
    <frame BackgroundTransparency={1} LayoutOrder={props.order} Size={UDim2.fromOffset(636, 40)}>
      <Text
        BackgroundTransparency={1}
        Size={UDim2.fromOffset(500, 40)}
        Text={props.text}
        TextColor3={() => (props.disabled === true ? theme().colors.textSecondary : theme().colors.textPrimary)}
        TextSize={() => theme().typography.bodyMd.textSize}
        TextXAlignment={Enum.TextXAlignment.Left}
        truncate
      />
      <Switch.Root
        checked={props.checked}
        disabled={props.disabled}
        onCheckedChange={props.onCheckedChange}
        {...bindDerivedProps<TextButton>(() =>
          mergeGuiProps(panelRecipe({ tone: "surface" }, theme()), {
            AutoButtonColor: false,
            // The track colour is the demo's; the switch itself never paints.
            BackgroundColor3: on() ? theme().colors.accent : theme().colors.surfaceElevated,
            Position: UDim2.fromOffset(560, 6),
            Size: UDim2.fromOffset(56, 28),
            Text: "",
          }),
        )}
      >
        {() => [
          <uicorner CornerRadius={new UDim(1, 0)} />,
          // The thumb's travel is geometry computed from state, so it is the demo that positions it.
          <Switch.Thumb
            BackgroundColor3={() => theme().colors.accentContrast}
            BorderSizePixel={0}
            Position={() => UDim2.fromOffset(on() ? 30 : 2, 2)}
            Size={UDim2.fromOffset(24, 24)}
          >
            {() => <uicorner CornerRadius={new UDim(1, 0)} />}
          </Switch.Thumb>,
        ]}
      </Switch.Root>
    </frame>
  );
}

export function SwitchScene() {
  const wifi = Vide.source(true);
  const bluetooth = Vide.source(false);

  return (
    <SceneRoot
      title="Switch — controlled, uncontrolled and disabled"
      summary={() => `Wi-Fi ${wifi() ? "on" : "off"} · Bluetooth ${bluetooth() ? "on" : "off"}`}
    >
      <ScenePanel heading="CONNECTIVITY" order={1}>
        <SwitchRow order={1} text="Wi-Fi" checked={wifi} onCheckedChange={(nextValue) => wifi(nextValue)} />
        <SwitchRow
          order={2}
          text="Bluetooth"
          checked={bluetooth}
          onCheckedChange={(nextValue) => bluetooth(nextValue)}
        />
        <SwitchRow order={3} text="Airplane mode (disabled)" checked={false} disabled />
        <SceneReadout order={4} text={() => `Radios enabled: ${(wifi() ? 1 : 0) + (bluetooth() ? 1 : 0)}/2`} />
      </ScenePanel>
    </SceneRoot>
  );
}
