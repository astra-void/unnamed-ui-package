import { Presence } from "@lattice-ui/react-layer";
import { React } from "@lattice-ui/react-runtime";

type ExitCardProps = {
  isPresent: boolean;
  onExitComplete: () => void;
};

function ExitAnimatedCard(props: ExitCardProps) {
  React.useEffect(() => {
    if (props.isPresent) {
      return;
    }

    const delayThread = task.delay(0.35, () => {
      props.onExitComplete();
    });

    return () => {
      if (delayThread !== coroutine.running()) {
        task.cancel(delayThread);
      }
    };
  }, [props.isPresent, props.onExitComplete]);

  return (
    // `BackgroundTransparency` is driven by state. vela's `opacity-*` is a fixed
    // integer, and a computed class value would take the runtime path, so this
    // one property stays an instance prop — preflight leaves explicit props alone.
    <frame
      BackgroundTransparency={props.isPresent ? 0 : 0.55}
      Position={UDim2.fromOffset(0, 122)}
      className="w-105 h-47.5 bg-[#1f2e47] rounded-lg px-4 pt-3.5"
    >
      <textlabel
        Size={UDim2.fromOffset(320, 30)}
        Text={props.isPresent ? "Present: mounted" : "Present: exiting..."}
        className="text-[#e2eaf5] text-xl text-left"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 38)}
        Size={UDim2.fromOffset(360, 58)}
        Text="When set to false, this card stays mounted briefly, then unmounts via onExitComplete."
        TextWrapped={true}
        className="text-[#b7c2d0] text-base text-left align-top"
      />
    </frame>
  );
}

export function PresenceScene() {
  const [present, setPresent] = React.useState(true);
  const [unmountCount, setUnmountCount] = React.useState(0);

  return (
    <frame className="w-230 h-130 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(760, 28)}
        Text="Presence keeps node mounted while exiting."
        className="text-[#dfe5ed] text-xl text-left"
      />
      {/*
        Two static branches rather than one class string with a ternary in it:
        a computed `className` drops to vela's runtime resolver, which would
        keep `bg-*` but silently discard `text-*`.
      */}
      {present ? (
        <textbutton
          AutoButtonColor={false}
          Event={{
            Activated: () => {
              setPresent(false);
            },
          }}
          Text="Set present=false"
          className="top-13 w-55 h-11 bg-[#b04e40] text-[#f3f5f9] text-base"
        />
      ) : (
        <textbutton
          AutoButtonColor={false}
          Event={{
            Activated: () => {
              setPresent(true);
            },
          }}
          Text="Set present=true"
          className="top-13 w-55 h-11 bg-[#237f50] text-[#f3f5f9] text-base"
        />
      )}
      <textlabel
        Position={UDim2.fromOffset(236, 61)}
        Size={UDim2.fromOffset(300, 24)}
        Text={`Unmount complete count: ${unmountCount}`}
        className="text-[#b1bac7] text-base text-left"
      />

      <Presence
        exitFallbackMs={1000}
        onExitComplete={() => {
          setUnmountCount((value) => value + 1);
        }}
        present={present}
        render={(state) => <ExitAnimatedCard isPresent={state.isPresent} onExitComplete={state.onExitComplete} />}
      />
    </frame>
  );
}
