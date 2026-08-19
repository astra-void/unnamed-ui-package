// @ts-nocheck
import { describe, expect, it, vi } from "vitest";
import { applyElementSpec } from "../../../packages/react/runtime/src/elementSpec";

describe("applyElementSpec", () => {
  it("lets consumer props override neutral defaults but never behavior props", () => {
    const merged = applyElementSpec(
      {
        neutral: { BackgroundTransparency: 1, Text: "" },
        props: { Active: () => true },
      },
      { BackgroundTransparency: 0, Active: false },
    );

    expect(merged.BackgroundTransparency).toBe(0);
    expect(merged.Text).toBe("");
    expect(merged.Active).toBe(true);
  });

  it("resolves derivable behavior props at apply time", () => {
    let disabled = false;
    const spec = { props: { Active: () => !disabled } };

    expect(applyElementSpec(spec, {}).Active).toBe(true);
    disabled = true;
    expect(applyElementSpec(spec, {}).Active).toBe(false);
  });

  it("passes a static behavior prop through unchanged", () => {
    expect(applyElementSpec({ props: { Visible: true } }, {}).Visible).toBe(true);
  });

  it("composes consumer events with the core's, consumer first", () => {
    const order: string[] = [];
    const merged = applyElementSpec(
      { events: { Activated: () => order.push("core") } },
      { Event: { Activated: () => order.push("consumer") } },
    );

    merged.Event.Activated();

    expect(order).toEqual(["consumer", "core"]);
  });

  it("keeps the consumer's event table when the spec has no events", () => {
    const consumer = { Activated: () => {} };
    const merged = applyElementSpec({ props: {} }, { Event: consumer });

    expect(merged.Event).toBe(consumer);
  });

  it("omits neutral defaults when asked, for asChild", () => {
    const merged = applyElementSpec(
      { neutral: { BackgroundTransparency: 1 }, props: { Active: () => true } },
      {},
      { neutral: false },
    );

    expect(merged.BackgroundTransparency).toBeUndefined();
    expect(merged.Active).toBe(true);
  });

  it("composes spec refs with the consumer's", () => {
    const consumerRef = vi.fn();
    const specRef = vi.fn();
    const merged = applyElementSpec({ refs: [specRef] }, { ref: consumerRef });

    merged.ref("instance");

    expect(consumerRef).toHaveBeenCalledWith("instance");
    expect(specRef).toHaveBeenCalledWith("instance");
  });

  it("leaves ref alone when the spec contributes none", () => {
    const consumerRef = vi.fn();

    expect(applyElementSpec({ props: {} }, { ref: consumerRef }).ref).toBe(consumerRef);
  });
});
