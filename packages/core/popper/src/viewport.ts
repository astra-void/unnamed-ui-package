const WorkspaceService = game.GetService("Workspace");
const GuiService = game.GetService("GuiService");

/**
 * Resolves the valid AbsolutePosition-space rect for a ScreenGui.
 *
 * AbsolutePosition is measured from the top-left of the inset-adjusted area:
 * - IgnoreGuiInset=true: the gui spans the full screen, so its content starts
 *   ABOVE the origin — valid range is [-inset, AbsoluteSize - inset].
 * - IgnoreGuiInset=false: the gui starts below the topbar at the origin —
 *   valid range is [0, AbsoluteSize] (AbsoluteSize already excludes the inset).
 *
 * Exported for tests.
 */
export function resolveScreenGuiViewportRect(
  ignoreGuiInset: boolean,
  absoluteSize: Vector2,
  topLeftInset: Vector2,
): Rect {
  const min = ignoreGuiInset ? new Vector2(-topLeftInset.X, -topLeftInset.Y) : new Vector2(0, 0);
  return new Rect(min, new Vector2(min.X + absoluteSize.X, min.Y + absoluteSize.Y));
}

/**
 * Bounds used for collision detection and clamping.
 *
 * The nearest ScreenGui ancestor is more accurate than the camera viewport for portalled content and
 * for plugin guis, which is why it is preferred over the camera whenever one is found.
 */
export function getViewportRect(node: GuiObject | undefined): Rect {
  if (node) {
    let current: Instance | undefined = node;
    while (current) {
      if (current.IsA("ScreenGui")) {
        const [topLeftInset] = GuiService.GetGuiInset();
        return resolveScreenGuiViewportRect(current.IgnoreGuiInset, current.AbsoluteSize, topLeftInset);
      }
      current = current.Parent;
    }
  }

  const viewportSize = WorkspaceService.CurrentCamera?.ViewportSize ?? new Vector2(1920, 1080);
  return new Rect(new Vector2(0, 0), viewportSize);
}
