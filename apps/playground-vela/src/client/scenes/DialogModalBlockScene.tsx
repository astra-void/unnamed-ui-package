import { Dialog } from "@lattice-ui/react-dialog";
import { React } from "@lattice-ui/react-runtime";

export function DialogModalBlockScene() {
  const [backgroundPresses, setBackgroundPresses] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  return (
    <frame className="w-230 h-130 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(760, 28)}
        Text="Default modal dialog should block clicks on background controls while open."
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
        className="top-13 w-62.5 h-11 bg-[#2f6fce] text-[#eef5fc] text-base"
      />

      <Dialog.Root onOpenChange={setOpen} open={open}>
        <Dialog.Trigger asChild>
          <textbutton
            AutoButtonColor={false}
            Text="Open Modal Dialog"
            className="left-67 top-13 w-47.5 h-11 bg-[#237f50] text-[#e7f5eb] text-base"
          />
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <frame
              AnchorPoint={new Vector2(0.5, 0.5)}
              Position={UDim2.fromScale(0.5, 0.5)}
              className="w-107.5 h-57.5 z-10 bg-[#1e2736] rounded-lg px-4 pt-3.5"
            >
              <textlabel
                Size={UDim2.fromOffset(360, 30)}
                Text="Modal Dialog"
                className="z-10 text-[#ecf1f8] text-2xl text-left"
              />
              <textlabel
                Position={UDim2.fromOffset(0, 36)}
                Size={UDim2.fromOffset(360, 62)}
                Text="Click the background counter while this is open. Count should not increase."
                TextWrapped={true}
                className="z-10 text-[#b8c3d1] text-base text-left align-top"
              />
              <Dialog.Close asChild>
                <textbutton
                  AutoButtonColor={false}
                  Position={UDim2.fromOffset(0, 146)}
                  Text="Close Dialog"
                  className="z-10 w-37.5 h-9.5 bg-[#6d47a0] text-[#f3edfa] text-base"
                />
              </Dialog.Close>
            </frame>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </frame>
  );
}
