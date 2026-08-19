import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type TextFieldProps = {
  value?: Derivable<string | undefined>;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onValueCommit?: (value: string) => void;
  disabled?: Derivable<boolean | undefined>;
  readOnly?: Derivable<boolean | undefined>;
  required?: Derivable<boolean | undefined>;
  invalid?: Derivable<boolean | undefined>;
  name?: Derivable<string | undefined>;
  /** Written as a function, so the parts read the field context after Root provides it. */
  children?: Vide.Node;
};

export type TextFieldInputProps = {
  asChild?: boolean;
  disabled?: Derivable<boolean | undefined>;
  readOnly?: Derivable<boolean | undefined>;
  children?: Vide.Node;
} & PassthroughProps<TextBox>;

export type TextFieldLabelProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type TextFieldDescriptionProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextLabel>;

export type TextFieldMessageProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextLabel>;
