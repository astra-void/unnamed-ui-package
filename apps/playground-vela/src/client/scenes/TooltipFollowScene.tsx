import type { PopperPlacement } from "@lattice-ui/react-popper";
import { React } from "@lattice-ui/react-runtime";
import { Tooltip } from "@lattice-ui/react-tooltip";

type DemoTooltipProps = {
  position: UDim2;
  triggerText: string;
  tipTitle: string;
  tipText: string;
  placement: PopperPlacement;
  sideOffset: number;
};

function DemoTooltip(props: DemoTooltipProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <textbutton
          AutoButtonColor={false}
          Position={props.position}
          Text={props.triggerText}
          className="w-45 h-10.5 bg-accent text-accent-50 text-base"
        />
      </Tooltip.Trigger>

      <Tooltip.Portal>
        <Tooltip.Content asChild placement={props.placement} sideOffset={props.sideOffset}>
          <frame className="w-57.5 h-21 bg-surface-100 rounded-md border border-edge px-3 py-2.5">
            <textlabel Size={UDim2.fromOffset(206, 20)} Text={props.tipTitle} className="text-ink text-sm text-left" />
            <textlabel
              Position={UDim2.fromOffset(0, 24)}
              Size={UDim2.fromOffset(206, 40)}
              Text={props.tipText}
              TextWrapped={true}
              className="text-ink-400 text-base text-left align-top"
            />
          </frame>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export function TooltipFollowScene() {
  const [anchorX, setAnchorX] = React.useState(120);

  return (
    <frame className="w-230 h-130 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(860, 28)}
        Text="Move the anchor button while its tooltip is open to verify follow updates."
        className="text-ink text-xl text-left"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(320, 22)}
        Text={`Anchor X: ${anchorX}`}
        className="text-ink-400 text-base text-left"
      />

      <textbutton
        AutoButtonColor={false}
        Event={{
          Activated: () => {
            const nextX = anchorX >= 600 ? 120 : anchorX + 120;
            setAnchorX(nextX);
          },
        }}
        Text="Move Anchor"
        className="top-16.5 w-45 h-10 bg-surface text-ink text-base"
      />

      {/* Following: trigger moves, tooltip repositions with it */}
      <textlabel
        Position={UDim2.fromOffset(0, 128)}
        Size={UDim2.fromOffset(400, 20)}
        Text="Following (trigger moves)"
        className="text-ink-400 text-sm text-left"
      />
      <DemoTooltip
        placement="top"
        position={UDim2.fromOffset(anchorX, 154)}
        sideOffset={8}
        tipText="Anchor movement should reposition this tooltip."
        tipTitle="Follows anchor"
        triggerText="Hover / Focus me"
      />

      {/* Anchored comparison: fixed trigger, tooltip stays put */}
      <textlabel
        Position={UDim2.fromOffset(0, 300)}
        Size={UDim2.fromOffset(400, 20)}
        Text="Anchored (trigger fixed)"
        className="text-ink-400 text-sm text-left"
      />
      <DemoTooltip
        placement="bottom"
        position={UDim2.fromOffset(0, 326)}
        sideOffset={8}
        tipText="This trigger never moves, so its tooltip stays put."
        tipTitle="Stays put"
        triggerText="Hover / Focus me"
      />
    </frame>
  );
}
