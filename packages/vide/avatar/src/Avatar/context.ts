import type { AvatarCore } from "@lattice-ui/core-avatar";
import { Vide } from "@lattice-ui/vide-runtime";

export const AvatarContext = Vide.context<AvatarCore>();

export function useAvatarContext(): AvatarCore {
  const core = AvatarContext() as AvatarCore | undefined;

  if (core === undefined) {
    error("[Avatar] context is undefined. Render this inside <Avatar.Root>.");
  }

  return core;
}
