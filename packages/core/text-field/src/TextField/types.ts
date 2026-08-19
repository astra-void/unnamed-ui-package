import type { Derivable, ElementSpec } from "@lattice-ui/core-runtime";

export type TextFieldSetValue = (value: string) => void;
export type TextFieldCommitValue = (value: string) => void;

export interface TextFieldOptions {
  value?: Derivable<string | undefined>;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fired when editing ends, which is a separate event from every keystroke. */
  onValueCommit?: (value: string) => void;
  disabled?: Derivable<boolean | undefined>;
  readOnly?: Derivable<boolean | undefined>;
  required?: Derivable<boolean | undefined>;
  invalid?: Derivable<boolean | undefined>;
  name?: Derivable<string | undefined>;
}

export interface TextFieldInputOptions {
  disabled?: Derivable<boolean | undefined>;
  readOnly?: Derivable<boolean | undefined>;
}

export interface TextFieldInputCore {
  disabled: () => boolean;
  readOnly: () => boolean;
  /** Whether the field is being edited, which is what makes arrow keys move the cursor. */
  focused: () => boolean;
  spec: () => ElementSpec<TextBox>;
  setInstance: (instance: TextBox | undefined) => void;
}

export interface TextFieldCore {
  value: () => string;
  setValue: TextFieldSetValue;
  commitValue: TextFieldCommitValue;
  disabled: () => boolean;
  readOnly: () => boolean;
  required: () => boolean;
  invalid: () => boolean;
  name: () => string | undefined;
  getInput: () => TextBox | undefined;
  createInput: (options?: TextFieldInputOptions) => TextFieldInputCore;
  labelSpec: () => ElementSpec<TextButton>;
  descriptionSpec: () => ElementSpec<TextLabel>;
  messageSpec: () => ElementSpec<TextLabel>;
}
