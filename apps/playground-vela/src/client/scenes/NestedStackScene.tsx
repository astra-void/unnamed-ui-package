import { DismissableLayer } from "@lattice-ui/react-layer";
import { React } from "@lattice-ui/react-runtime";

export function NestedStackScene() {
  const [outerOpen, setOuterOpen] = React.useState(false);
  const [innerOpen, setInnerOpen] = React.useState(false);

  return (
    <frame className="w-230 h-130 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(720, 28)}
        Text="Open Outer -> Open Inner. Outside click should dismiss the inner layer before the outer one."
        className="text-[#dfe5ed] text-xl text-left truncate"
      />
      <textbutton
        AutoButtonColor={false}
        Event={{
          Activated: () => {
            setOuterOpen(true);
          },
        }}
        Text="Open Outer Layer"
        className="top-13 w-45 h-10 bg-accent text-accent-50 text-base"
      />

      {outerOpen ? (
        <DismissableLayer
          onDismiss={() => {
            setInnerOpen(false);
            setOuterOpen(false);
          }}
        >
          <frame
            AnchorPoint={new Vector2(0.5, 0.5)}
            Position={UDim2.fromScale(0.5, 0.5)}
            className="w-125 h-80 z-10 bg-[#192638] rounded-lg px-4.5 pt-4"
          >
            {/*
              `z-*` only ships 0/10/20/30/40/50, so the intra-panel ZIndex 11
              and 21 the sibling scene uses stay instance props.
            */}
            <textlabel
              Size={UDim2.fromOffset(420, 30)}
              Text="Outer Layer"
              ZIndex={11}
              className="text-[#ecf1f8] text-2xl text-left"
            />
            <textbutton
              AutoButtonColor={false}
              Event={{
                Activated: () => {
                  setInnerOpen(true);
                },
              }}
              ZIndex={11}
              Text="Open Inner Layer"
              className="top-14.5 w-45 h-9.5 bg-[#237f50] text-[#e8f6eb] text-base"
            />
            <textbutton
              AutoButtonColor={false}
              Event={{
                Activated: () => {
                  setInnerOpen(false);
                  setOuterOpen(false);
                },
              }}
              ZIndex={11}
              Text="Close Outer"
              className="left-48.5 top-14.5 w-37.5 h-9.5 bg-[#5c387d] text-[#f5eff8] text-base"
            />
          </frame>

          {innerOpen ? (
            <DismissableLayer
              onDismiss={() => {
                setInnerOpen(false);
              }}
            >
              <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                Position={UDim2.fromScale(0.5, 0.5)}
                className="w-80 h-42.5 z-20 bg-[#2d1f44] rounded-lg px-4 pt-3.5"
              >
                <textlabel
                  Size={UDim2.fromOffset(260, 28)}
                  Text="Inner Layer"
                  ZIndex={21}
                  className="text-[#f0e8fb] text-xl text-left"
                />
                <textlabel
                  Position={UDim2.fromOffset(0, 32)}
                  Size={UDim2.fromOffset(260, 46)}
                  Text="Outside click should close this one first."
                  TextWrapped={true}
                  ZIndex={21}
                  className="text-[#ccbddf] text-sm text-left align-top"
                />
                <textbutton
                  AutoButtonColor={false}
                  Event={{
                    Activated: () => {
                      setInnerOpen(false);
                    },
                  }}
                  ZIndex={21}
                  Text="Close Inner"
                  className="top-25.5 w-32.5 h-8.5 bg-[#744daa] text-[#f5effb] text-sm"
                />
              </frame>
            </DismissableLayer>
          ) : undefined}
        </DismissableLayer>
      ) : undefined}
    </frame>
  );
}
