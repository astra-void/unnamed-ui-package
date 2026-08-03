import { Dialog } from "@lattice-ui/react-dialog";
import { React } from "@lattice-ui/react-runtime";

export function DialogNestedScene() {
  const [outerOpen, setOuterOpen] = React.useState(false);
  const [innerOpen, setInnerOpen] = React.useState(false);

  return (
    <frame className="w-230 h-130 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(760, 28)}
        Text="Open outer then inner. Click outside the inner dialog first, then outside the outer dialog."
        className="text-[#dfe5ed] text-xl text-left truncate"
      />

      <Dialog.Root
        onOpenChange={(nextOpen) => {
          setOuterOpen(nextOpen);
          if (!nextOpen) {
            setInnerOpen(false);
          }
        }}
        open={outerOpen}
      >
        <Dialog.Trigger asChild>
          <textbutton
            AutoButtonColor={false}
            Text="Open Outer Dialog"
            className="top-13 w-45 h-10 bg-accent text-accent-50 text-base"
          />
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <frame
              AnchorPoint={new Vector2(0.5, 0.5)}
              Position={UDim2.fromScale(0.5, 0.5)}
              className="w-130 h-85 z-10 bg-[#192638] rounded-lg px-4.5 pt-4"
            >
              <textlabel
                Size={UDim2.fromOffset(420, 30)}
                Text="Outer Dialog"
                ZIndex={11}
                className="text-[#ecf1f8] text-2xl text-left"
              />
              <Dialog.Root onOpenChange={setInnerOpen} open={innerOpen}>
                <Dialog.Trigger asChild>
                  <textbutton
                    AutoButtonColor={false}
                    ZIndex={11}
                    Text="Open Inner Dialog"
                    className="top-14.5 w-45 h-9.5 bg-[#237f50] text-[#e8f6eb] text-base"
                  />
                </Dialog.Trigger>

                <Dialog.Portal>
                  <Dialog.Overlay />
                  <Dialog.Content>
                    <frame
                      AnchorPoint={new Vector2(0.5, 0.5)}
                      Position={UDim2.fromScale(0.5, 0.5)}
                      className="w-85 h-47.5 z-20 bg-[#2d1f44] rounded-lg px-4 pt-3.5"
                    >
                      <textlabel
                        Size={UDim2.fromOffset(280, 28)}
                        Text="Inner Dialog"
                        ZIndex={21}
                        className="text-[#f0e8fb] text-xl text-left"
                      />
                      <textlabel
                        Position={UDim2.fromOffset(0, 32)}
                        Size={UDim2.fromOffset(280, 50)}
                        Text="Outside click should dismiss this dialog before the outer one."
                        TextWrapped={true}
                        ZIndex={21}
                        className="text-[#ccbddf] text-sm text-left align-top"
                      />
                      <Dialog.Close asChild>
                        <textbutton
                          AutoButtonColor={false}
                          ZIndex={21}
                          Text="Close Inner"
                          className="top-28 w-32.5 h-8.5 bg-[#744daa] text-[#f5effb] text-sm"
                        />
                      </Dialog.Close>
                    </frame>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

              <Dialog.Close asChild>
                <textbutton
                  AutoButtonColor={false}
                  ZIndex={11}
                  Text="Close Outer"
                  className="left-48.5 top-14.5 w-37.5 h-9.5 bg-[#5c387d] text-[#f5eff8] text-base"
                />
              </Dialog.Close>
            </frame>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </frame>
  );
}
