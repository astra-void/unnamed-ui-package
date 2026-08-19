import { createControllableState, type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import { DEFAULT_TOOLTIP_TRIGGER_ACTIVITY_STATE, updateTooltipTriggerActivity } from "./activity";
import { createDefaultTooltipPolicy } from "./createTooltipPolicy";
import type { TooltipCore, TooltipOptions, TooltipTriggerCore, TooltipTriggerOptions } from "./types";

// Roblox instance defaults are themselves a look. Neutralize only those; adapters spread them
// before consumer props so they stay overridable.
const TRIGGER_NEUTRAL: Partial<WritableInstanceProperties<TextButton>> = {
  AutoButtonColor: false,
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

const CONTENT_NEUTRAL: Partial<WritableInstanceProperties<Frame>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
};

/** Tooltip behavior, free of any UI framework. */
export function createTooltip(rx: Reactivity, options: TooltipOptions = {}): TooltipCore {
  const state = createControllableState<boolean>(rx, {
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: options.onOpenChange,
  });

  const policy = options.policy ?? createDefaultTooltipPolicy();

  let trigger: GuiObject | undefined;
  let content: GuiObject | undefined;
  let openDelayTask: thread | undefined;

  function cancelPendingOpen() {
    if (openDelayTask === undefined) {
      return;
    }

    const pending = openDelayTask;
    openDelayTask = undefined;
    pcall(() => {
      task.cancel(pending);
    });
  }

  function setOpen(nextOpen: boolean) {
    state.set(nextOpen);

    if (nextOpen) {
      policy.markOpen();
    }
  }

  function openWithDelay() {
    cancelPendingOpen();

    const resolvedDelay = policy.resolveOpenDelay(read(options.delayDuration ?? undefined));
    if (resolvedDelay <= 0) {
      setOpen(true);
      return;
    }

    openDelayTask = task.delay(resolvedDelay / 1000, () => {
      openDelayTask = undefined;
      setOpen(true);
    });
  }

  function close() {
    cancelPendingOpen();
    setOpen(false);
  }

  function createTrigger(triggerOptions: TooltipTriggerOptions = {}): TooltipTriggerCore {
    // Hover and focus are tracked together: a tooltip opened by one stays open while the other is
    // still on it, and only closes once both have gone.
    let activity = DEFAULT_TOOLTIP_TRIGGER_ACTIVITY_STATE;

    function triggerDisabled() {
      return read(triggerOptions.disabled ?? false) === true;
    }

    function applyActivity(kind: "hover" | "focus", active: boolean) {
      const result = updateTooltipTriggerActivity(activity, kind, active);
      activity = result.state;

      if (triggerDisabled()) {
        if (!active) {
          close();
        }

        return;
      }

      if (result.action === "open") {
        // Focus opens at once; hover waits out the delay, which is what stops a tooltip flashing up
        // as the pointer crosses the trigger on its way somewhere else.
        if (kind === "focus") {
          setOpen(true);
        } else {
          openWithDelay();
        }

        return;
      }

      if (result.action === "close") {
        close();
      }
    }

    return {
      disabled: triggerDisabled,
      reset: () => {
        activity = DEFAULT_TOOLTIP_TRIGGER_ACTIVITY_STATE;
        close();
      },
      spec: (): ElementSpec<TextButton> => ({
        neutral: TRIGGER_NEUTRAL,
        props: {
          Active: () => !triggerDisabled(),
          Selectable: () => !triggerDisabled(),
        },
        events: {
          MouseEnter: () => applyActivity("hover", true),
          MouseLeave: () => applyActivity("hover", false),
          SelectionGained: () => applyActivity("focus", true),
          SelectionLost: () => applyActivity("focus", false),
        },
        refs: [
          (instance) => {
            trigger = instance;
          },
        ],
      }),
    };
  }

  rx.cleanup(cancelPendingOpen);

  return {
    open: state.get,
    setOpen,
    openWithDelay,
    close,
    getTrigger: () => trigger,
    getContent: () => content,
    setTrigger: (instance) => {
      trigger = instance;
    },
    setContent: (instance) => {
      content = instance;
    },
    createTrigger,
    contentSpec: () => ({ neutral: CONTENT_NEUTRAL }),
  };
}
