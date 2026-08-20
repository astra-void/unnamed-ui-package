// @ts-nocheck

// Value retention lives in `@lattice-ui/core-select` now, so these drive the core directly: an item
// registers when the popup opens and unregisters when it closes, and the selected value has to
// survive the close without being mistaken for a selection that disappeared.

import { describe, expect, it } from "vitest";
import { createSelect } from "../../../packages/core/select/src/Select/createSelect";
import { createStandaloneReactivity } from "../../../packages/core/runtime/src/reactivity";

function makeSelect(options = {}) {
  return createSelect(createStandaloneReactivity(), options);
}

/**
 * Registers an item on its own reactivity, so it can be disposed independently.
 *
 * Registration only bumps the revision; settling the value is the adapter's call once the whole
 * batch has landed, which is what `core.syncValue()` stands in for here.
 */
function register(core, value, options = {}) {
  const rx = createStandaloneReactivity();
  const item = core.createItem(rx, {
    value,
    disabled: () => options.disabled === true,
    getTextValue: () => options.textValue ?? value,
    getGuiObject: () => undefined,
  });

  item.register();

  return { item, unregister: () => rx.dispose() };
}

describe("select value retention", () => {
  it("keeps defaultValue when no items are registered (popup closed at mount)", () => {
    const core = makeSelect({ defaultValue: "beta" });

    expect(core.value()).toBe("beta");
  });

  it("keeps the selected value after all items unregister (popup closes)", () => {
    const core = makeSelect({ defaultValue: "beta" });

    const alpha = register(core, "alpha");
    const beta = register(core, "beta");
    core.syncValue();
    expect(core.value()).toBe("beta");

    alpha.unregister();
    beta.unregister();
    core.syncValue();

    expect(core.value()).toBe("beta");
  });

  it("still falls back when the registry is non-empty and the value is invalid", () => {
    const core = makeSelect({ defaultValue: "ghost" });

    register(core, "alpha");
    register(core, "beta");
    core.syncValue();

    expect(core.value()).toBe("alpha");
  });

  it("still falls back off a disabled selected item", () => {
    const core = makeSelect({ defaultValue: "beta" });

    register(core, "alpha");
    register(core, "beta", { disabled: true });
    core.syncValue();

    expect(core.value()).toBe("alpha");
  });

  it("refuses to open while disabled, but still closes", () => {
    const core = makeSelect({ disabled: () => true, defaultOpen: true });

    core.setOpen(false);
    expect(core.open()).toBe(false);

    core.setOpen(true);
    expect(core.open()).toBe(false);
  });

  it("reports an item's text for the current selection", () => {
    const core = makeSelect({ defaultValue: "alpha" });
    register(core, "alpha", { textValue: "Alpha" });

    expect(core.getItemText("alpha")).toBe("Alpha");
    expect(core.getItemText("ghost")).toBeUndefined();
  });
});
