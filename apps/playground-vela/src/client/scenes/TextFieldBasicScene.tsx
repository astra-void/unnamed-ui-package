import { React } from "@lattice-ui/react-runtime";
import { TextField } from "@lattice-ui/react-text-field";

function SectionHeader(props: { text: string; order: number }) {
  return (
    <textlabel
      LayoutOrder={props.order}
      Size={UDim2.fromOffset(820, 18)}
      Text={props.text}
      className="text-ink-400 text-sm text-left"
    />
  );
}

function Field(props: {
  order: number;
  label: string;
  placeholder?: string;
  width?: number;
  inputHeight?: number;
  value?: string;
  defaultValue?: string;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  description?: string;
  message?: string;
  messageInvalid?: boolean;
  onValueChange?: (value: string) => void;
  onValueCommit?: (value: string) => void;
}) {
  const width = props.width ?? 820;
  const inputHeight = props.inputHeight ?? 36;

  // Fixed height: label(22) + gap(4) + input + optional description/message rows.
  let height = 22 + 4 + inputHeight;
  if (props.description !== undefined) {
    height += 4 + 16;
  }
  if (props.message !== undefined) {
    height += 4 + 16;
  }

  return (
    <TextField.Root
      defaultValue={props.defaultValue}
      disabled={props.disabled}
      invalid={props.invalid}
      onValueChange={props.onValueChange}
      onValueCommit={props.onValueCommit}
      readOnly={props.readOnly}
      value={props.value}
    >
      <frame LayoutOrder={props.order} Size={UDim2.fromOffset(width, height)} className="bg-transparent flex-col gap-1">
        <TextField.Label asChild>
          {props.disabled === true ? (
            <textbutton
              AutoButtonColor={false}
              LayoutOrder={1}
              Size={UDim2.fromOffset(width, 22)}
              Text={props.label}
              className="bg-transparent text-ink-400 text-sm text-left"
            />
          ) : (
            <textbutton
              AutoButtonColor={false}
              LayoutOrder={1}
              Size={UDim2.fromOffset(width, 22)}
              Text={props.label}
              className="bg-transparent text-ink text-sm text-left"
            />
          )}
        </TextField.Label>

        <TextField.Input asChild>
          {props.invalid === true ? (
            <textbox
              LayoutOrder={2}
              PlaceholderText={props.placeholder ?? "Type..."}
              Size={UDim2.fromOffset(width, inputHeight)}
              className="bg-surface-100 text-ink text-base text-left rounded-md border border-danger px-2.5"
            />
          ) : props.disabled === true ? (
            <textbox
              LayoutOrder={2}
              PlaceholderText={props.placeholder ?? "Type..."}
              Size={UDim2.fromOffset(width, inputHeight)}
              className="bg-surface-100 text-ink-400 text-base text-left rounded-md border border-edge px-2.5"
            />
          ) : (
            <textbox
              LayoutOrder={2}
              PlaceholderText={props.placeholder ?? "Type..."}
              Size={UDim2.fromOffset(width, inputHeight)}
              className="bg-surface-100 text-ink text-base text-left rounded-md border border-edge px-2.5"
            />
          )}
        </TextField.Input>

        {props.description !== undefined ? (
          <TextField.Description asChild>
            <textlabel
              LayoutOrder={3}
              Size={UDim2.fromOffset(width, 16)}
              Text={props.description}
              className="text-ink-400 text-sm text-left"
            />
          </TextField.Description>
        ) : undefined}

        {props.message !== undefined ? (
          <TextField.Message asChild>
            {props.messageInvalid === true ? (
              <textlabel
                LayoutOrder={4}
                Size={UDim2.fromOffset(width, 16)}
                Text={props.message}
                className="text-danger text-sm text-left"
              />
            ) : (
              <textlabel
                LayoutOrder={4}
                Size={UDim2.fromOffset(width, 16)}
                Text={props.message}
                className="text-ink-400 text-sm text-left"
              />
            )}
          </TextField.Message>
        ) : undefined}
      </frame>
    </TextField.Root>
  );
}

const BIO_LIMIT = 24;

export function TextFieldBasicScene() {
  const [controlledValue, setControlledValue] = React.useState("hello");
  const [lastCommit, setLastCommit] = React.useState("none");
  const [commitCount, setCommitCount] = React.useState(0);
  const [bio, setBio] = React.useState("Lattice UI");

  const invalid = controlledValue.size() < 3;
  const bioOver = bio.size() > BIO_LIMIT;

  return (
    <frame className="w-235 h-180 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(920, 28)}
        Text="TextField: controlled/uncontrolled, commit, validation, char count, compact + disabled"
        className="text-ink text-xl text-left truncate"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(920, 24)}
        Text={`Controlled: ${controlledValue} | Last commit: ${lastCommit} (${commitCount}) | Invalid: ${invalid ? "true" : "false"}`}
        className="text-ink-400 text-base text-left"
      />

      <frame className="top-17 w-235 h-150 bg-transparent flex-col gap-4">
        {/* Commit + controlled */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={1}
          className="w-225 bg-surface rounded-lg p-3 flex-col gap-3"
        >
          <SectionHeader text="COMMIT + CONTROLLED" order={1} />
          <Field
            order={2}
            label="Controlled field"
            placeholder="Type at least 3 characters"
            value={controlledValue}
            invalid={invalid}
            description="onValueChange fires on text updates, onValueCommit fires on focus loss / Enter."
            message={invalid ? "Must be at least 3 characters." : "Looks good."}
            messageInvalid={invalid}
            onValueChange={setControlledValue}
            onValueCommit={(value) => {
              setLastCommit(value);
              setCommitCount((count) => count + 1);
            }}
          />
        </frame>

        {/* Validation states */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={2}
          className="w-225 bg-surface rounded-lg p-3 flex-col gap-3"
        >
          <SectionHeader text="VALIDATION" order={1} />
          <Field order={2} label="Valid" defaultValue="jane@lattice.dev" message="Email accepted." />
          <Field
            order={3}
            label="Invalid"
            defaultValue="not-an-email"
            invalid
            message="Enter a valid email address."
            messageInvalid
          />
          <Field
            order={4}
            label="Read only"
            defaultValue="acct_9f2c14 (locked)"
            readOnly
            description="readOnly keeps the value but blocks edits."
          />
        </frame>

        {/* Character count */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={3}
          className="w-225 bg-surface rounded-lg p-3 flex-col gap-3"
        >
          <SectionHeader text="CHARACTER COUNT" order={1} />
          <Field
            order={2}
            label="Short bio"
            placeholder="Say something short"
            value={bio}
            invalid={bioOver}
            message={`${bio.size()}/${BIO_LIMIT}${bioOver ? " — too long" : ""}`}
            messageInvalid={bioOver}
            onValueChange={setBio}
          />
        </frame>

        {/* Compact + uncontrolled + disabled */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={4}
          className="w-225 bg-surface rounded-lg p-3 flex-col gap-3"
        >
          <SectionHeader text="COMPACT / UNCONTROLLED / DISABLED" order={1} />
          <Field
            order={2}
            label="Compact (28px)"
            defaultValue="compact"
            width={420}
            inputHeight={28}
            description="Smaller control height for dense forms."
          />
          <Field
            order={3}
            label="Uncontrolled field"
            defaultValue="uncontrolled value"
            placeholder="Uncontrolled text"
            description="This field keeps internal value state."
          />
          <Field order={4} label="Disabled field" defaultValue="disabled value" placeholder="Disabled" disabled />
        </frame>
      </frame>

      <textbutton
        AutoButtonColor={false}
        Event={{
          Activated: () => {
            setControlledValue("hello");
          },
        }}
        Position={UDim2.fromOffset(0, 676)}
        Text="Reset Controlled"
        className="w-45 h-9 bg-accent text-accent-50 text-base"
      />
    </frame>
  );
}
