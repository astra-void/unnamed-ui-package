import type { Derivable, ElementSpec } from "@lattice-ui/core-runtime";

export type TextareaSetValue = (value: string) => void;
export type TextareaCommitValue = (value: string) => void;

export interface TextareaOptions {
  value?: Derivable<string | undefined>;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onValueCommit?: (value: string) => void;
  disabled?: Derivable<boolean | undefined>;
  readOnly?: Derivable<boolean | undefined>;
  required?: Derivable<boolean | undefined>;
  invalid?: Derivable<boolean | undefined>;
  name?: Derivable<string | undefined>;
  autoResize?: Derivable<boolean | undefined>;
  minRows?: Derivable<number | undefined>;
  maxRows?: Derivable<number | undefined>;
}

export interface TextareaInputOptions {
  disabled?: Derivable<boolean | undefined>;
  readOnly?: Derivable<boolean | undefined>;
  /** Overrides the line height auto-resize measures in. Defaults to the box's own text size. */
  lineHeight?: Derivable<number | undefined>;
}

export interface TextareaInputCore {
  disabled: () => boolean;
  readOnly: () => boolean;
  focused: () => boolean;
  spec: () => ElementSpec<TextBox>;
  setInstance: (instance: TextBox | undefined) => void;
  /** Re-measures and applies the auto-resize height. */
  applyAutoResize: () => void;
}

export interface TextareaCore {
  value: () => string;
  setValue: TextareaSetValue;
  commitValue: TextareaCommitValue;
  disabled: () => boolean;
  readOnly: () => boolean;
  required: () => boolean;
  invalid: () => boolean;
  name: () => string | undefined;
  autoResize: () => boolean;
  minRows: () => number;
  maxRows: () => number | undefined;
  getInput: () => TextBox | undefined;
  createInput: (options?: TextareaInputOptions) => TextareaInputCore;
  labelSpec: () => ElementSpec<TextButton>;
  descriptionSpec: () => ElementSpec<TextLabel>;
  messageSpec: () => ElementSpec<TextLabel>;
}
