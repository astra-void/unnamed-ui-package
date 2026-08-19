import type { TextFieldCore } from "@lattice-ui/core-text-field";
import { Vide } from "@lattice-ui/vide-runtime";

export const TextFieldContext = Vide.context<TextFieldCore>();

export function useTextFieldContext(): TextFieldCore {
  const core = TextFieldContext() as TextFieldCore | undefined;

  if (core === undefined) {
    error("[TextField] context is undefined. Render this inside <TextField.Root>.");
  }

  return core;
}
