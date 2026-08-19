import { createAvatarImage } from "@lattice-ui/core-avatar";
import {
  applyElementSpec,
  composeRefs,
  getPassthroughProps,
  React,
  Slot,
  toSlotProps,
  useLatticeCore,
} from "@lattice-ui/react-runtime";
import { useAvatarContext } from "./context";
import type { AvatarImageProps } from "./types";

const OWN_PROPS = ["asChild", "src", "children"] as const;

function toImageLabel(instance: Instance | undefined) {
  if (!instance?.IsA("ImageLabel")) {
    return undefined;
  }

  return instance;
}

export function AvatarImage(props: AvatarImageProps) {
  const avatarContext = useAvatarContext();
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createAvatarImage(rx, {
      avatar: avatarContext.core,
      src: () => propsRef.current.src,
    }),
  );

  const setImageRef = React.useCallback(
    (instance: Instance | undefined) => {
      core.setInstance(toImageLabel(instance));
    },
    [core],
  );

  const source = props.src ?? avatarContext.src;
  // `status` is a dependency so this re-runs after the root resets to "loading" on a source change:
  // a cached texture reports `IsLoaded` without ever firing the change signal again.
  React.useEffect(() => {
    core.sync();
  }, [avatarContext.status, core, source]);

  const passthrough = getPassthroughProps<ImageLabel>(props, OWN_PROPS);
  const merged = applyElementSpec(core.spec(), passthrough, { neutral: props.asChild !== true });
  merged.ref = composeRefs<Instance>(merged.ref as never, setImageRef);

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[AvatarImage] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <imagelabel {...merged}>{props.children}</imagelabel>;
}
