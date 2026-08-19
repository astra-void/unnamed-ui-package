import type { DialogCore } from "@lattice-ui/core-dialog";
import { Vide } from "@lattice-ui/vide-runtime";

export const DialogContext = Vide.context<DialogCore>();

export function useDialogContext(): DialogCore {
  const core = DialogContext() as DialogCore | undefined;

  if (core === undefined) {
    error("[Dialog] context is undefined. Render this inside <Dialog.Root>.");
  }

  return core;
}
