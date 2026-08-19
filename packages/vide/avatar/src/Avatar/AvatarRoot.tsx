import { createAvatar } from "@lattice-ui/core-avatar";
import { createVideReactivity, read, Vide } from "@lattice-ui/vide-runtime";
import { AvatarContext } from "./context";
import type { AvatarProps } from "./types";

export function AvatarRoot(props: AvatarProps) {
  const rx = createVideReactivity();
  const core = createAvatar(rx, { src: props.src, delayMs: props.delayMs });

  // A source among the inputs re-arms the reveal delay. Untracked around the call itself: the core
  // writes its own status and delay sources there, and tracking those would re-enter forever.
  rx.effect(() => {
    read(props.src ?? undefined);
    read(props.delayMs ?? undefined);

    Vide.untrack(() => {
      core.syncSource();
    });
  });

  return AvatarContext(core, () => props.children);
}

export { AvatarRoot as Avatar };
