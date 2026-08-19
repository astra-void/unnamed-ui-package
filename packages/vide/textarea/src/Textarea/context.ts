import type { TextareaCore } from "@lattice-ui/core-textarea";
import { Vide } from "@lattice-ui/vide-runtime";

export const TextareaContext = Vide.context<TextareaCore>();

export function useTextareaContext(): TextareaCore {
  const core = TextareaContext() as TextareaCore | undefined;

  if (core === undefined) {
    error("[Textarea] context is undefined. Render this inside <Textarea.Root>.");
  }

  return core;
}
