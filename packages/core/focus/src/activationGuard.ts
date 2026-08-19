export type ActivationGuard = () => boolean;

/**
 * Dedupes the gamepad/keyboard "double-fire" on a selectable button.
 *
 * Once a button is `Selectable` and owns a focus node, a single selection
 * activation (gamepad `ButtonA`, or `Return`/`Space` while selected) makes the
 * engine fire BOTH `Activated` and an `InputBegan` carrying `KeyCode.Return`/
 * `Space`. A handler wired on both events therefore runs twice; for toggle-style
 * actions (`setOpen(!open)`, `toggleItem`, `toggleValue`) the second run cancels
 * the first and the button appears inert.
 *
 * The returned `claim()` gives `true` to the first caller of an activation and
 * `false` to any further call before the next scheduler resumption, which is
 * when the claim clears — so distinct activations in separate frames are always
 * handled and only the paired events of one activation collapse.
 */
export function createActivationGuard(): ActivationGuard {
  let claimed = false;

  return () => {
    if (claimed) {
      return false;
    }

    claimed = true;
    task.defer(() => {
      claimed = false;
    });

    return true;
  };
}
