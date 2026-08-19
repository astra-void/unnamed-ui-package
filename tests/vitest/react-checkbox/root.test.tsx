// @vitest-environment jsdom
// @ts-nocheck

// CheckboxRoot delegates its behavior to `@lattice-ui/core-checkbox`. These cover the seam: that
// the adapter keeps feeding the core this render's props, and that what the core describes reaches
// the rendered element.

import { act, cleanup, render } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@lattice-ui/react-runtime", async () => {
  const elementSpec = await import("../../../packages/react/runtime/src/elementSpec");
  const runtimeProps = await import("../../../packages/react/runtime/src/props");
  const reactivity = await import("../../../packages/react/runtime/src/reactivity");
  const strictContext = await import("../../../packages/react/runtime/src/context");
  const react = await import("react");

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
    applyElementSpec: elementSpec.applyElementSpec,
    getPassthroughProps: runtimeProps.getPassthroughProps,
    getSlotChild: (children: unknown) => (react.default.isValidElement(children) ? children : undefined),
    toSlotProps: runtimeProps.toSlotProps,
    useLatticeCore: reactivity.useLatticeCore,
    React: react.default,
    Slot,
    createStrictContext: strictContext.createStrictContext,
  };
});

import { CheckboxRoot } from "../../../packages/react/checkbox/src/Checkbox/CheckboxRoot";

afterEach(() => {
  cleanup();
});

function captureChildProps() {
  let received: Record<string, unknown> | undefined;
  const Probe = React.forwardRef<unknown, Record<string, unknown>>((props) => {
    received = props;
    return null;
  });
  Probe.displayName = "Probe";
  return { Probe, getProps: () => received ?? {} };
}

function renderRoot(props: Record<string, unknown> = {}) {
  const { Probe, getProps } = captureChildProps();
  const utils = render(React.createElement(CheckboxRoot, { asChild: true, ...props }, React.createElement(Probe)));

  return {
    ...utils,
    getProps,
    activate: () => act(() => getProps().Event.Activated()),
    rerenderWith: (next: Record<string, unknown>) =>
      utils.rerender(
        React.createElement(CheckboxRoot, { asChild: true, ...props, ...next }, React.createElement(Probe)),
      ),
  };
}

describe("CheckboxRoot", () => {
  it("toggles and reports the change when uncontrolled", () => {
    const onCheckedChange = vi.fn();
    const { activate } = renderRoot({ onCheckedChange });

    activate();
    expect(onCheckedChange).toHaveBeenNthCalledWith(1, true);

    activate();
    expect(onCheckedChange).toHaveBeenNthCalledWith(2, false);
  });

  it("resolves an indeterminate default to checked", () => {
    const onCheckedChange = vi.fn();
    const { activate } = renderRoot({ defaultChecked: "indeterminate", onCheckedChange });

    activate();

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("stays under the parent's control when controlled, and keeps reporting rejected attempts", () => {
    const onCheckedChange = vi.fn();
    const { activate } = renderRoot({ checked: false, onCheckedChange });

    activate();
    activate();

    expect(onCheckedChange).toHaveBeenCalledTimes(2);
    expect(onCheckedChange).toHaveBeenNthCalledWith(2, true);
  });

  it("does not toggle while disabled, and marks the element inert", () => {
    const onCheckedChange = vi.fn();
    const { activate, getProps } = renderRoot({ disabled: true, onCheckedChange });

    expect(getProps().Active).toBe(false);
    expect(getProps().Selectable).toBe(false);

    activate();

    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("sees prop changes after the core was built", () => {
    const onCheckedChange = vi.fn();
    const view = renderRoot({ disabled: true, onCheckedChange });

    view.activate();
    expect(onCheckedChange).not.toHaveBeenCalled();

    view.rerenderWith({ disabled: false });
    view.activate();

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("dispatches to the latest onCheckedChange, not the one the core was built with", () => {
    const first = vi.fn();
    const second = vi.fn();
    const view = renderRoot({ onCheckedChange: first });

    view.rerenderWith({ onCheckedChange: second });
    view.activate();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(true);
  });

  it("composes a consumer's Activated handler with the toggle instead of replacing it", () => {
    const order: string[] = [];
    const { getProps } = renderRoot({
      onCheckedChange: () => order.push("core"),
      Event: { Activated: () => order.push("consumer") },
    });

    act(() => getProps().Event.Activated());

    expect(order).toEqual(["consumer", "core"]);
  });

  it("applies no neutral defaults under asChild", () => {
    const { getProps } = renderRoot();

    expect(getProps().BackgroundTransparency).toBeUndefined();
    expect(getProps().Text).toBeUndefined();
  });
});
