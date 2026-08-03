import { Popover } from "@lattice-ui/react-popover";
import { React } from "@lattice-ui/react-runtime";

export function PopoverNestedScene() {
  const [outerOpen, setOuterOpen] = React.useState(false);
  const [innerOpen, setInnerOpen] = React.useState(false);

  return (
    <frame className="w-230 h-130 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(780, 28)}
        Text="Nested popover stacking: outside click closes the inner layer before the outer one."
        className="text-[#dfe5ed] text-xl text-left truncate"
      />

      <Popover.Root
        onOpenChange={(nextOpen) => {
          setOuterOpen(nextOpen);
          if (!nextOpen) {
            setInnerOpen(false);
          }
        }}
        open={outerOpen}
      >
        <Popover.Trigger asChild>
          <textbutton
            AutoButtonColor={false}
            Text="Toggle Outer"
            className="top-12.5 w-45 h-10 bg-accent text-accent-50 text-base"
          />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content asChild sideOffset={10} placement="bottom">
            <frame className="w-90 h-55 bg-[#1f2a3a] rounded-lg px-3 pt-2.5">
              <textlabel
                Size={UDim2.fromOffset(320, 24)}
                Text="Outer Popover"
                className="text-[#edf2f9] text-xl text-left"
              />

              <Popover.Root onOpenChange={setInnerOpen} open={innerOpen}>
                <Popover.Trigger asChild>
                  <textbutton
                    AutoButtonColor={false}
                    Text="Toggle Inner"
                    className="top-10.5 w-40 h-8.5 bg-[#248052] text-[#e7f6ec] text-sm"
                  />
                </Popover.Trigger>

                <Popover.Portal>
                  <Popover.Content asChild alignOffset={8} placement="right">
                    <frame className="w-55 h-27.5 bg-[#382450] rounded-lg px-2.5 pt-2">
                      <textlabel
                        Size={UDim2.fromOffset(180, 22)}
                        Text="Inner Popover"
                        className="text-[#f2e9fc] text-lg text-left"
                      />
                      <textlabel
                        Position={UDim2.fromOffset(0, 26)}
                        Size={UDim2.fromOffset(190, 46)}
                        Text="Outside click closes this first."
                        TextWrapped={true}
                        className="text-[#d0c1e1] text-sm text-left align-top"
                      />
                    </frame>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </frame>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </frame>
  );
}
