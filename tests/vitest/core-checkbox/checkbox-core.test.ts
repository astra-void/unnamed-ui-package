// @ts-nocheck
import { describe, expect, it, vi } from "vitest";
import { createCheckbox } from "../../../packages/core/checkbox/src/Checkbox/createCheckbox";
import { createStandaloneReactivity } from "../../../packages/core/runtime/src/reactivity";

function core(options = {}) {
  return createCheckbox(createStandaloneReactivity(), options);
}

describe("createCheckbox", () => {
  it("defaults to unchecked and toggles on activation", () => {
    const checkbox = core();

    expect(checkbox.checked()).toBe(false);
    checkbox.toggle();
    expect(checkbox.checked()).toBe(true);
    checkbox.toggle();
    expect(checkbox.checked()).toBe(false);
  });

  it("resolves indeterminate to checked rather than toggling it away", () => {
    const checkbox = core({ defaultChecked: "indeterminate" });

    expect(checkbox.indicator.present()).toBe(true);
    checkbox.toggle();
    expect(checkbox.checked()).toBe(true);
  });

  it("reports the indicator as present for checked and indeterminate only", () => {
    expect(core({ defaultChecked: false }).indicator.present()).toBe(false);
    expect(core({ defaultChecked: true }).indicator.present()).toBe(true);
    expect(core({ defaultChecked: "indeterminate" }).indicator.present()).toBe(true);
  });

  it("ignores toggle and setChecked while disabled", () => {
    const onCheckedChange = vi.fn();
    const checkbox = core({ disabled: () => true, onCheckedChange });

    checkbox.toggle();
    checkbox.setChecked(true);

    expect(checkbox.checked()).toBe(false);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("reads disabled live, so re-enabling restores activation", () => {
    let disabled = true;
    const checkbox = core({ disabled: () => disabled });

    checkbox.toggle();
    expect(checkbox.checked()).toBe(false);

    disabled = false;
    checkbox.toggle();
    expect(checkbox.checked()).toBe(true);
  });

  it("keeps a controlled value under the parent's control", () => {
    const onCheckedChange = vi.fn();
    const checkbox = core({ checked: () => false, onCheckedChange });

    checkbox.toggle();

    expect(checkbox.checked()).toBe(false);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("describes the root without appearance, and with behavior that follows disabled", () => {
    let disabled = false;
    const checkbox = core({ disabled: () => disabled });
    const spec = checkbox.rootSpec();

    expect(spec.neutral).toEqual({
      AutoButtonColor: false,
      BackgroundTransparency: 1,
      BorderSizePixel: 0,
      Text: "",
    });

    expect(spec.props.Active()).toBe(true);
    disabled = true;
    expect(spec.props.Active()).toBe(false);
    expect(spec.props.Selectable()).toBe(false);
  });

  it("toggles through the Activated handler the spec exposes", () => {
    const checkbox = core();

    checkbox.rootSpec().events.Activated();

    expect(checkbox.checked()).toBe(true);
  });

  it("exposes required without letting it affect behavior", () => {
    expect(core({ required: () => true }).required()).toBe(true);
    expect(core().required()).toBe(false);
  });
});
