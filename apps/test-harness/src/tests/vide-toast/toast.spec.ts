import { Vide } from "@lattice-ui/vide-runtime";
import { Toast, type ToastCore, useToast } from "@lattice-ui/vide-toast";

/**
 * Mounts a provider and hands back the queue it owns.
 *
 * `useToast` reads a context, so it has to run inside the provider's own scope — which is exactly
 * what the provider calling its children is for.
 */
function mountToast(maxVisible: number) {
  let core: ToastCore | undefined;

  const [destroy] = Vide.root(() => {
    Toast.Provider({
      maxVisible,
      defaultDurationMs: 10000,
      children: () => {
        core = useToast();
        return undefined;
      },
    });
  });

  return { destroy, core: core as ToastCore };
}

export = () => {
  describe("vide toast", () => {
    it("shows at most maxVisible toasts and queues the rest", () => {
      const { destroy, core } = mountToast(2);

      core.enqueue({ title: "one" });
      core.enqueue({ title: "two" });
      core.enqueue({ title: "three" });

      task.wait();

      assert(core.toasts().size() === 3, "Every toast is in the queue.");
      assert(core.visibleToasts().size() === 2, "Only maxVisible of them are on screen.");

      destroy();
    });

    it("lets a queued toast through once a visible one is finalized", () => {
      const { destroy, core } = mountToast(1);

      const first = core.enqueue({ title: "one" });
      core.enqueue({ title: "two" });
      task.wait();

      assert(core.visibleToasts()[0].title === "one", "The first toast is the visible one.");

      // `remove` starts the exit; `finalize` is what the motion completion reports, and only then is
      // the slot free.
      core.remove(first);
      core.finalize(first);
      task.wait();

      assert(core.visibleToasts().size() === 1, "The window is still one wide.");
      assert(core.visibleToasts()[0].title === "two", "…and the queued toast has taken the slot.");

      destroy();
    });

    it("drops a toast that never became visible without an exit", () => {
      const { destroy, core } = mountToast(1);

      core.enqueue({ title: "one" });
      const queued = core.enqueue({ title: "two" });
      task.wait();

      core.remove(queued);
      task.wait();

      assert(core.toasts().size() === 1, "A toast that never showed has nothing to animate out.");

      destroy();
    });
  });
};
