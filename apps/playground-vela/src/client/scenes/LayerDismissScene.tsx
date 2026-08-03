import { DismissableLayer } from "@lattice-ui/react-layer";
import { React } from "@lattice-ui/react-runtime";

export function LayerDismissScene() {
  const [open, setOpen] = React.useState(false);
  const [eventCount, setEventCount] = React.useState(0);

  return (
    <frame className="w-230 h-130 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(580, 28)}
        Text="Outside click closes the layer."
        className="text-[#dfe5ed] text-xl text-left"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(360, 24)}
        Text={`Dismiss calls: ${eventCount}`}
        className="text-[#b1bac7] text-base text-left"
      />
      <textbutton
        AutoButtonColor={false}
        AutomaticSize={Enum.AutomaticSize.X}
        Event={{
          Activated: () => {
            setOpen(true);
          },
        }}
        Size={new UDim2(0, 0, 0, 42)}
        Text={open ? "Layer Opened" : "Open Dismissable Layer"}
        className="top-18 bg-accent text-accent-50 text-base px-4"
      />

      {open ? (
        <DismissableLayer
          onDismiss={() => {
            setOpen(false);
            setEventCount((value) => value + 1);
          }}
        >
          <frame
            AnchorPoint={new Vector2(0.5, 0.5)}
            Position={UDim2.fromScale(0.5, 0.5)}
            className="w-105 h-55 z-10 bg-[#212938] rounded-lg px-4.5 pt-4"
          >
            <textlabel
              Size={UDim2.fromOffset(360, 30)}
              Text="DismissableLayer"
              className="z-10 text-[#ecf1f8] text-2xl text-left"
            />
            <textlabel
              Position={UDim2.fromOffset(0, 38)}
              Size={UDim2.fromOffset(360, 60)}
              Text="Click outside this panel to dismiss it."
              TextWrapped={true}
              className="z-10 text-[#b8c3d1] text-lg text-left align-top"
            />
            <textbutton
              AutoButtonColor={false}
              Event={{
                Activated: () => {
                  setOpen(false);
                },
              }}
              Position={UDim2.fromOffset(0, 142)}
              Text="Close"
              className="z-10 w-42.5 h-10 bg-[#623a8e] text-[#f4f2f9] text-base"
            />
          </frame>
        </DismissableLayer>
      ) : undefined}
    </frame>
  );
}
