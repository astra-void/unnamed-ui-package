import { Popover } from "@lattice-ui/react-popover";
import { React } from "@lattice-ui/react-runtime";

export function PopoverBasicScene() {
  const [open, setOpen] = React.useState(false);

  return (
    <frame className="w-230 h-130 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(760, 28)}
        Text="Trigger click opens popover. Outside click dismisses it."
        className="text-ink text-xl text-left"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(300, 24)}
        Text={`Open: ${open ? "true" : "false"}`}
        className="text-ink-400 text-base text-left"
      />

      <Popover.Root onOpenChange={setOpen} open={open}>
        <Popover.Trigger asChild>
          <textbutton
            AutoButtonColor={false}
            Position={UDim2.fromOffset(0, 72)}
            Size={UDim2.fromOffset(180, 42)}
            Text={open ? "Opened" : "Toggle Popover"}
            className="bg-accent text-accent-50 text-base"
          />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content asChild sideOffset={10} placement="bottom">
            <frame Size={UDim2.fromOffset(300, 180)} className="bg-surface rounded-lg px-3.5 pt-3">
              <textlabel Size={UDim2.fromOffset(260, 28)} Text="Popover Basic" className="text-ink text-xl text-left" />
              <textlabel
                Position={UDim2.fromOffset(0, 34)}
                Size={UDim2.fromOffset(270, 56)}
                Text="Outside click closes this panel."
                TextWrapped={true}
                className="text-ink-400 text-base text-left align-top"
              />
              <Popover.Close asChild>
                <textbutton
                  AutoButtonColor={false}
                  Position={UDim2.fromOffset(0, 112)}
                  Size={UDim2.fromOffset(130, 36)}
                  Text="Close"
                  className="bg-surface text-ink text-base"
                />
              </Popover.Close>
            </frame>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </frame>
  );
}
