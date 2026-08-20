import { MotionProvider, useMotionPolicy } from "@lattice-ui/vide-motion";
import { Vide } from "@lattice-ui/vide-runtime";

export = () => {
  describe("vide motion policy", () => {
    it("follows a preference source while the tree is up", () => {
      const disableAllMotion = Vide.source(false);
      let policy: (() => { mode: string; disableAllMotion: boolean }) | undefined;

      const [destroy] = Vide.root(() => {
        MotionProvider({
          disableAllMotion,
          children: () => {
            policy = useMotionPolicy();
            return undefined;
          },
        });
      });

      const read = policy as () => { mode: string; disableAllMotion: boolean };

      assert(read().disableAllMotion === false, "Motion starts on.");

      // A Vide component runs once, so a preference read at that moment would fix the policy for the
      // lifetime of the tree. The preferences are derivable for exactly this reason.
      disableAllMotion(true);
      assert(read().disableAllMotion, "Flipping the source should reach the policy.");
      assert(read().mode === "none", "…and the mode with it.");

      disableAllMotion(false);
      assert(read().disableAllMotion === false, "Turning it back on should reach it too.");

      destroy();
    });

    it("keeps the mode and the disable flag in agreement with no provider above it", () => {
      // Whether motion is on here depends on the player's reduced-motion setting, which a spec has
      // no business overriding. What must hold either way is that the two halves of the policy agree.
      const [destroy, policy] = Vide.root(() => useMotionPolicy());

      assert(
        policy().disableAllMotion === (policy().mode === "none"),
        'A disabled policy is exactly a policy whose mode is "none".',
      );

      destroy();
    });
  });
};
