import { createControllableState, type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import type { TextFieldCore, TextFieldInputCore, TextFieldInputOptions, TextFieldOptions } from "./types";

// Roblox instance defaults are themselves a look: a bare `textbox` renders an opaque grey box
// labelled "TextBox", a bare `textlabel` one labelled "Label". Neutralize only that; adapters spread
// these before consumer props, and the controlled `Text` lands after them.
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

/** Text field behavior, free of any UI framework. */
export function createTextField(rx: Reactivity, options: TextFieldOptions = {}): TextFieldCore {
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

  function setValue(nextValue: string) {
    if (disabled() || readOnly()) {
      return;
    }

    state.set(nextValue);
  }

  function commitValue(nextValue: string) {
    options.onValueCommit?.(nextValue);
  }

  function createInput(inputOptions: TextFieldInputOptions = {}): TextFieldInputCore {
    const focusedSource = rx.source(false);

    function inputDisabled() {
      return disabled() || read(inputOptions.disabled ?? false) === true;
    }

    function inputReadOnly() {
      return readOnly() || read(inputOptions.readOnly ?? false) === true;
    }

    return {
      disabled: inputDisabled,
      readOnly: inputReadOnly,
      focused: () => focusedSource.get(),
      setInstance: (instance) => {
        input = instance;
      },
      spec: (): ElementSpec<TextBox> => ({
        neutral: INPUT_NEUTRAL,
        props: {
          Active: () => !inputDisabled(),
          // Focusing a field should not wipe what it holds; a consumer wanting that behaviour can
          // ask for it, but it cannot be the default for a controlled value.
          ClearTextOnFocus: false,
          Selectable: () => !inputDisabled(),
          Text: () => state.get(),
          TextEditable: () => !inputDisabled() && !inputReadOnly(),
        },
        changes: {
          Text: ((textBox: TextBox) => {
            if (inputDisabled() || inputReadOnly()) {
              // A read-only box still accepts typing at the engine level, so the value is put back.
              if (textBox.Text !== state.get()) {
                textBox.Text = state.get();
              }

              return;
            }

            setValue(textBox.Text);
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
    getInput: () => input,
    createInput,
    labelSpec: (): ElementSpec<TextButton> => ({
      neutral: LABEL_NEUTRAL,
      props: {
        Active: () => !disabled(),
        Selectable: () => !disabled(),
      },
      events: {
        // Activating the label puts the caret in the field, which is the label's whole job.
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
