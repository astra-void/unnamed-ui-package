import {
  applyElementSpec,
  getPassthroughProps,
  React,
  Slot,
  toSlotProps,
  useLatticeCore,
} from "@lattice-ui/react-runtime";
import { useTooltipContext } from "./context";
import type { TooltipTriggerProps } from "./types";

const OWN_PROPS = ["asChild", "disabled", "children"] as const;

export function TooltipTrigger(props: TooltipTriggerProps) {
  const core = useTooltipContext().core;
  const propsRef = React.useRef(props);
  propsRef.current = props;

  // Built once, so hover and focus accumulate on one activity state rather than resetting each
  // render.
  const trigger = useLatticeCore(() => core.createTrigger({ disabled: () => propsRef.current.disabled }));

  // A trigger disabled while its tooltip is up has to drop both the tooltip and the activity that
  // opened it, or re-enabling would reopen from a stale state.
  React.useEffect(() => {
    if (props.disabled !== true) {
      return;
    }

    trigger.reset();
  }, [props.disabled, trigger]);

  const passthrough = getPassthroughProps<TextButton>(props, OWN_PROPS);
  const merged = applyElementSpec(trigger.spec(), passthrough, { neutral: props.asChild !== true });

  if (props.asChild) {
    const child = props.children;
    if (!child) {
      error("[TooltipTrigger] `asChild` requires a child element.");
    }

    // No neutral defaults here: the rendered element belongs to the consumer.
    return <Slot {...toSlotProps(merged)}>{child}</Slot>;
  }

  return <textbutton {...merged}>{props.children}</textbutton>;
}
