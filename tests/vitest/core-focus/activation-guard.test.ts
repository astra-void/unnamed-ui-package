// @ts-nocheck
import { describe, expect, it } from "vitest";
import { createActivationGuard } from "../../../packages/core/focus/src/activationGuard";

// The roblox shim maps task.defer onto queueMicrotask, so a macrotask tick flushes the deferred
// reset the guard schedules.
function flushDefer() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe("createActivationGuard", () => {
  it("lets only the first claim of one activation win", () => {
    const claim = createActivationGuard();

    expect(claim()).toBe(true);
    expect(claim()).toBe(false);
    expect(claim()).toBe(false);
  });

  it("re-arms for the next activation once the deferred reset runs", async () => {
    const claim = createActivationGuard();

    expect(claim()).toBe(true);
    expect(claim()).toBe(false);

    await flushDefer();

    expect(claim()).toBe(true);
  });

  it("keeps guards independent of each other", () => {
    const first = createActivationGuard();
    const second = createActivationGuard();

    expect(first()).toBe(true);
    expect(second()).toBe(true);
  });
});
