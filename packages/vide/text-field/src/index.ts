import { TextFieldDescription } from "./TextField/TextFieldDescription";
import { TextFieldInput } from "./TextField/TextFieldInput";
import { TextFieldLabel } from "./TextField/TextFieldLabel";
import { TextFieldMessage } from "./TextField/TextFieldMessage";
import { TextFieldRoot } from "./TextField/TextFieldRoot";

export const TextField = {
  Root: TextFieldRoot,
  Input: TextFieldInput,
  Label: TextFieldLabel,
  Description: TextFieldDescription,
  Message: TextFieldMessage,
} as const satisfies {
  Root: typeof TextFieldRoot;
  Input: typeof TextFieldInput;
  Label: typeof TextFieldLabel;
  Description: typeof TextFieldDescription;
  Message: typeof TextFieldMessage;
};

export { useTextFieldContext } from "./TextField/context";
export type {
  TextFieldDescriptionProps,
  TextFieldInputProps,
  TextFieldLabelProps,
  TextFieldMessageProps,
  TextFieldProps,
} from "./TextField/types";
export { TextFieldDescription, TextFieldInput, TextFieldLabel, TextFieldMessage, TextFieldRoot };
