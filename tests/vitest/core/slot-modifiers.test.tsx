// @vitest-environment jsdom

// A Tailwind-style transform (vela-rbxts) lowers `className` at the call site into Roblox props
// plus UI modifier children, so an `asChild` part can receive `<uicorner/>` as a SIBLING of the
// element the consumer wrote. Slot has to clone the consumer's element, not the modifier, and the
// modifier has to end up underneath it rather than being dropped.

import { cleanup, render } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { getSlotChild, resolveSlotChildren, Slot } from "../../../packages/react/runtime/src/slot";

afterEach(cleanup);

afterEach(() => {
  receivedProps = undefined;
});

let receivedProps: Record<string, unknown> | undefined;

function Probe(props: Record<string, unknown>) {
  receivedProps = props;
  return null;
}

describe("resolveSlotChildren", () => {
  it("treats a lone element as the target", () => {
    const { target, modifiers } = resolveSlotChildren(<Probe />);
    expect(target).toBeTruthy();
    expect(modifiers).toHaveLength(0);
  });

  // Under @rbxts/react, `createElement` rewrites a host tag to its Roblox class name before it
  // builds the element, so in Roblox the `<uicorner/>` a transform emitted reaches Slot as
  // `"UICorner"`.
  it("recognises modifiers by their Roblox class name", () => {
    const { target, modifiers } = resolveSlotChildren(
      <>
        {React.createElement("UICorner", { key: "c" })}
        {React.createElement("UIListLayout", { key: "l" })}
        {React.createElement("UIPadding", { key: "p" })}
        <Probe />
      </>,
    );

    expect((target as React.ReactElement).type).toBe(Probe);
    expect(modifiers).toHaveLength(3);
  });

  // loom's preview renderer re-exports browser React's `createElement` untouched and resolves the
  // class name only when it creates the instance, so under it the same element arrives as the tag
  // that was written. Matching the class name alone made every modifier read as a second target
  // there, which is what failed the docs site's `asChild` switch preview.
  it("recognises modifiers by their JSX tag", () => {
    const { target, modifiers } = resolveSlotChildren(
      <>
        {React.createElement("uicorner", { key: "c" })}
        {React.createElement("uilistlayout", { key: "l" })}
        {React.createElement("uipadding", { key: "p" })}
        <Probe />
      </>,
    );

    expect((target as React.ReactElement).type).toBe(Probe);
    expect(modifiers).toHaveLength(3);
  });

  // The complete set of creatable `UIComponent` classes. Both spellings have to classify, so that
  // neither runtime can hand Slot a modifier it reads as a second target.
  const MODIFIER_CLASS_NAMES = [
    "UIAspectRatioConstraint",
    "UICorner",
    "UIDragDetector",
    "UIFlexItem",
    "UIGradient",
    "UIGridLayout",
    "UIListLayout",
    "UIPadding",
    "UIPageLayout",
    "UIScale",
    "UIShadow",
    "UISizeConstraint",
    "UIStroke",
    "UITableLayout",
    "UITextSizeConstraint",
  ];

  it.each(MODIFIER_CLASS_NAMES)("classifies %s written either way", (className) => {
    for (const elementType of [className, className.toLowerCase()]) {
      const { target, modifiers } = resolveSlotChildren(
        <>
          {React.createElement(elementType, { key: "m" })}
          <Probe />
        </>,
      );

      expect((target as React.ReactElement).type).toBe(Probe);
      expect(modifiers).toHaveLength(1);
    }
  });

  it("picks the non-modifier element out of a modifier-prefixed subtree", () => {
    const { target, modifiers } = resolveSlotChildren(
      <>
        {React.createElement("UICorner", { key: "c" })}
        {React.createElement("UIPadding", { key: "p" })}
        <Probe />
      </>,
    );

    expect((target as React.ReactElement).type).toBe(Probe);
    expect(modifiers).toHaveLength(2);
  });

  it("looks through a fragment holding a single element", () => {
    expect(
      getSlotChild(
        <>
          <Probe />
        </>,
      ),
    ).toBeTruthy();
  });

  it("still refuses two real candidates", () => {
    expect(
      getSlotChild(
        <>
          <Probe />
          <Probe />
        </>,
      ),
    ).toBeUndefined();
  });

  it.each(["UICorner", "uicorner"])("refuses a subtree holding only a %s", (elementType) => {
    expect(getSlotChild(React.createElement(elementType))).toBeUndefined();
  });
});

describe("Slot with modifier siblings", () => {
  it.each(["UICorner", "uicorner"])("clones the consumer's element and re-parents a %s under it", (elementType) => {
    render(
      <Slot BackgroundColor3="red">
        {React.createElement(elementType, { key: "c" })}
        <Probe>
          <span data-testid="own" />
        </Probe>
      </Slot>,
    );

    // The slot props landed on the consumer's element, not on the uicorner.
    expect(receivedProps?.BackgroundColor3).toBe("red");

    const children = React.Children.toArray(receivedProps?.children as React.ReactNode);
    expect(children).toHaveLength(2);
    expect((children[0] as React.ReactElement).type).toBe(elementType);
    // The element's own children survive alongside the injected modifier.
    expect((children[1] as React.ReactElement).type).toBe("span");
  });

  // `resolveSlotChildren` keys the modifiers by walking the subtree with `toArray`, and the
  // element's own children are keyed by a second `toArray` — both number from `.0`, so merging the
  // lists unchanged handed React a duplicate key, which it may resolve by omitting a child rather
  // than by warning. Reachable from any modifier sibling on an element that has children of its
  // own, which is what the docs site's switch preview renders.
  it("keys the injected modifiers apart from the element's own children", () => {
    render(
      <Slot>
        {React.createElement("uicorner", { key: "c" })}
        {React.createElement("uipadding", { key: "p" })}
        <Probe>
          <span data-testid="first" />
          <span data-testid="second" />
        </Probe>
      </Slot>,
    );

    const children = receivedProps?.children as React.ReactElement[];
    expect(children).toHaveLength(4);

    const keys = children.map((child) => child.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("leaves children untouched when there are no modifiers", () => {
    render(
      <Slot BackgroundColor3="red">
        <Probe>
          <span data-testid="own" />
        </Probe>
      </Slot>,
    );

    expect((receivedProps?.children as React.ReactElement).type).toBe("span");
  });

  it("errors when the subtree holds more than one candidate", () => {
    expect(() =>
      render(
        <Slot>
          <Probe />
          <Probe />
        </Slot>,
      ),
    ).toThrow();
  });
});
