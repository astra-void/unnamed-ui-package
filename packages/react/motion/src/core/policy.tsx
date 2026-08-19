import {
  type MotionPolicy,
  readSystemReducedMotion,
  resolveMotionPolicy,
  subscribeSystemReducedMotion,
} from "@lattice-ui/core-motion";
import { React } from "@lattice-ui/react-runtime";

type MotionPolicyContextValue = MotionPolicy & { respectSystemReducedMotion: boolean };

const MotionPolicyContext = React.createContext<MotionPolicyContextValue>({
  disableAllMotion: false,
  mode: "full",
  respectSystemReducedMotion: true,
});

export function useSystemReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(readSystemReducedMotion);

  React.useEffect(() => {
    setReduced(readSystemReducedMotion());

    return subscribeSystemReducedMotion(setReduced);
  }, []);

  return reduced;
}

export function MotionProvider(props: {
  mode?: MotionPolicy["mode"];
  disableAllMotion?: boolean;
  respectSystemReducedMotion?: boolean;
  children: React.ReactNode;
}) {
  const value = React.useMemo<MotionPolicyContextValue>(() => {
    const mode = props.disableAllMotion ? "none" : (props.mode ?? "full");
    return {
      mode,
      disableAllMotion: mode === "none",
      respectSystemReducedMotion: props.respectSystemReducedMotion ?? true,
    };
  }, [props.disableAllMotion, props.mode, props.respectSystemReducedMotion]);

  return <MotionPolicyContext.Provider value={value}>{props.children}</MotionPolicyContext.Provider>;
}

export function useMotionPolicy(): MotionPolicy {
  const ctx = React.useContext(MotionPolicyContext);
  const systemReducedMotion = useSystemReducedMotion();

  return React.useMemo<MotionPolicy>(
    () =>
      resolveMotionPolicy(
        {
          mode: ctx.mode,
          disableAllMotion: ctx.disableAllMotion,
          respectSystemReducedMotion: ctx.respectSystemReducedMotion,
        },
        systemReducedMotion,
      ),
    [ctx.disableAllMotion, ctx.mode, ctx.respectSystemReducedMotion, systemReducedMotion],
  );
}
