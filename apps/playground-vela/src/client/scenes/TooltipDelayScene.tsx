import type { PopperPlacement } from "@lattice-ui/react-popper";
import { React } from "@lattice-ui/react-runtime";
import { Tooltip } from "@lattice-ui/react-tooltip";

type SimpleTooltipProps = {
  position: UDim2;
  triggerText: string;
  tipText: string;
  placement: PopperPlacement;
  sideOffset?: number;
  delayDuration?: number;
  onOpenChange?: (open: boolean) => void;
};

function SimpleTooltip(props: SimpleTooltipProps) {
  return (
    <Tooltip.Root delayDuration={props.delayDuration} onOpenChange={props.onOpenChange}>
      <Tooltip.Trigger asChild>
        <textbutton
          AutoButtonColor={false}
          Position={props.position}
          Text={props.triggerText}
          className="w-45 h-10 bg-accent text-accent-50 text-base"
        />
      </Tooltip.Trigger>

      <Tooltip.Portal>
        <Tooltip.Content asChild placement={props.placement} sideOffset={props.sideOffset ?? 8}>
          <frame className="w-52.5 h-11.5 bg-surface-100 rounded-md border border-edge px-2.5 py-2">
            <textlabel
              Size={UDim2.fromScale(1, 1)}
              Text={props.tipText}
              TextWrapped={true}
              className="text-ink text-base text-left align-top"
            />
          </frame>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export function TooltipDelayScene() {
  const [open, setOpen] = React.useState(false);

  return (
    <Tooltip.Provider delayDuration={700} skipDelayDuration={300}>
      <frame className="w-230 h-130 bg-transparent">
        <textlabel
          Size={UDim2.fromOffset(860, 28)}
          Text="Hover/focus trigger: first open 700ms, re-entry within window 300ms."
          className="text-ink text-xl text-left"
        />
        <textlabel
          Position={UDim2.fromOffset(0, 34)}
          Size={UDim2.fromOffset(320, 22)}
          Text={`Open (default): ${open ? "true" : "false"}`}
          className="text-ink-400 text-base text-left"
        />

        {/* Delay configs */}
        <textlabel
          Position={UDim2.fromOffset(0, 70)}
          Size={UDim2.fromOffset(400, 20)}
          Text="Delay configs (open delay)"
          className="text-ink-400 text-sm text-left"
        />
        <SimpleTooltip
          delayDuration={0}
          placement="bottom"
          position={UDim2.fromOffset(0, 96)}
          tipText="Opens instantly (0ms)."
          triggerText="Instant (0ms)"
        />
        <SimpleTooltip
          onOpenChange={setOpen}
          placement="bottom"
          position={UDim2.fromOffset(196, 96)}
          tipText="Uses provider delay (700ms)."
          triggerText="Default (700ms)"
        />
        <SimpleTooltip
          delayDuration={1200}
          placement="bottom"
          position={UDim2.fromOffset(392, 96)}
          tipText="Waits 1200ms before opening."
          triggerText="Slow (1200ms)"
        />

        {/* Placements */}
        <textlabel
          Position={UDim2.fromOffset(0, 168)}
          Size={UDim2.fromOffset(400, 20)}
          Text="Placements"
          className="text-ink-400 text-sm text-left"
        />
        <SimpleTooltip
          placement="top"
          position={UDim2.fromOffset(0, 260)}
          tipText="Placed above the trigger."
          triggerText="Top"
        />
        <SimpleTooltip
          placement="bottom"
          position={UDim2.fromOffset(196, 260)}
          tipText="Placed below the trigger."
          triggerText="Bottom"
        />
        <SimpleTooltip
          placement="left"
          position={UDim2.fromOffset(392, 260)}
          tipText="Placed left of the trigger."
          triggerText="Left"
        />
        <SimpleTooltip
          placement="right"
          position={UDim2.fromOffset(588, 260)}
          tipText="Placed right of the trigger."
          triggerText="Right"
        />

        {/* Rich content */}
        <textlabel
          Position={UDim2.fromOffset(0, 332)}
          Size={UDim2.fromOffset(400, 20)}
          Text="Rich content (title + description)"
          className="text-ink-400 text-sm text-left"
        />
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <textbutton
              AutoButtonColor={false}
              Position={UDim2.fromOffset(0, 358)}
              Text="Keyboard shortcut"
              className="w-55 h-10.5 bg-surface text-ink text-base"
            />
          </Tooltip.Trigger>

          <Tooltip.Portal>
            <Tooltip.Content asChild placement="bottom" sideOffset={8}>
              <frame className="w-65 h-23 bg-surface-100 rounded-md border border-edge px-3 py-2.5">
                <textlabel
                  Size={UDim2.fromOffset(236, 20)}
                  Text="Save changes"
                  className="text-ink text-sm text-left"
                />
                <textlabel
                  Position={UDim2.fromOffset(0, 24)}
                  Size={UDim2.fromOffset(236, 44)}
                  Text="Press Ctrl+S to persist the current draft to the server."
                  TextWrapped={true}
                  className="text-ink-400 text-base text-left align-top"
                />
              </frame>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </frame>
    </Tooltip.Provider>
  );
}
