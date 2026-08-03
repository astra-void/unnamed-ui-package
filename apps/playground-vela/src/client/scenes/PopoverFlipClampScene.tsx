import { Popover } from "@lattice-ui/react-popover";
import { React } from "@lattice-ui/react-runtime";

type CornerKey = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const cornerOrder: Array<CornerKey> = ["top-left", "top-right", "bottom-right", "bottom-left"];

const cornerPositions: Record<CornerKey, UDim2> = {
  "top-left": UDim2.fromOffset(20, 24),
  "top-right": UDim2.fromOffset(780, 24),
  "bottom-left": UDim2.fromOffset(20, 360),
  "bottom-right": UDim2.fromOffset(780, 360),
};

export function PopoverFlipClampScene() {
  const [open, setOpen] = React.useState(false);
  const [corner, setCorner] = React.useState<CornerKey>("top-left");

  const cycleCorner = React.useCallback(() => {
    const currentIndex = cornerOrder.indexOf(corner);
    const nextIndex = (currentIndex + 1) % cornerOrder.size();
    setCorner(cornerOrder[nextIndex]);
  }, [corner]);

  return (
    <frame className="w-230 h-130 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(850, 28)}
        Text="Cycle anchor around corners and check popper flip/clamp near edges."
        className="text-[#dfe5ed] text-xl text-left"
      />

      <Popover.Root onOpenChange={setOpen} open={open}>
        <Popover.Trigger asChild>
          <textbutton
            AutoButtonColor={false}
            Text={open ? "Close" : "Open"}
            className="top-12 w-37.5 h-9.5 bg-[#2f70ce] text-[#edf5fc] text-sm"
          />
        </Popover.Trigger>

        <textbutton
          AutoButtonColor={false}
          Event={{
            Activated: cycleCorner,
          }}
          Text={`Anchor: ${corner}`}
          className="left-40.5 top-12 w-47.5 h-9.5 bg-[#565f76] text-[#ecf1f8] text-sm"
        />

        <Popover.Anchor asChild>
          {/* Position is table-driven, so it stays an instance prop. */}
          <frame Position={cornerPositions[corner]} className="w-30 h-7.5 bg-[#965732] rounded-md">
            <textlabel Size={UDim2.fromScale(1, 1)} Text="Anchor" className="text-[#f6e9df] text-sm" />
          </frame>
        </Popover.Anchor>

        <Popover.Portal>
          <Popover.Content asChild sideOffset={8} collisionPadding={10} placement="bottom">
            <frame className="w-57.5 h-30 bg-[#202938] rounded-lg px-3 pt-2.5">
              <textlabel
                Size={UDim2.fromOffset(190, 26)}
                Text="Flip / Clamp"
                className="text-[#eef2f8] text-xl text-left"
              />
              <textlabel
                Position={UDim2.fromOffset(0, 30)}
                Size={UDim2.fromOffset(190, 56)}
                Text={`Current anchor: ${corner}`}
                TextWrapped={true}
                className="text-[#b6c1d0] text-sm text-left align-top"
              />
            </frame>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </frame>
  );
}
