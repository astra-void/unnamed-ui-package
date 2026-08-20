import { Checkbox, type CheckedState } from "@lattice-ui/vide-checkbox";
import { bindDerivedProps, type Derivable, read, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, Text, useTheme } from "@lattice-ui/vide-style";
import { buttonRecipe } from "../theme/recipes";
import { SceneButton, ScenePanel, SceneReadout, SceneRoot } from "./parts";

function label(value: CheckedState) {
  return value === "indeterminate" ? "indeterminate" : value ? "checked" : "unchecked";
}

function symbol(value: CheckedState) {
  return value === "indeterminate" ? "–" : "✓";
}

type CheckRowProps = {
  text: Derivable<string>;
  order: number;
  width?: number;
  checked: Derivable<CheckedState>;
  disabled?: boolean;
  muted?: boolean;
  onCheckedChange?: (checked: CheckedState) => void;
};

function CheckRow(props: CheckRowProps) {
  const { theme } = useTheme();
  const width = props.width ?? 610;
  const textColor = () => (props.muted === true ? theme().colors.textSecondary : theme().colors.textPrimary);

  return (
    <Checkbox.Root
      checked={props.checked}
      disabled={props.disabled}
      onCheckedChange={props.onCheckedChange}
      {...bindDerivedProps<TextButton>(() =>
        mergeGuiProps(buttonRecipe({ intent: "surface", size: "md" }, theme()), {
          LayoutOrder: props.order,
          Size: UDim2.fromOffset(width, 40),
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
          <uicorner CornerRadius={() => new UDim(0, theme().radius.sm)} />
          {/* forceMount keeps the box from resizing as the mark comes and goes; presence drives Visible. */}
          <Checkbox.Indicator forceMount>
            {() => (
              <Text
                BackgroundTransparency={1}
                Size={UDim2.fromScale(1, 1)}
                Text={() => symbol(read(props.checked))}
                TextColor3={textColor}
                TextSize={() => theme().typography.bodyMd.textSize}
              />
            )}
          </Checkbox.Indicator>
        </frame>,
        <Text
          BackgroundTransparency={1}
          Position={UDim2.fromOffset(48, 0)}
          Size={UDim2.fromOffset(width - 60, 40)}
          Text={() => read(props.text)}
          TextColor3={textColor}
          TextSize={() => theme().typography.bodyMd.textSize}
          TextXAlignment={Enum.TextXAlignment.Left}
          truncate
        />,
      ]}
    </Checkbox.Root>
  );
}

const CHILD_LABELS = ["Push notifications", "Email digest", "Product announcements"];

export function CheckboxScene() {
  const controlled = Vide.source<CheckedState>("indeterminate");
  const children = Vide.source<boolean[]>([true, false, false]);

  const checkedCount = () =>
    children()
      .filter((value) => value)
      .size();
  // A parent whose children disagree is neither checked nor unchecked, which is the whole reason
  // `CheckedState` has a third value.
  const parentState = (): CheckedState => {
    const count = checkedCount();
    if (count === 0) {
      return false;
    }
    return count === children().size() ? true : "indeterminate";
  };

  const setChildAt = (index: number, nextValue: boolean) => {
    children(children().map((value, i) => (i === index ? nextValue : value)));
  };

  const toggleAll = () => {
    const shouldCheckAll = checkedCount() !== children().size();
    children(children().map(() => shouldCheckAll));
  };

  return (
    <SceneRoot
      title="Checkbox — controlled, indeterminate, tri-state parent"
      summary={() => `Controlled: ${label(controlled())} · Selected ${checkedCount()}/${children().size()}`}
    >
      <ScenePanel heading="STATES" order={1}>
        <CheckRow
          order={1}
          text={() => `Controlled (${label(controlled())})`}
          checked={controlled}
          onCheckedChange={(nextValue) => controlled(nextValue)}
        />
        <CheckRow order={2} text="Disabled checked" checked={true} disabled muted />
        <SceneButton
          label="Set controlled indeterminate"
          onActivated={() => controlled("indeterminate")}
          intent="primary"
          order={3}
        />
      </ScenePanel>

      <ScenePanel heading="TRI-STATE SELECT ALL" order={2}>
        <CheckRow
          order={1}
          text={() => `All subscriptions (${label(parentState())})`}
          checked={parentState}
          onCheckedChange={toggleAll}
        />
        {CHILD_LABELS.map((text, index) => (
          <CheckRow
            order={2 + index}
            text={text}
            width={586}
            checked={() => children()[index]}
            onCheckedChange={(nextValue) => setChildAt(index, nextValue !== false)}
          />
        ))}
        <SceneReadout
          order={10}
          text={() =>
            `Children: ${children()
              .map((v) => (v ? "on" : "off"))
              .join(", ")}`
          }
        />
      </ScenePanel>
    </SceneRoot>
  );
}
