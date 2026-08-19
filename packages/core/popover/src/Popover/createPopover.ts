import { createControllableState, type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import type { PopoverCore, PopoverOptions, PopoverTriggerOptions } from "./types";

// Roblox instance defaults are themselves a look: a bare `textbutton` renders an opaque grey box
// labelled "Button", and a bare frame an opaque grey rectangle. Neutralize only that; every real
// appearance decision belongs to the consumer, and adapters spread these before consumer props.
const BUTTON_NEUTRAL: Partial<WritableInstanceProperties<TextButton>> = {
  AutoButtonColor: false,
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

const FRAME_NEUTRAL: Partial<WritableInstanceProperties<Frame>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
};

/**
 * Popover behavior, free of any UI framework: open state, the instances that positioning and
 * dismissal are measured against, and what each part renders.
 *
 * Everything with a timing or layering dimension lives next door — presence and the layer stack in
 * `@lattice-ui/core-layer`, placement in `@lattice-ui/core-popper` — and an adapter composes them.
 */
export function createPopover(rx: Reactivity, options: PopoverOptions = {}): PopoverCore {
  const state = createControllableState<boolean>(rx, {
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: options.onOpenChange,
  });

  let trigger: GuiObject | undefined;
  let anchor: GuiObject | undefined;
  let content: GuiObject | undefined;

  function setTrigger(instance: GuiObject | undefined) {
    const previousTrigger = trigger;
    trigger = instance;

    // The trigger doubles as the anchor until a `Popover.Anchor` claims the role, and it takes the
    // role back when the anchor it set is the one going away.
    if (anchor === undefined || anchor === previousTrigger) {
      anchor = instance;
    }
  }

  function toggle() {
    const open = state.get();

    if (!open) {
      // Focus before opening: dismissal restores focus to wherever it was, and that has to be the
      // trigger rather than whatever the pointer last touched.
      options.focusInstance?.(trigger);
    }

    state.set(!open);
  }

  function triggerSpec(triggerOptions: PopoverTriggerOptions = {}): ElementSpec<TextButton> {
    function disabled() {
      return read(triggerOptions.disabled ?? false) === true;
    }

    return {
      neutral: BUTTON_NEUTRAL,
      props: {
        Active: () => !disabled(),
        // The trigger is reachable through focus navigation, not through Roblox's own selection
        // sweep, so it stays out of the selectable set.
        Selectable: false,
      },
      events: {
        Activated: () => {
          if (disabled()) {
            return;
          }

          toggle();
        },
      },
      refs: [(instance) => setTrigger(instance)],
    };
  }

  return {
    open: state.get,
    setOpen: (open: boolean) => {
      state.set(open);
    },
    modal: () => read(options.modal ?? false) === true,

    setTrigger,
    setAnchor: (instance) => {
      anchor = instance;
    },
    setContent: (instance) => {
      content = instance;
    },
    getTrigger: () => trigger,
    getAnchor: () => anchor,
    getContent: () => content,
    getInsideRoots: () => [trigger, anchor],

    triggerSpec,
    closeSpec: () => ({
      neutral: BUTTON_NEUTRAL,
      props: { Active: true, Selectable: false },
      events: {
        Activated: () => {
          state.set(false);
        },
      },
    }),
    anchorSpec: () => ({
      neutral: FRAME_NEUTRAL,
      refs: [
        (instance) => {
          anchor = instance;
        },
      ],
    }),
    contentSpec: () => ({
      neutral: FRAME_NEUTRAL,
      props: {
        // The content host measures itself so the popper can position it: measurement, not appearance.
        AutomaticSize: Enum.AutomaticSize.XY,
      },
      refs: [
        (instance) => {
          content = instance;
        },
      ],
    }),
  };
}
