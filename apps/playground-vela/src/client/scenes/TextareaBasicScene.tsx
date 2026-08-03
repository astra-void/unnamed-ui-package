import { React } from "@lattice-ui/react-runtime";
import { Textarea } from "@lattice-ui/react-textarea";

function SectionHeader(props: { text: string; order: number }) {
  return (
    <textlabel
      LayoutOrder={props.order}
      Size={UDim2.fromOffset(860, 18)}
      Text={props.text}
      className="text-ink-400 text-sm text-left"
    />
  );
}

function TextareaField(props: {
  order: number;
  label: string;
  placeholder?: string;
  width?: number;
  inputHeight?: number;
  value?: string;
  defaultValue?: string;
  invalid?: boolean;
  disabled?: boolean;
  minRows?: number;
  maxRows?: number;
  description?: string;
  message?: string;
  messageInvalid?: boolean;
  onValueChange?: (value: string) => void;
}) {
  const width = props.width ?? 860;
  const inputHeight = props.inputHeight ?? 70;

  return (
    <Textarea.Root
      defaultValue={props.defaultValue}
      disabled={props.disabled}
      invalid={props.invalid}
      maxRows={props.maxRows}
      minRows={props.minRows}
      onValueChange={props.onValueChange}
      value={props.value}
    >
      <frame
        AutomaticSize={Enum.AutomaticSize.Y}
        LayoutOrder={props.order}
        Size={UDim2.fromOffset(width, 0)}
        className="bg-transparent flex-col gap-1.5"
      >
        <Textarea.Label asChild>
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
        </Textarea.Label>

        {/*
          The border tracks `invalid`. `border-{color}` accepts no opacity
          modifier in 0.5.0, so the sibling playground's `Transparency={0.4}`
          on the idle stroke is not reproducible — the idle border is opaque.
        */}
        <Textarea.Input asChild>
          {props.invalid === true ? (
            <textbox
              LayoutOrder={2}
              PlaceholderText={props.placeholder ?? "Write details"}
              Size={UDim2.fromOffset(width, inputHeight)}
              TextWrapped
              className="bg-surface-100 text-ink text-base text-left align-top rounded-md border border-danger p-2"
            />
          ) : props.disabled === true ? (
            <textbox
              LayoutOrder={2}
              PlaceholderText={props.placeholder ?? "Write details"}
              Size={UDim2.fromOffset(width, inputHeight)}
              TextWrapped
              className="bg-surface-100 text-ink-400 text-base text-left align-top rounded-md border border-edge p-2"
            />
          ) : (
            <textbox
              LayoutOrder={2}
              PlaceholderText={props.placeholder ?? "Write details"}
              Size={UDim2.fromOffset(width, inputHeight)}
              TextWrapped
              className="bg-surface-100 text-ink text-base text-left align-top rounded-md border border-edge p-2"
            />
          )}
        </Textarea.Input>

        {props.description !== undefined ? (
          <Textarea.Description asChild>
            <textlabel
              LayoutOrder={3}
              Size={UDim2.fromOffset(width, 16)}
              Text={props.description}
              className="text-ink-400 text-sm text-left"
            />
          </Textarea.Description>
        ) : undefined}

        {props.message !== undefined ? (
          <Textarea.Message asChild>
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
          </Textarea.Message>
        ) : undefined}
      </frame>
    </Textarea.Root>
  );
}

const NOTE_LIMIT = 80;

export function TextareaBasicScene() {
  const [value, setValue] = React.useState("line 1\nline 2");
  const [note, setNote] = React.useState("Ship the release notes.");

  const invalid = value.size() < 5;
  const noteRemaining = NOTE_LIMIT - note.size();
  const noteOver = noteRemaining < 0;

  return (
    <frame className="w-235 h-155 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(920, 28)}
        Text="Textarea: auto-resize (minRows/maxRows), character count, helper/error, disabled"
        className="text-ink text-xl text-left truncate"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(920, 22)}
        Text={`Notes length: ${value.size()} | Message chars: ${note.size()}/${NOTE_LIMIT}`}
        className="text-ink-400 text-base text-left"
      />

      <frame className="top-16.5 w-235 h-135 bg-transparent flex-col gap-4">
        {/* Auto-resize */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={1}
          className="w-225 bg-surface rounded-lg p-3 flex-col gap-2"
        >
          <SectionHeader text="AUTO-RESIZE (minRows 2 · maxRows 6)" order={1} />
          <TextareaField
            order={2}
            label="Notes"
            placeholder="Write details — grows as you type"
            value={value}
            invalid={invalid}
            minRows={2}
            maxRows={6}
            description="Grows from 2 rows up to 6, then scrolls internally."
            message={invalid ? "Type at least 5 chars" : "Looks good"}
            messageInvalid={invalid}
            onValueChange={setValue}
          />
        </frame>

        {/* Character count */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={2}
          className="w-225 bg-surface rounded-lg p-3 flex-col gap-2"
        >
          <SectionHeader text="CHARACTER LIMIT" order={1} />
          <TextareaField
            order={2}
            label="Commit message"
            placeholder="Describe the change"
            value={note}
            invalid={noteOver}
            minRows={2}
            maxRows={4}
            message={noteOver ? `${-noteRemaining} over limit` : `${noteRemaining} characters left`}
            messageInvalid={noteOver}
            onValueChange={setNote}
          />
        </frame>

        {/* Disabled */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={3}
          className="w-225 bg-surface rounded-lg p-3 flex-col gap-2"
        >
          <SectionHeader text="DISABLED" order={1} />
          <TextareaField
            order={2}
            label="Locked notes"
            defaultValue="This content is read-only and cannot be edited."
            disabled
            minRows={2}
            description="disabled blocks editing but preserves the value."
          />
        </frame>
      </frame>
    </frame>
  );
}
