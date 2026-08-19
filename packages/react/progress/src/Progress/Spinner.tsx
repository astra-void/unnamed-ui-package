import { createSpinner } from "@lattice-ui/core-progress";
import {
  applyElementSpec,
  composeRefs,
  getPassthroughProps,
  getSlotChild,
  React,
  Slot,
  toSlotProps,
  useLatticeCore,
} from "@lattice-ui/react-runtime";
import type { SpinnerProps } from "./types";

const OWN_PROPS = ["spinning", "speedDegPerSecond", "asChild", "children"] as const;

function toGuiObject(instance: Instance | undefined) {
  if (!instance?.IsA("GuiObject")) {
    return undefined;
  }

  return instance;
}

export function Spinner(props: SpinnerProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createSpinner(rx, {
      spinning: () => propsRef.current.spinning,
      speedDegPerSecond: () => propsRef.current.speedDegPerSecond,
    }),
  );

  React.useEffect(() => {
    core.start();
  }, [core]);

  const setSpinnerRef = React.useCallback(
    (instance: Instance | undefined) => {
      core.setInstance(toGuiObject(instance));
    },
    [core],
  );

  const passthrough = getPassthroughProps<Frame>(props, OWN_PROPS);
  const merged = applyElementSpec(core.spec(), passthrough, { neutral: props.asChild !== true });
  merged.ref = composeRefs<GuiObject>(merged.ref as never, setSpinnerRef);

  if (props.asChild) {
    const child = props.children;
    if (getSlotChild(child) === undefined) {
      error("[Spinner] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <frame {...merged}>{props.children}</frame>;
}
