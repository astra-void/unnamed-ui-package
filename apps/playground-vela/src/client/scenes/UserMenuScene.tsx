import { Avatar } from "@lattice-ui/react-avatar";
import { Popover } from "@lattice-ui/react-popover";
import { React } from "@lattice-ui/react-runtime";
import { Switch } from "@lattice-ui/react-switch";

type MenuActionProps = {
  label: string;
  hint: string;
  layoutOrder: number;
  onSelect: () => void;
};

function MenuAction(props: MenuActionProps) {
  return (
    <Popover.Close asChild>
      <textbutton
        AutoButtonColor={false}
        Event={{ Activated: props.onSelect }}
        LayoutOrder={props.layoutOrder}
        Size={UDim2.fromOffset(256, 40)}
        Text=""
        className="bg-surface-100 rounded-sm px-2.5"
      >
        <textlabel
          Position={UDim2.fromOffset(0, 4)}
          Size={UDim2.fromOffset(236, 18)}
          Text={props.label}
          className="text-ink text-base text-left"
        />
        <textlabel
          Position={UDim2.fromOffset(0, 22)}
          Size={UDim2.fromOffset(236, 14)}
          Text={props.hint}
          className="text-ink-400 text-sm text-left"
        />
      </textbutton>
    </Popover.Close>
  );
}

function DangerMenuAction(props: MenuActionProps) {
  return (
    <Popover.Close asChild>
      <textbutton
        AutoButtonColor={false}
        Event={{ Activated: props.onSelect }}
        LayoutOrder={props.layoutOrder}
        Size={UDim2.fromOffset(256, 40)}
        Text=""
        className="bg-danger rounded-sm px-2.5"
      >
        <textlabel
          Position={UDim2.fromOffset(0, 4)}
          Size={UDim2.fromOffset(236, 18)}
          Text={props.label}
          className="text-danger-50 text-base text-left"
        />
        <textlabel
          Position={UDim2.fromOffset(0, 22)}
          Size={UDim2.fromOffset(236, 14)}
          Text={props.hint}
          TextTransparency={0.2}
          className="text-danger-50 text-sm text-left"
        />
      </textbutton>
    </Popover.Close>
  );
}

export function UserMenuScene() {
  const [open, setOpen] = React.useState(false);
  const [online, setOnline] = React.useState(true);
  const [lastAction, setLastAction] = React.useState("none");

  return (
    <frame className="w-235 h-140 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(920, 28)}
        Text="Account menu: Avatar trigger opens a Popover composed with a status Switch and menu actions"
        className="text-ink text-xl text-left truncate"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(920, 24)}
        Text={`open=${open ? "true" : "false"} | status=${online ? "online" : "away"} | last action=${lastAction}`}
        className="text-ink-400 text-base text-left"
      />

      <frame className="top-18 w-225 h-90 bg-surface rounded-lg border border-edge pl-4 pt-4">
        <Popover.Root onOpenChange={setOpen} open={open}>
          <Popover.Trigger asChild>
            {/* Trigger fill tracks `open`, so the element is written per state. */}
            {open ? (
              <textbutton
                AutoButtonColor={false}
                Size={UDim2.fromOffset(220, 52)}
                Text=""
                className="bg-surface-100 rounded-md border border-edge pl-2"
              >
                <AvatarBadge />
                <TriggerLabels online={online} />
              </textbutton>
            ) : (
              <textbutton
                AutoButtonColor={false}
                Size={UDim2.fromOffset(220, 52)}
                Text=""
                className="bg-surface rounded-md border border-edge pl-2"
              >
                <AvatarBadge />
                <TriggerLabels online={online} />
              </textbutton>
            )}
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content asChild placement="bottom" sideOffset={8}>
              <frame className="w-71 h-67 bg-surface-100 rounded-lg border border-edge px-3 pt-3 pb-2.5 flex-col gap-2">
                <textlabel
                  LayoutOrder={0}
                  Size={UDim2.fromOffset(260, 18)}
                  Text="astra@lattice.dev"
                  className="text-ink-400 text-sm text-left"
                />

                <frame LayoutOrder={1} Size={UDim2.fromOffset(260, 32)} className="bg-transparent">
                  <textlabel
                    Position={UDim2.fromOffset(0, 6)}
                    Size={UDim2.fromOffset(200, 20)}
                    Text="Show as online"
                    className="text-ink text-base text-left"
                  />
                  <Switch.Root asChild checked={online} onCheckedChange={setOnline}>
                    {online ? (
                      <textbutton
                        AutoButtonColor={false}
                        Position={UDim2.fromOffset(214, 4)}
                        Text=""
                        className="w-11.5 h-6 bg-accent rounded-full"
                      >
                        <Switch.Thumb asChild>
                          <frame className="w-5 h-5 bg-accent-50 rounded-full" />
                        </Switch.Thumb>
                      </textbutton>
                    ) : (
                      <textbutton
                        AutoButtonColor={false}
                        Position={UDim2.fromOffset(214, 4)}
                        Text=""
                        className="w-11.5 h-6 bg-surface-100 rounded-full"
                      >
                        <Switch.Thumb asChild>
                          <frame className="w-5 h-5 bg-accent-50 rounded-full" />
                        </Switch.Thumb>
                      </textbutton>
                    )}
                  </Switch.Root>
                </frame>

                <frame LayoutOrder={2} Size={UDim2.fromOffset(260, 1)} className="bg-edge" />

                <MenuAction
                  label="Profile"
                  hint="View and edit your details"
                  layoutOrder={3}
                  onSelect={() => {
                    setLastAction("profile");
                  }}
                />
                <MenuAction
                  label="Preferences"
                  hint="Theme, density and shortcuts"
                  layoutOrder={4}
                  onSelect={() => {
                    setLastAction("preferences");
                  }}
                />
                <DangerMenuAction
                  label="Sign out"
                  hint="End this session"
                  layoutOrder={5}
                  onSelect={() => {
                    setLastAction("sign-out");
                  }}
                />
              </frame>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </frame>
    </frame>
  );
}

function AvatarBadge() {
  return (
    <Avatar.Root delayMs={200} src="rbxasset://textures/ui/GuiImagePlaceholder.png">
      <frame
        AnchorPoint={new Vector2(0, 0.5)}
        Position={new UDim2(0, 8, 0.5, 0)}
        className="w-9 h-9 bg-accent rounded-full"
      >
        <Avatar.Image asChild>
          <imagelabel Size={UDim2.fromScale(1, 1)} className="bg-transparent rounded-full" />
        </Avatar.Image>
        <Avatar.Fallback asChild>
          <textlabel Size={UDim2.fromScale(1, 1)} Text="AV" className="bg-transparent text-accent-50 text-sm" />
        </Avatar.Fallback>
      </frame>
    </Avatar.Root>
  );
}

function TriggerLabels(props: { online: boolean }) {
  return (
    <>
      <textlabel
        Position={UDim2.fromOffset(56, 8)}
        Size={UDim2.fromOffset(150, 18)}
        Text="Astra Void"
        className="text-ink text-base text-left"
      />
      {props.online ? (
        <textlabel
          Position={UDim2.fromOffset(56, 28)}
          Size={UDim2.fromOffset(150, 16)}
          Text="● Online"
          className="text-accent text-sm text-left"
        />
      ) : (
        <textlabel
          Position={UDim2.fromOffset(56, 28)}
          Size={UDim2.fromOffset(150, 16)}
          Text="○ Away"
          className="text-ink-400 text-sm text-left"
        />
      )}
    </>
  );
}
