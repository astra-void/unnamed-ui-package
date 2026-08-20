// @ts-nocheck

// The closed-state input sync lives in `@lattice-ui/core-combobox` now, so these drive the core
// directly. Items only exist while the popup is open, which is what makes the label cache and the
// "never sync before the first open" rule load-bearing.

import { describe, expect, it, vi } from "vitest";
import { createCombobox } from "../../../packages/core/combobox/src/Combobox/createCombobox";
import { createStandaloneReactivity } from "../../../packages/core/runtime/src/reactivity";

function makeCombobox(options = {}) {
  return createCombobox(createStandaloneReactivity(), options);
}

/** Registers an item on its own reactivity, so it can be disposed independently. */
function register(core, value, text) {
  const rx = createStandaloneReactivity();
  const item = core.createItem(rx, {
    value,
    getTextValue: () => text,
    getGuiObject: () => undefined,
  });

  item.register();

  return { item, unregister: () => rx.dispose() };
}

/** What an adapter does when `open` changes. */
function setOpen(core, open) {
  core.setOpen(open);
  core.syncForcedValue();
  core.syncOpenState();
}

describe("combobox closed-state input sync", () => {
  it("preserves defaultInputValue at mount", () => {
    const onInputValueChange = vi.fn();
    const core = makeCombobox({ defaultInputValue: "hello", onInputValueChange });

    expect(core.inputValue()).toBe("hello");
    expect(onInputValueChange).not.toHaveBeenCalled();
  });

  it("keeps defaultValue at mount even though its label is not resolvable yet", () => {
    const core = makeCombobox({ defaultValue: "beta" });

    expect(core.value()).toBe("beta");
  });

  it("syncs the input to the selected label after the popup opens and closes", () => {
    const core = makeCombobox({ defaultValue: "beta" });

    setOpen(core, true);
    register(core, "beta", "Beta Option");
    setOpen(core, false);

    expect(core.inputValue()).toBe("Beta Option");
  });

  it("retains the selected label after its item unregisters", () => {
    const core = makeCombobox({ defaultValue: "beta" });

    setOpen(core, true);
    const beta = register(core, "beta", "Beta Option");
    beta.unregister();
    setOpen(core, false);

    expect(core.inputValue()).toBe("Beta Option");
  });

  it("treats a cleared box as no selection, but only once the popup closes", () => {
    const core = makeCombobox({ defaultValue: "beta" });

    setOpen(core, true);
    register(core, "beta", "Beta Option");
    core.setInputValue("");

    // Still selected while the player is mid-search.
    expect(core.value()).toBe("beta");

    setOpen(core, false);
    expect(core.value()).toBeUndefined();
    expect(core.inputValue()).toBe("");
  });

  it("filters against the typed query while open and the settled input while closed", () => {
    const core = makeCombobox({ defaultValue: "beta" });

    setOpen(core, true);
    register(core, "beta", "Beta Option");
    core.setInputValue("bet");
    expect(core.queryValue()).toBe("bet");

    setOpen(core, false);
    // Reopening a settled combobox must not filter by the label already in the box.
    expect(core.queryValue()).toBe("Beta Option");
    setOpen(core, true);
    expect(core.queryValue()).toBe("");
  });

  it("ignores the echo of a value it wrote into the input itself", () => {
    const onInputValueChange = vi.fn();
    const core = makeCombobox({ onInputValueChange });

    setOpen(core, true);
    register(core, "beta", "Beta Option");
    core.setValue("beta");
    expect(core.inputValue()).toBe("Beta Option");

    // The TextBox reports back the write the primitive just made; that is not the player typing.
    onInputValueChange.mockClear();
    core.setInputValue("Beta Option");

    expect(onInputValueChange).not.toHaveBeenCalled();
  });

  it("refuses to open while disabled, but still closes", () => {
    const core = makeCombobox({ disabled: () => true, defaultOpen: true });

    core.setOpen(false);
    expect(core.open()).toBe(false);

    core.setOpen(true);
    expect(core.open()).toBe(false);
  });
});
