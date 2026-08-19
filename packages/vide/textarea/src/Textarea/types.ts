import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type TextareaProps = {
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
  /** Written as a function, so the parts read the textarea context after Root provides it. */
  children?: Vide.Node;
};

export type TextareaInputProps = {
  asChild?: boolean;
  disabled?: Derivable<boolean | undefined>;
  readOnly?: Derivable<boolean | undefined>;
  lineHeight?: Derivable<number | undefined>;
  children?: Vide.Node;
} & PassthroughProps<TextBox>;

export type TextareaLabelProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type TextareaDescriptionProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextLabel>;

export type TextareaMessageProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextLabel>;
