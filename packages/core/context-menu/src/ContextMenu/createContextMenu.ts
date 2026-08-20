import { createMenu } from "@lattice-ui/core-menu";
import { type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import type { ContextMenuCore, ContextMenuOptions } from "./types";

const GuiService = game.GetService("GuiService");
const ZERO_VECTOR2 = new Vector2(0, 0);

// Roblox instance defaults are themselves a look. Neutralize only those; adapters spread them
// before consumer props so they stay overridable.
const TRIGGER_NEUTRAL: Partial<WritableInstanceProperties<TextButton>> = {
  AutoButtonColor: false,
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

/**
 * Converts a raw pointer position (top-bar inclusive, as `InputObject.Position` reports it) into
 * the inset-adjusted space `GuiObject.AbsolutePosition` uses, which is what the popper measures in.
 */
export function toContextMenuAnchorPosition(rawPosition: Vector3) {
  const [insetTopLeft] = GuiService.GetGuiInset();
  return new Vector2(rawPosition.X - insetTopLeft.X, rawPosition.Y - insetTopLeft.Y);
}

/**
 * Context menu behavior, free of any UI framework.
 *
 * Everything a menu does is reused from `@lattice-ui/core-menu`; what a context menu adds is that
 * it opens where the pointer is rather than under a trigger.
 */
export function createContextMenu(rx: Reactivity, options: ContextMenuOptions = {}): ContextMenuCore {
  const menu = createMenu(rx, {
    open: options.open,
    defaultOpen: options.defaultOpen ?? false,
    modal: options.modal,
    onOpenChange: options.onOpenChange,
    focusInstance: options.focusInstance,
  });

  const anchorPositionSource = rx.source<Vector2>(ZERO_VECTOR2);
  let virtualAnchor: GuiObject | undefined;

  return {
    open: menu.open,
    setOpen: menu.setOpen,
    modal: menu.modal,
    anchorPosition: () => anchorPositionSource.get(),
    openAtPosition: (position) => {
      anchorPositionSource.set(position);
      menu.setOpen(true);
    },
    getVirtualAnchor: () => virtualAnchor,
    setVirtualAnchor: (instance) => {
      virtualAnchor = instance;
    },
    getContent: menu.getContent,
    setContent: menu.setContent,
    // The trigger is the surface that was right-clicked, so a press on it is not outside.
    getInsideRoots: menu.getInsideRoots,
    focusFirstItem: menu.focusFirstItem,
    restoreTriggerFocus: menu.restoreTriggerFocus,
    createItem: menu.createItem,
    triggerSpec: (triggerOptions = {}): ElementSpec<TextButton> => {
      function disabled() {
        return read(triggerOptions.disabled ?? false) === true;
      }

      return {
        neutral: TRIGGER_NEUTRAL,
        props: {
          Active: () => !disabled(),
          Selectable: false,
        },
        events: {
          InputBegan: ((_rbx: GuiObject, inputObject: InputObject) => {
            if (disabled()) {
              return;
            }

            if (inputObject.UserInputType !== Enum.UserInputType.MouseButton2) {
              return;
            }

            anchorPositionSource.set(toContextMenuAnchorPosition(inputObject.Position));
            menu.setOpen(true);
          }) as Callback,
        },
        refs: [(instance) => menu.setTrigger(instance)],
      };
    },
    contentSpec: menu.contentSpec,
    groupSpec: menu.groupSpec,
    separatorSpec: menu.separatorSpec,
    labelSpec: menu.labelSpec,
  };
}
