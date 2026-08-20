// @vitest-environment jsdom

// Gamepad/keyboard activation tests for Select's trigger and items. After the
// gamepad fix both become `Selectable` and route `Activated` + the
// `Return`/`Space` `InputBegan` branch through one guarded handler, so a single
// selection activation (which fires BOTH events) acts exactly once.

import { act, cleanup, render } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

// Mocked Slot records the props the primitive forwards to an asChild child, so
// we can read `Selectable`/`Active` and invoke the composed `Event` handlers.
vi.mock("@lattice-ui/react-runtime", async () => {
  const runtimeProps = await import("../../../packages/react/runtime/src/props");
  const runtimeRefs = await import("../../../packages/react/runtime/src/refs");
  const react = await import("react");
  const strictContext = await import("../../../packages/react/runtime/src/context");

  function Slot(props: { children?: React.ReactNode } & Record<string, unknown>) {
    const { children, ...slotProps } = props;
    if (!react.default.isValidElement(children)) {
      return null;
    }
    return react.default.cloneElement(children, {
      ...(children.props as Record<string, unknown>),
      ...slotProps,
    });
  }

  return {

    useLatticeCore: (await import("../../../packages/react/runtime/src/reactivity")).useLatticeCore,

    applyElementSpec: (await import("../../../packages/react/runtime/src/elementSpec")).applyElementSpec,
    composeEvents: runtimeProps.composeEvents,
    getPassthroughProps: runtimeProps.getPassthroughProps,
    toSlotProps: runtimeProps.toSlotProps,
    composeRefs: runtimeRefs.composeRefs,
    React: react.default,
    Slot,
    createStrictContext: strictContext.createStrictContext,
  };
});

// Use the real activation guard; stub the focus-node registration (it reaches
// into GuiService, which is irrelevant to activation dispatch).
vi.mock("@lattice-ui/react-focus", async () => {
  const guard = await import("../../../packages/react/focus/src/useActivationGuard");
  return {
    useActivationGuard: guard.useActivationGuard,
    useFocusNode: () => ({ current: undefined }),
  };
});

vi.mock("@lattice-ui/react-motion", () => ({
  createSelectionResponseRecipe: () => ({}),
  useResponseMotion: () => ({ current: undefined }),
}));

import { SelectContextProvider } from "../../../packages/react/select/src/Select/context";
import { SelectItem } from "../../../packages/react/select/src/Select/SelectItem";
import { SelectTrigger } from "../../../packages/react/select/src/Select/SelectTrigger";
import { createSelect } from "../../../packages/core/select/src/Select/createSelect";
import { createStandaloneReactivity } from "../../../packages/core/runtime/src/reactivity";
import type { SelectContextValue } from "../../../packages/react/select/src/Select/types";

afterEach(() => {
  cleanup();
});

const RETURN = "Return";

function flushDefer() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// A real core: the activation guard that collapses one activation's paired events lives in the
// trigger it builds, so a stubbed context would test nothing.
function makeContext(
  overrides: {
    open?: boolean;
    disabled?: boolean;
    setOpen?: (open: boolean) => void;
    setValue?: (value: string) => void;
  } = {},
) {
  const core = createSelect(createStandaloneReactivity(), {
    defaultOpen: overrides.open ?? false,
    disabled: () => overrides.disabled === true,
    onOpenChange: (open) => overrides.setOpen?.(open),
    onValueChange: (value) => overrides.setValue?.(value),
  });

  return {
    open: core.open(),
    setOpen: core.setOpen,
    value: core.value(),
    setValue: core.setValue,
    disabled: core.disabled(),
    required: core.required(),
    getItemText: core.getItemText,
    core,
  } as SelectContextValue;
}

function captureChildProps() {
  let received: Record<string, unknown> | undefined;
  const Probe = React.forwardRef<unknown, Record<string, unknown>>((props, _ref) => {
    received = props;
    return null;
  });
  Probe.displayName = "Probe";
  return { Probe, getProps: () => received ?? {} };
}

function renderInSelect(context: SelectContextValue, node: React.ReactElement) {
  return render(React.createElement(SelectContextProvider, { value: context }, node));
}

type EventTable = {
  Activated: () => void;
  InputBegan: (rbx: unknown, input: { KeyCode: string }) => void;
};

describe("SelectTrigger gamepad activation", () => {
  it("is selectable and active when enabled", () => {
    const { Probe, getProps } = captureChildProps();
    renderInSelect(makeContext(), React.createElement(SelectTrigger, { asChild: true }, React.createElement(Probe)));

    expect(getProps().Selectable).toBe(true);
    expect(getProps().Active).toBe(true);
  });

  it("is not selectable when disabled", () => {
    const { Probe, getProps } = captureChildProps();
    renderInSelect(
      makeContext({ disabled: true }),
      React.createElement(SelectTrigger, { asChild: true }, React.createElement(Probe)),
    );

    expect(getProps().Selectable).toBe(false);
  });

  it("toggles open once when one activation fires Activated and InputBegan", async () => {
    const setOpen = vi.fn();
    const { Probe, getProps } = captureChildProps();
    renderInSelect(
      makeContext({ open: false, setOpen }),
      React.createElement(SelectTrigger, { asChild: true }, React.createElement(Probe)),
    );

    const events = getProps().Event as EventTable;
    act(() => {
      events.Activated();
      events.InputBegan({}, { KeyCode: RETURN });
    });

    expect(setOpen).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(true);

    // A separate activation on a later frame still works.
    await act(async () => {
      await flushDefer();
    });
    act(() => {
      events.Activated();
    });
    expect(setOpen).toHaveBeenCalledTimes(2);
  });

  it("does nothing when disabled", () => {
    const setOpen = vi.fn();
    const { Probe, getProps } = captureChildProps();
    renderInSelect(
      makeContext({ disabled: true, setOpen }),
      React.createElement(SelectTrigger, { asChild: true }, React.createElement(Probe)),
    );

    const events = getProps().Event as EventTable;
    act(() => {
      events.Activated();
      events.InputBegan({}, { KeyCode: RETURN });
    });

    expect(setOpen).not.toHaveBeenCalled();
  });
});

describe("SelectItem gamepad activation", () => {
  it("is selectable when enabled and commits its value once per activation", () => {
    const setValue = vi.fn();
    const setOpen = vi.fn();
    const { Probe, getProps } = captureChildProps();
    renderInSelect(
      makeContext({ open: true, setValue, setOpen }),
      React.createElement(SelectItem, { value: "apple", asChild: true }, React.createElement(Probe)),
    );

    expect(getProps().Selectable).toBe(true);

    const events = getProps().Event as EventTable;
    act(() => {
      events.Activated();
      events.InputBegan({}, { KeyCode: RETURN });
    });

    expect(setValue).toHaveBeenCalledTimes(1);
    expect(setValue).toHaveBeenCalledWith("apple");
    expect(setOpen).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it("is not selectable and inert when disabled", () => {
    const setValue = vi.fn();
    const { Probe, getProps } = captureChildProps();
    renderInSelect(
      makeContext(),
      React.createElement(SelectItem, { value: "apple", asChild: true, disabled: true }, React.createElement(Probe)),
    );

    expect(getProps().Selectable).toBe(false);

    const events = getProps().Event as EventTable;
    act(() => {
      events.Activated();
      events.InputBegan({}, { KeyCode: RETURN });
    });

    expect(setValue).not.toHaveBeenCalled();
  });
});
