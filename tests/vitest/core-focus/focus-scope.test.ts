// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from "vitest";

// The scope core's job is lifecycle: register with the manager, keep the navigation binds held
// while some scope is active, and unregister on cleanup. Those calls are what these assert.
async function harness() {
  vi.resetModules();

  const calls = {
    registered: [] as Array<{ scopeId: number; params: Record<string, unknown> }>,
    synced: [] as number[],
    unregistered: [] as number[],
    retain: 0,
    release: 0,
  };

  let nextScopeId = 0;

  vi.doMock("../../../packages/core/focus/src/focusManager", () => ({
    createFocusScopeId: () => {
      nextScopeId += 1;
      return nextScopeId;
    },
    registerFocusScope: (scopeId: number, params: Record<string, unknown>) => {
      calls.registered.push({ scopeId, params });
    },
    syncFocusScope: (scopeId: number) => {
      calls.synced.push(scopeId);
    },
    unregisterFocusScope: (scopeId: number) => {
      calls.unregistered.push(scopeId);
    },
    retainNavigation: () => {
      calls.retain += 1;
    },
    releaseNavigation: () => {
      calls.release += 1;
    },
  }));

  const { createFocusScope } = await import("../../../packages/core/focus/src/createFocusScope");
  const { createStandaloneReactivity } = await import("../../../packages/core/runtime/src/reactivity");

  return { calls, createFocusScope, createStandaloneReactivity };
}

describe("createFocusScope", () => {
  it("registers nothing until it is started", async () => {
    const { calls, createFocusScope, createStandaloneReactivity } = await harness();
    createFocusScope(createStandaloneReactivity(), {});

    expect(calls.registered).toHaveLength(0);
    expect(calls.retain).toBe(0);
  });

  it("registers once no matter how often start is called", async () => {
    const { calls, createFocusScope, createStandaloneReactivity } = await harness();
    const scope = createFocusScope(createStandaloneReactivity(), {});

    scope.start();
    scope.start();

    expect(calls.registered).toHaveLength(1);
    expect(calls.registered[0].scopeId).toBe(scope.scopeId);
  });

  it("holds the navigation binds while active and releases them once inactive", async () => {
    const { calls, createFocusScope, createStandaloneReactivity } = await harness();
    let active = true;
    const scope = createFocusScope(createStandaloneReactivity(), { active: () => active });

    scope.start();
    expect(calls.retain).toBe(1);
    expect(calls.release).toBe(0);

    active = false;
    scope.sync();
    expect(calls.release).toBe(1);

    // Re-syncing while still inactive must not release a second time.
    scope.sync();
    expect(calls.release).toBe(1);

    active = true;
    scope.sync();
    expect(calls.retain).toBe(2);
  });

  it("never retains a scope that starts inactive", async () => {
    const { calls, createFocusScope, createStandaloneReactivity } = await harness();
    const scope = createFocusScope(createStandaloneReactivity(), { active: () => false });

    scope.start();

    expect(calls.retain).toBe(0);
  });

  it("exposes the scope's settings to the manager as live getters", async () => {
    const { calls, createFocusScope, createStandaloneReactivity } = await harness();
    let trapped = false;
    const scope = createFocusScope(createStandaloneReactivity(), {
      trapped: () => trapped,
      navStrategy: () => "ordered",
    });

    scope.start();
    const params = calls.registered[0].params;

    expect(params.getTrapped()).toBe(false);
    trapped = true;
    expect(params.getTrapped()).toBe(true);
    expect(params.getNavStrategy()).toBe("ordered");
    // Defaults the core fills in rather than the manager.
    expect(params.getRestoreFocus()).toBe(true);
    expect(params.getNavOrientation()).toBe("vertical");
    expect(params.getNavWrap()).toBe(false);
  });

  it("syncs the manager when the scope root arrives", async () => {
    const { calls, createFocusScope, createStandaloneReactivity } = await harness();
    const scope = createFocusScope(createStandaloneReactivity(), {});
    const root = { IsA: (className: string) => className === "GuiObject" };

    scope.start();
    calls.synced.length = 0;
    scope.setRoot(root);

    expect(calls.synced).toEqual([scope.scopeId]);
    expect(calls.registered[0].params.getRoot()).toBe(root);
  });

  it("releases the binds and unregisters when the reactivity is disposed", async () => {
    const { calls, createFocusScope, createStandaloneReactivity } = await harness();
    const rx = createStandaloneReactivity();
    const scope = createFocusScope(rx, { active: () => true });

    scope.start();
    rx.dispose();

    expect(calls.release).toBe(1);
    expect(calls.unregistered).toEqual([scope.scopeId]);
  });
});
