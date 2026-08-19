import { createAvatarImage } from "@lattice-ui/core-avatar";
import {
  applyElementSpec,
  applySlotProps,
  createVideReactivity,
  getPassthroughProps,
  read,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import { useAvatarContext } from "./context";
import type { AvatarImageProps } from "./types";

const OWN_PROPS = ["asChild", "src", "children"] as const;

export function AvatarImage(props: AvatarImageProps) {
  const avatar = useAvatarContext();
  const rx = createVideReactivity();
  const core = createAvatarImage(rx, { avatar, src: props.src });

  const passthrough = getPassthroughProps<ImageLabel>(props, OWN_PROPS);
  const merged = applyElementSpec(core.spec(), passthrough, { neutral: props.asChild !== true });

  let element: ImageLabel;

  if (props.asChild === true) {
    const child = resolveSlotInstance(props.children);
    if (child === undefined) {
      error("[AvatarImage] `asChild` requires a child instance.");
    }

    // No neutral defaults here: the rendered instance belongs to the consumer.
    element = applySlotProps(child as ImageLabel, merged);
  } else {
    merged.action = (created: ImageLabel) => core.setInstance(created);
    element = (<imagelabel {...merged}>{props.children}</imagelabel>) as ImageLabel;
  }

  if (props.asChild === true) {
    core.setInstance(element);
  }

  // Re-reports on a source change and after the root resets the status: a cached texture reports
  // `IsLoaded` without the change signal ever firing again.
  rx.effect(() => {
    read(props.src ?? undefined);
    avatar.status();

    Vide.untrack(() => {
      core.sync();
    });
  });

  return element;
}
