// A Vide component runs once. Everything here is about the consequence: a value read from the theme
// at that moment is a snapshot, and only a binding survives a re-theme.

import { Box, defaultDarkTheme, defaultLightTheme, Text } from "@lattice-ui/vide-style";
import { mountWithSystem, readProperty } from "../../test-utils/videHarness";

export = () => {
  describe("vide style primitives", () => {
    it("re-resolves sx when the theme changes", () => {
      const harness = mountWithSystem(
        () =>
          Box({
            sx: (theme) => ({ BackgroundColor3: theme.colors.surface }),
            Size: UDim2.fromOffset(100, 100),
          }) as Frame,
      );
      const box = harness.node;

      assert(
        readProperty(() => box.BackgroundColor3) === defaultDarkTheme.colors.surface,
        "Box should start on the theme it was mounted with.",
      );

      harness.setTheme(defaultLightTheme);

      assert(
        readProperty(() => box.BackgroundColor3) === defaultLightTheme.colors.surface,
        "Changing the theme should re-resolve sx without the component running again.",
      );

      harness.destroy();
    });

    it("lets a consumer prop win over sx on Box", () => {
      const harness = mountWithSystem(
        () =>
          Box({
            sx: () => ({ BackgroundTransparency: 0 }),
            BackgroundTransparency: 1,
          }) as Frame,
      );
      const box = harness.node;

      // `Box` resolves sx last, so sx wins: this is the documented order for Box and Text, and the
      // opposite of the one Stack and Grid use.
      assert(readProperty(() => box.BackgroundTransparency) === 0, "sx should win over passthrough on Box.");

      harness.destroy();
    });

    it("turns truncate into a TextTruncate value an explicit prop can still override", () => {
      const harness = mountWithSystem(() => ({
        truncated: Text({ truncate: true, Text: "a" }) as TextLabel,
        explicit: Text({ truncate: true, TextTruncate: Enum.TextTruncate.None, Text: "b" }) as TextLabel,
      }));
      const truncated = harness.node.truncated;
      const explicit = harness.node.explicit;

      assert(
        readProperty(() => truncated.TextTruncate) === Enum.TextTruncate.AtEnd,
        "truncate should clip with a trailing ellipsis.",
      );
      assert(
        readProperty(() => explicit.TextTruncate) === Enum.TextTruncate.None,
        "An explicit TextTruncate should win over the shorthand.",
      );

      harness.destroy();
    });

    it("keeps a text colour bound to the theme", () => {
      const harness = mountWithSystem(
        () =>
          Text({
            sx: (theme) => ({ TextColor3: theme.colors.textPrimary }),
            Text: "bound",
          }) as TextLabel,
      );
      const label = harness.node;

      assert(
        readProperty(() => label.TextColor3) === defaultDarkTheme.colors.textPrimary,
        "Text should start on the mounted theme.",
      );

      harness.setTheme(defaultLightTheme);

      assert(
        readProperty(() => label.TextColor3) === defaultLightTheme.colors.textPrimary,
        "A re-theme should reach the label.",
      );

      harness.destroy();
    });
  });
};
