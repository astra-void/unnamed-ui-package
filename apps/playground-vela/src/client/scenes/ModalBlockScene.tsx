import { DismissableLayer } from "@lattice-ui/react-layer";
import { React } from "@lattice-ui/react-runtime";

export function ModalBlockScene() {
  const [backgroundPresses, setBackgroundPresses] = React.useState(0);
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <frame className="w-230 h-130 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(760, 28)}
        Text="When modal is open, background button clicks should be blocked."
        className="text-[#dfe5ed] text-xl text-left truncate"
      />
      <textbutton
        AutoButtonColor={false}
        Event={{
          Activated: () => {
            setBackgroundPresses((value) => value + 1);
          },
        }}
        Text={`Background Count: ${backgroundPresses}`}
        className="top-13 w-57.5 h-11 bg-[#2f6fce] text-[#eef5fc] text-base"
      />
      <textbutton
        AutoButtonColor={false}
        Event={{
          Activated: () => {
            setModalOpen(true);
          },
        }}
        Text="Open Modal"
        className="left-62 top-13 w-42.5 h-11 bg-[#237f50] text-[#e7f5eb] text-base"
      />

      {modalOpen ? (
        <DismissableLayer
          modal={true}
          onDismiss={() => {
            setModalOpen(false);
          }}
        >
          <frame
            AnchorPoint={new Vector2(0.5, 0.5)}
            Position={UDim2.fromScale(0.5, 0.5)}
            className="w-105 h-55 z-10 bg-[#1e2736] rounded-lg px-4 pt-3.5"
          >
            <textlabel
              Size={UDim2.fromOffset(340, 30)}
              Text="Modal Layer"
              className="z-10 text-[#ecf1f8] text-2xl text-left"
            />
            <textlabel
              Position={UDim2.fromOffset(0, 36)}
              Size={UDim2.fromOffset(350, 62)}
              Text="Try clicking the background counter button while this modal is open."
              TextWrapped={true}
              className="z-10 text-[#b8c3d1] text-base text-left align-top"
            />
            <textbutton
              AutoButtonColor={false}
              Event={{
                Activated: () => {
                  setModalOpen(false);
                },
              }}
              Position={UDim2.fromOffset(0, 146)}
              Text="Close"
              className="z-10 w-32.5 h-9.5 bg-[#6d47a0] text-[#f3edfa] text-base"
            />
          </frame>
        </DismissableLayer>
      ) : undefined}
    </frame>
  );
}
