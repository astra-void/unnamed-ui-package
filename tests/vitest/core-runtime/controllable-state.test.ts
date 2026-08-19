// @ts-nocheck
import { describe, expect, it, vi } from "vitest";
import { createControllableState } from "../../../packages/core/runtime/src/controllableState";
import { createStandaloneReactivity } from "../../../packages/core/runtime/src/reactivity";

describe("createControllableState", () => {
  it("updates state and fires onChange when uncontrolled", () => {
    const onChange = vi.fn();
    const state = createControllableState(createStandaloneReactivity(), { defaultValue: false, onChange });

    state.set(true);

    expect(state.get()).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("suppresses redundant onChange for the current value when uncontrolled", () => {
    const onChange = vi.fn();
    const state = createControllableState(createStandaloneReactivity(), { defaultValue: true, onChange });

    state.set(true);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("chains same-frame updaters against the pending value when uncontrolled", () => {
    const onChange = vi.fn();
    const state = createControllableState(createStandaloneReactivity(), { defaultValue: 0, onChange });

    state.set((previous) => previous + 1);
    state.set((previous) => previous + 1);

    expect(state.get()).toBe(2);
    expect(onChange).toHaveBeenNthCalledWith(1, 1);
    expect(onChange).toHaveBeenNthCalledWith(2, 2);
  });

  it("re-fires onChange on every attempt when a controlled parent rejects the change", () => {
    const onChange = vi.fn();
    // The parent never adopts the value: `value` stays false, the "block close while saving"
    // controlled-rejection pattern.
    const state = createControllableState(createStandaloneReactivity(), {
      value: () => false,
      defaultValue: false,
      onChange,
    });

    state.set(true);
    state.set(true);

    expect(state.get()).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("reads the controlled value live rather than snapshotting it", () => {
    let controlled = false;
    const state = createControllableState(createStandaloneReactivity(), {
      value: () => controlled,
      defaultValue: false,
    });

    expect(state.get()).toBe(false);
    controlled = true;
    expect(state.get()).toBe(true);
    expect(state.isControlled()).toBe(true);
  });

  it("falls back to internal state when the controlled value is undefined", () => {
    const state = createControllableState(createStandaloneReactivity(), {
      value: () => undefined,
      defaultValue: false,
    });

    state.set(true);

    expect(state.isControlled()).toBe(false);
    expect(state.get()).toBe(true);
  });
});

describe("createStandaloneReactivity", () => {
  it("notifies the adapter after a source changes", () => {
    const onChange = vi.fn();
    const rx = createStandaloneReactivity({ onChange });
    const source = rx.source(0);

    source.set(1);
    expect(onChange).toHaveBeenCalledTimes(1);

    source.set(1);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("re-runs an effect when a source it read changes", () => {
    const rx = createStandaloneReactivity();
    const source = rx.source(0);
    const seen: number[] = [];

    rx.effect(() => {
      seen.push(source.get());
    });

    source.set(1);
    source.set(2);

    expect(seen).toEqual([0, 1, 2]);
  });

  it("does not record a dependency for a read inside untrack", () => {
    const rx = createStandaloneReactivity();
    const source = rx.source(0);
    let runs = 0;

    rx.effect(() => {
      runs += 1;
      rx.untrack(() => source.get());
    });

    source.set(1);

    expect(runs).toBe(1);
  });

  it("runs registered cleanups on dispose", () => {
    const rx = createStandaloneReactivity();
    const dispose = vi.fn();

    rx.cleanup(dispose);
    rx.dispose();

    expect(dispose).toHaveBeenCalledTimes(1);
  });
});
