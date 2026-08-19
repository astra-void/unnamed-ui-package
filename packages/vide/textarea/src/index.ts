import { TextareaDescription } from "./Textarea/TextareaDescription";
import { TextareaInput } from "./Textarea/TextareaInput";
import { TextareaLabel } from "./Textarea/TextareaLabel";
import { TextareaMessage } from "./Textarea/TextareaMessage";
import { TextareaRoot } from "./Textarea/TextareaRoot";

export const Textarea = {
  Root: TextareaRoot,
  Input: TextareaInput,
  Label: TextareaLabel,
  Description: TextareaDescription,
  Message: TextareaMessage,
} as const satisfies {
  Root: typeof TextareaRoot;
  Input: typeof TextareaInput;
  Label: typeof TextareaLabel;
  Description: typeof TextareaDescription;
  Message: typeof TextareaMessage;
};

export { useTextareaContext } from "./Textarea/context";
export type {
  TextareaDescriptionProps,
  TextareaInputProps,
  TextareaLabelProps,
  TextareaMessageProps,
  TextareaProps,
} from "./Textarea/types";
export { TextareaDescription, TextareaInput, TextareaLabel, TextareaMessage, TextareaRoot };
