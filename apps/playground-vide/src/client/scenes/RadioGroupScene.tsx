import { RadioGroup } from "@lattice-ui/vide-radio-group";
import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { buttonRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

type Option = { value: string; text: string; disabled?: boolean };

const OPTIONS: Option[] = [
  { value: "standard", text: "Standard — 3-5 business days" },
  { value: "express", text: "Express — next business day" },
  { value: "courier", text: "Courier — same day (unavailable)", disabled: true },
];

function RadioRow(props: { option: Option; order: number; selected: () => string }) {
  const { theme } = useTheme();
  const isSelected = () => props.selected() === props.option.value;
  const muted = () => props.option.disabled === true;

  return (
    <RadioGroup.Item
      value={props.option.value}
      disabled={props.option.disabled}
      {...bindDerivedProps<TextButton>(() =>
        mergeGuiProps(buttonRecipe({ intent: "surface", size: "md" }, theme()), {
          LayoutOrder: props.order,
          Size: UDim2.fromOffset(610, 40),
          Text: "",
        }),
      )}
    >
      {() => [
        <frame
          BackgroundColor3={() => theme().colors.surfaceElevated}
          BorderSizePixel={0}
          Position={UDim2.fromOffset(12, 8)}
          Size={UDim2.fromOffset(24, 24)}
        >
          <uicorner CornerRadius={new UDim(1, 0)} />
          <RadioGroup.Indicator
            BackgroundColor3={() => theme().colors.accent}
            BorderSizePixel={0}
            Position={UDim2.fromOffset(6, 6)}
            Size={UDim2.fromOffset(12, 12)}
          >
            {() => <uicorner CornerRadius={new UDim(1, 0)} />}
          </RadioGroup.Indicator>
        </frame>,
        <Text
          BackgroundTransparency={1}
          Position={UDim2.fromOffset(48, 0)}
          Size={UDim2.fromOffset(550, 40)}
          Text={() => (isSelected() ? `${props.option.text}  ·  selected` : props.option.text)}
          TextColor3={() => (muted() ? theme().colors.textSecondary : theme().colors.textPrimary)}
          TextSize={() => theme().typography.bodyMd.textSize}
          TextXAlignment={Enum.TextXAlignment.Left}
          truncate
        />,
      ]}
    </RadioGroup.Item>
  );
}

export function RadioGroupScene() {
  // Read the theme here rather than inside the children closure: a Vide context is readable while a
  // component runs, and the closure below runs later, inside the group's own scope.
  const { theme } = useTheme();
  const shipping = Vide.source("standard");

  return (
    <SceneRoot title="RadioGroup — single selection with a disabled option" summary={() => `Shipping: ${shipping()}`}>
      <ScenePanel heading="SHIPPING METHOD" order={1}>
        <RadioGroup.Root value={shipping} onValueChange={(nextValue) => shipping(nextValue)}>
          {() => (
            <frame BackgroundTransparency={1} LayoutOrder={1} Size={UDim2.fromOffset(636, 132)}>
              <uilistlayout
                FillDirection={Enum.FillDirection.Vertical}
                Padding={() => new UDim(0, theme().space[4])}
                SortOrder={Enum.SortOrder.LayoutOrder}
              />
              {OPTIONS.map((option, index) => (
                <RadioRow option={option} order={index + 1} selected={shipping} />
              ))}
            </frame>
          )}
        </RadioGroup.Root>
        <SceneReadout
          order={2}
          text="Directional navigation stays inside the group, and the disabled option is skipped."
        />
      </ScenePanel>
    </SceneRoot>
  );
}
