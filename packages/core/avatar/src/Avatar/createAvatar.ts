import { type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import { type AvatarStatus, resolveAvatarFallbackVisible } from "./state";
import type { AvatarCore, AvatarOptions } from "./types";

// Roblox instance defaults are themselves a look: a bare `textlabel` renders an opaque grey box
// labelled "Label". Neutralize only that; adapters spread these before consumer props.
const FALLBACK_NEUTRAL: Partial<WritableInstanceProperties<TextLabel>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

const DEFAULT_DELAY_MS = 250;

function hasSource(src: string | undefined) {
  return src !== undefined && src.size() > 0;
}

/** Avatar load state, free of any UI framework. */
export function createAvatar(rx: Reactivity, options: AvatarOptions = {}): AvatarCore {
  function src() {
    return read(options.src ?? undefined);
  }

  function delayMs() {
    return math.max(0, read(options.delayMs ?? DEFAULT_DELAY_MS) ?? DEFAULT_DELAY_MS);
  }

  const initialHasSource = hasSource(src());
  const statusSource = rx.source<AvatarStatus>(initialHasSource ? "loading" : "error");
  const delayElapsedSource = rx.source(!initialHasSource);

  let sequence = 0;
  let pendingDelay: thread | undefined;
  let isFirstSync = true;
  let lastSource = src();

  function cancelPendingDelay() {
    if (pendingDelay === undefined) {
      return;
    }

    pcall(() => {
      task.cancel(pendingDelay as thread);
    });
    pendingDelay = undefined;
  }

  function armDelay() {
    sequence += 1;
    const currentSequence = sequence;
    cancelPendingDelay();

    if (!hasSource(src())) {
      delayElapsedSource.set(true);
      return;
    }

    delayElapsedSource.set(false);
    pendingDelay = task.delay(delayMs() / 1000, () => {
      if (sequence !== currentSequence) {
        return;
      }

      delayElapsedSource.set(true);
    });
  }

  function syncSource() {
    const currentSource = src();
    const sourceChanged = currentSource !== lastSource;
    lastSource = currentSource;

    // The status was already seeded for the first source; resetting it here would clobber a
    // "loaded" the image reported in the same commit, and since `IsLoaded` stays true the change
    // signal never fires again — leaving the avatar permanently blank.
    if (!isFirstSync && sourceChanged) {
      statusSource.set(hasSource(currentSource) ? "loading" : "error");
    }

    isFirstSync = false;
    armDelay();
  }

  armDelay();
  rx.cleanup(cancelPendingDelay);

  return {
    src,
    status: () => statusSource.get(),
    setStatus: (status) => {
      statusSource.set(status);
    },
    delayElapsed: () => delayElapsedSource.get(),
    fallbackVisible: () => resolveAvatarFallbackVisible(statusSource.get(), delayElapsedSource.get()),
    syncSource,
    fallbackSpec: (): ElementSpec<TextLabel> => ({
      neutral: FALLBACK_NEUTRAL,
      props: { Visible: () => resolveAvatarFallbackVisible(statusSource.get(), delayElapsedSource.get()) },
    }),
  };
}
