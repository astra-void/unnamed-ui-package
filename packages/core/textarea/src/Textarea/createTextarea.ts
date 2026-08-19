import { createControllableState, type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import { resolveAutoResizeSize, resolveTextareaHeight } from "./autoResize";
import type { TextareaCore, TextareaInputCore, TextareaInputOptions, TextareaOptions } from "./types";

// Roblox instance defaults are themselves a look. Neutralize only those; adapters spread them
// before consumer props, and the controlled `Text` lands after them.
const INPUT_NEUTRAL: Partial<WritableInstanceProperties<TextBox>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

const LABEL_NEUTRAL: Partial<WritableInstanceProperties<TextButton>> = {
  AutoButtonColor: false,
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

const TEXT_NEUTRAL: Partial<WritableInstanceProperties<TextLabel>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
  Text: "",
};

/** Padding a consumer added as `UIPadding` children, which auto-resize has to leave room for. */
function resolveVerticalPadding(textBox: TextBox) {
  let verticalPadding = 0;

  for (const child of textBox.GetChildren()) {
    if (!child.IsA("UIPadding")) {
      continue;
    }

    verticalPadding += child.PaddingTop.Offset + child.PaddingBottom.Offset;
    verticalPadding += math.floor(child.PaddingTop.Scale * textBox.AbsoluteSize.Y);
    verticalPadding += math.floor(child.PaddingBottom.Scale * textBox.AbsoluteSize.Y);
  }

  return verticalPadding;
}

function resolveLineHeight(textBox: TextBox, explicitLineHeight: number | undefined) {
  if (explicitLineHeight !== undefined) {
    return math.max(1, explicitLineHeight);
  }

  return math.max(1, math.ceil(textBox.TextSize * 1.2));
}

function resolveMeasuredRows(textBox: TextBox, lineHeight: number) {
  const textBoundsHeight = math.max(lineHeight, textBox.TextBounds.Y);
  return math.max(1, math.ceil(textBoundsHeight / lineHeight));
}

/** Textarea behavior, free of any UI framework. */
export function createTextarea(rx: Reactivity, options: TextareaOptions = {}): TextareaCore {
  const state = createControllableState<string>(rx, {
    value: options.value,
    defaultValue: options.defaultValue ?? "",
    onChange: options.onValueChange,
  });

  let input: TextBox | undefined;

  function disabled() {
    return read(options.disabled ?? false) === true;
  }

  function readOnly() {
    return read(options.readOnly ?? false) === true;
  }

  function autoResize() {
    return read(options.autoResize ?? false) === true;
  }

  function minRows() {
    return math.max(1, read(options.minRows ?? 1) ?? 1);
  }

  function maxRows() {
    return read(options.maxRows ?? undefined);
  }

  function setValue(nextValue: string) {
    if (disabled() || readOnly()) {
      return;
    }

    state.set(nextValue);
  }

  function commitValue(nextValue: string) {
    options.onValueCommit?.(nextValue);
  }

  function createInput(inputOptions: TextareaInputOptions = {}): TextareaInputCore {
    const focusedSource = rx.source(false);

    function inputDisabled() {
      return disabled() || read(inputOptions.disabled ?? false) === true;
    }

    function inputReadOnly() {
      return readOnly() || read(inputOptions.readOnly ?? false) === true;
    }

    function applyAutoResizeTo(textBox: TextBox) {
      if (!autoResize()) {
        return;
      }

      const lineHeight = resolveLineHeight(textBox, read(inputOptions.lineHeight ?? undefined));
      const height = resolveTextareaHeight(textBox.Text, {
        lineHeight,
        minRows: minRows(),
        maxRows: maxRows(),
        verticalPadding: resolveVerticalPadding(textBox),
        measuredRows: resolveMeasuredRows(textBox, lineHeight),
      });

      const nextSize = resolveAutoResizeSize(textBox.Size, height);
      if (nextSize !== undefined) {
        textBox.Size = nextSize;
      }
    }

    function applyAutoResize() {
      const textBox = input;
      if (textBox === undefined) {
        return;
      }

      applyAutoResizeTo(textBox);
      // Again after the engine has laid the text out: TextBounds is a frame behind the edit that
      // caused it, so the first pass sizes to the previous content.
      task.defer(() => {
        if (input === textBox) {
          applyAutoResizeTo(textBox);
        }
      });
    }

    return {
      disabled: inputDisabled,
      readOnly: inputReadOnly,
      focused: () => focusedSource.get(),
      setInstance: (instance) => {
        input = instance;
      },
      applyAutoResize,
      spec: (): ElementSpec<TextBox> => ({
        neutral: INPUT_NEUTRAL,
        props: {
          Active: () => !inputDisabled(),
          ClearTextOnFocus: false,
          MultiLine: true,
          Selectable: () => !inputDisabled(),
          Text: () => state.get(),
          TextEditable: () => !inputDisabled() && !inputReadOnly(),
          // Multiline only wraps at the box edge when TextWrapped is on; without it the text runs
          // off the side instead of growing downward, and auto-resize measures nothing.
          TextWrapped: true,
        },
        changes: {
          Text: ((textBox: TextBox) => {
            if (inputDisabled() || inputReadOnly()) {
              if (textBox.Text !== state.get()) {
                textBox.Text = state.get();
              }

              applyAutoResizeTo(textBox);
              return;
            }

            setValue(textBox.Text);
            applyAutoResize();
          }) as Callback,
        },
        events: {
          Focused: (() => {
            focusedSource.set(true);
          }) as Callback,
          FocusLost: ((textBox: TextBox) => {
            focusedSource.set(false);

            if (inputDisabled()) {
              return;
            }

            commitValue(textBox.Text);
          }) as Callback,
        },
      }),
    };
  }

  return {
    value: state.get,
    setValue,
    commitValue,
    disabled,
    readOnly,
    required: () => read(options.required ?? false) === true,
    invalid: () => read(options.invalid ?? false) === true,
    name: () => read(options.name ?? undefined),
    autoResize,
    minRows,
    maxRows,
    getInput: () => input,
    createInput,
    labelSpec: (): ElementSpec<TextButton> => ({
      neutral: LABEL_NEUTRAL,
      props: {
        Active: () => !disabled(),
        Selectable: () => !disabled(),
      },
      events: {
        Activated: () => {
          if (disabled()) {
            return;
          }

          input?.CaptureFocus();
        },
      },
    }),
    descriptionSpec: () => ({ neutral: TEXT_NEUTRAL }),
    messageSpec: () => ({ neutral: TEXT_NEUTRAL }),
  };
}
