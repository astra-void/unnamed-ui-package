import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, useTheme } from "@lattice-ui/vide-style";
import { TextField } from "@lattice-ui/vide-text-field";
import { panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

type FieldProps = {
  label: string;
  placeholder: string;
  value: Vide.Source<string>;
  order: number;
  invalid?: () => boolean;
  message?: () => string;
  readOnly?: boolean;
};

function Field(props: FieldProps) {
  const { theme } = useTheme();

  return (
    <TextField.Root
      value={props.value}
      invalid={props.invalid}
      readOnly={props.readOnly}
      onValueChange={(nextValue) => props.value(nextValue)}
    >
      {() => (
        <frame BackgroundTransparency={1} LayoutOrder={props.order} Size={UDim2.fromOffset(636, 84)}>
          <TextField.Label
            AutoButtonColor={false}
            BackgroundTransparency={1}
            Size={UDim2.fromOffset(636, 20)}
            Text={props.label}
            TextColor3={() => theme().colors.textSecondary}
            TextSize={() => theme().typography.labelSm.textSize}
            TextXAlignment={Enum.TextXAlignment.Left}
          />
          <TextField.Input
            {...bindDerivedProps<TextBox>(() =>
              mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                ClearTextOnFocus: false,
                PlaceholderText: props.placeholder,
                Position: UDim2.fromOffset(0, 24),
                Size: UDim2.fromOffset(480, 34),
                TextColor3: theme().colors.textPrimary,
                TextSize: theme().typography.bodyMd.textSize,
                TextXAlignment: Enum.TextXAlignment.Left,
              }),
            )}
          >
            {() => [
              <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />,
              <uipadding
                PaddingLeft={() => new UDim(0, theme().space[10])}
                PaddingRight={() => new UDim(0, theme().space[10])}
              />,
            ]}
          </TextField.Input>
          <TextField.Message
            BackgroundTransparency={1}
            Position={UDim2.fromOffset(0, 62)}
            Size={UDim2.fromOffset(636, 18)}
            Text={() => props.message?.() ?? ""}
            TextColor3={() => (props.invalid?.() === true ? theme().colors.danger : theme().colors.textSecondary)}
            TextSize={() => theme().typography.labelSm.textSize}
            TextXAlignment={Enum.TextXAlignment.Left}
          />
        </frame>
      )}
    </TextField.Root>
  );
}

export function TextFieldScene() {
  const displayName = Vide.source("astra");
  const email = Vide.source("not-an-email");
  const apiKey = Vide.source("lat_live_4f9c2b7e");

  // `find` returns the match position, and position 0 would be falsy — compare explicitly.
  const emailInvalid = () => email().find("@")[0] === undefined;

  return (
    <SceneRoot
      title="TextField — controlled value, validation and read-only"
      summary={() => `Name "${displayName()}" · Email ${emailInvalid() ? "invalid" : "valid"}`}
    >
      <ScenePanel heading="PROFILE" order={1} width={680}>
        <Field label="DISPLAY NAME" placeholder="How others see you" value={displayName} order={1} />
        <Field
          label="EMAIL"
          placeholder="you@example.com"
          value={email}
          order={2}
          invalid={emailInvalid}
          message={() => (emailInvalid() ? "An email address needs an @." : "Looks right.")}
        />
        <Field label="API KEY (READ-ONLY)" placeholder="" value={apiKey} order={3} readOnly />
        <SceneReadout
          order={4}
          text="The read-only field still takes focus; the core writes the value back over anything typed."
        />
      </ScenePanel>
    </SceneRoot>
  );
}
