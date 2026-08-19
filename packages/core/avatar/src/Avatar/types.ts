import type { Derivable, ElementSpec } from "@lattice-ui/core-runtime";
import type { AvatarStatus } from "./state";

export interface AvatarOptions {
  src?: Derivable<string | undefined>;
  /** How long a slow load stays blank before the fallback appears. */
  delayMs?: Derivable<number | undefined>;
}

export interface AvatarCore {
  src: () => string | undefined;
  status: () => AvatarStatus;
  setStatus: (status: AvatarStatus) => void;
  delayElapsed: () => boolean;
  fallbackVisible: () => boolean;
  /**
   * Re-reads the source and re-arms the reveal delay.
   *
   * Edge-triggered on the source changing, which is not something the core can observe: a React
   * caller passes a plain string. See §3.5 of the architecture doc.
   */
  syncSource: () => void;
  fallbackSpec: () => ElementSpec<TextLabel>;
}

export interface AvatarImageOptions {
  avatar: AvatarCore;
  /** Overrides the root's source for this image. */
  src?: Derivable<string | undefined>;
}

export interface AvatarImageCore {
  src: () => string | undefined;
  spec: () => ElementSpec<ImageLabel>;
  setInstance: (instance: ImageLabel | undefined) => void;
  /** Reports the current load state and watches for it changing. Call when the source changes. */
  sync: () => void;
}
