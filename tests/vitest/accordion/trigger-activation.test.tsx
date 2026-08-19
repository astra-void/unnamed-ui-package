// @vitest-environment jsdom

// Gamepad/keyboard activation tests for AccordionTrigger. After the gamepad fix
// the trigger is `Selectable` and routes `Activated` + the `Return`/`Space`
// `InputBegan` branch through one guarded toggle, so a single selection
// activation (which fires BOTH events) expands the item once instead of
// toggling it straight back closed.

import { act, cleanup, render } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

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

import { AccordionTrigger } from "../../../packages/react/accordion/src/Accordion/AccordionTrigger";
import { createAccordion } from "../../../packages/core/accordion/src/Accordion/createAccordion";
import { createStandaloneReactivity } from "../../../packages/core/runtime/src/reactivity";
import {
  AccordionContextProvider,
  AccordionItemContextProvider,
} from "../../../packages/react/accordion/src/Accordion/context";
import type { AccordionContextValue, AccordionItemContextValue } from "../../../packages/react/accordion/src/Accordion/types";

afterEach(() => {
  cleanup();
});

const RETURN = "Return";

function flushDefer() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

type EventTable = {
  Activated: () => void;
  InputBegan: (rbx: unknown, input: { KeyCode: string }) => void;
};

function captureChildProps() {
  let received: Record<string, unknown> | undefined;
  const Probe = React.forwardRef<unknown, Record<string, unknown>>((props, _ref) => {
    received = props;
    return null;
  });
  Probe.displayName = "Probe";
  return { Probe, getProps: () => received ?? {} };
}

function renderTrigger(options: {
  toggleItem?: (value: string) => void;
  itemValue?: string;
  open?: boolean;
  disabled?: boolean;
  child: React.ReactElement;
}) {
  // A real core rather than a stub: the activation guard that collapses one activation's paired
  // events lives inside the item, so a stubbed context would test nothing.
  const value = options.itemValue ?? "section";
  const core = createAccordion(createStandaloneReactivity(), {
    type: "single",
    collapsible: true,
    defaultValue: options.open ? value : "",
    onValueChange: (next) => options.toggleItem?.(typeIs(next, "string") ? next : (next as string[])[0]),
  });
  const item = core.createItem({ value, disabled: () => options.disabled === true });

  const accordionContext = {
    type: core.type(),
    openValues: core.openValues(),
    toggleItem: core.toggleItem,
    core,
  } as AccordionContextValue;
  const itemContext = {
    value,
    open: item.open(),
    disabled: item.disabled(),
    item,
  } as AccordionItemContextValue;

  return render(
    React.createElement(
      AccordionContextProvider,
      { value: accordionContext },
      React.createElement(
        AccordionItemContextProvider,
        { value: itemContext },
        React.createElement(AccordionTrigger, { asChild: true }, options.child),
      ),
    ),
  );
}

describe("AccordionTrigger gamepad activation", () => {
  it("is selectable and active when enabled", () => {
    const { Probe, getProps } = captureChildProps();
    renderTrigger({ child: React.createElement(Probe) });

    expect(getProps().Selectable).toBe(true);
    expect(getProps().Active).toBe(true);
  });

  it("is not selectable when disabled", () => {
    const { Probe, getProps } = captureChildProps();
    renderTrigger({ disabled: true, child: React.createElement(Probe) });

    expect(getProps().Selectable).toBe(false);
  });

  it("toggles the item once when one activation fires Activated and InputBegan", async () => {
    const toggleItem = vi.fn();
    const { Probe, getProps } = captureChildProps();
    renderTrigger({ toggleItem, itemValue: "faq", child: React.createElement(Probe) });

    const events = getProps().Event as EventTable;
    act(() => {
      events.Activated();
      events.InputBegan({}, { KeyCode: RETURN });
    });

    expect(toggleItem).toHaveBeenCalledTimes(1);
    expect(toggleItem).toHaveBeenCalledWith("faq");

    await act(async () => {
      await flushDefer();
    });
    act(() => {
      events.Activated();
    });
    expect(toggleItem).toHaveBeenCalledTimes(2);
  });

  it("does nothing when disabled", () => {
    const toggleItem = vi.fn();
    const { Probe, getProps } = captureChildProps();
    renderTrigger({ toggleItem, disabled: true, child: React.createElement(Probe) });

    const events = getProps().Event as EventTable;
    act(() => {
      events.Activated();
      events.InputBegan({}, { KeyCode: RETURN });
    });

    expect(toggleItem).not.toHaveBeenCalled();
  });
});
