import { type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import type { AvatarImageCore, AvatarImageOptions } from "./types";

const NEUTRAL: Partial<WritableInstanceProperties<ImageLabel>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
};

function hasSource(src: string | undefined) {
  return src !== undefined && src.size() > 0;
}

/**
 * The image half of an avatar: reports what the texture is doing back to the root.
 *
 * A cached texture never fires `IsLoaded` again, so the current value is read on every sync as well
 * as watched — otherwise a source the player already has stays blank forever.
 */
export function createAvatarImage(rx: Reactivity, options: AvatarImageOptions): AvatarImageCore {
  const avatar = options.avatar;
  let instance: ImageLabel | undefined;
  let connection: RBXScriptConnection | undefined;

  function src() {
    return read(options.src ?? undefined) ?? avatar.src();
  }

  function disconnect() {
    connection?.Disconnect();
    connection = undefined;
  }

  function sync() {
    disconnect();

    const source = src();
    if (!hasSource(source)) {
      avatar.setStatus("error");
      return;
    }

    avatar.setStatus("loading");

    const image = instance;
    if (image === undefined) {
      return;
    }

    if (image.IsLoaded) {
      avatar.setStatus("loaded");
    }

    connection = image.GetPropertyChangedSignal("IsLoaded").Connect(() => {
      if (image.IsLoaded) {
        avatar.setStatus("loaded");
      }
    });
  }

  rx.cleanup(disconnect);

  return {
    src,
    spec: (): ElementSpec<ImageLabel> => ({
      neutral: NEUTRAL,
      props: {
        // `Image` is data, not appearance: it is the source the load state is derived from.
        Image: () => src() ?? "",
        Visible: () => avatar.status() === "loaded",
      },
    }),
    setInstance: (nextInstance) => {
      instance = nextInstance;
    },
    sync,
  };
}
