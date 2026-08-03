import { Avatar } from "@lattice-ui/react-avatar";
import { React } from "@lattice-ui/react-runtime";

const VALID_IMAGE = "rbxasset://textures/ui/GuiImagePlaceholder.png";
const BROKEN_IMAGE = "rbxassetid://0";

type StatusTone = "online" | "busy" | "offline";

/** `bg-*` only; this lands in an array `className`, so it takes the runtime path. */
function statusFillClass(status: StatusTone) {
  if (status === "online") {
    return "bg-accent";
  }
  if (status === "busy") {
    return "bg-danger";
  }
  return "bg-ink-400";
}

function SectionHeader(props: { text: string; order: number }) {
  return (
    <textlabel
      LayoutOrder={props.order}
      Size={UDim2.fromOffset(860, 18)}
      Text={props.text}
      className="text-ink-400 text-sm text-left"
    />
  );
}

function AvatarBadge(props: {
  size: number;
  initials: string;
  src?: string;
  status?: StatusTone;
  ringed?: boolean;
  position?: UDim2;
  layoutOrder?: number;
  delayMs?: number;
}) {
  const dot = math.max(8, math.floor(props.size * 0.28));
  // The sibling scene scales the fallback text with the avatar
  // (`math.floor(size * 0.38)`); `text-*` is a fixed scale step, so the
  // computed size stays a prop.
  const fallbackTextSize = math.max(14, math.floor(props.size * 0.38));

  return (
    <Avatar.Root delayMs={props.delayMs ?? 250} src={props.src}>
      <frame
        LayoutOrder={props.layoutOrder}
        Position={props.position}
        Size={UDim2.fromOffset(props.size, props.size)}
        className={
          props.ringed === true ? "bg-surface-100 rounded-full border-2 border-surface" : "bg-surface-100 rounded-full"
        }
      >
        <Avatar.Image asChild>
          <imagelabel Size={UDim2.fromScale(1, 1)} className="bg-transparent rounded-full" />
        </Avatar.Image>
        <Avatar.Fallback asChild>
          <textlabel
            Size={UDim2.fromScale(1, 1)}
            Text={props.initials}
            TextSize={fallbackTextSize}
            className="bg-transparent text-ink"
          />
        </Avatar.Fallback>
        {props.status !== undefined ? (
          <frame
            AnchorPoint={new Vector2(1, 1)}
            Position={new UDim2(1, -1, 1, -1)}
            Size={UDim2.fromOffset(dot, dot)}
            className={[statusFillClass(props.status), "rounded-full border-2 border-surface"]}
          />
        ) : undefined}
      </frame>
    </Avatar.Root>
  );
}

const SIZES = [32, 44, 56, 72];
const STACK = [
  { initials: "AB", src: VALID_IMAGE },
  { initials: "CD", src: VALID_IMAGE },
  { initials: "EF", src: BROKEN_IMAGE },
  { initials: "GH", src: BROKEN_IMAGE },
];

export function AvatarBasicScene() {
  const [useBrokenImage, setUseBrokenImage] = React.useState(false);

  const toggleSrc = useBrokenImage ? BROKEN_IMAGE : VALID_IMAGE;
  const stackSize = 44;
  const overlap = 16;

  return (
    <frame className="w-235 h-160 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(920, 28)}
        Text="Avatar: sizes, image + fallback initials + status dot, overlapping group, delayed fallback"
        className="text-ink text-xl text-left truncate"
      />

      <frame className="top-11 w-235 h-145 bg-transparent flex-col gap-4">
        {/* Sizes */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={1}
          className="w-225 bg-surface rounded-lg p-3 flex-col gap-2.5"
        >
          <SectionHeader text="SIZES" order={1} />
          <frame LayoutOrder={2} className="w-215 h-20 bg-transparent flex-row items-center gap-4">
            {SIZES.map((size, index) => (
              <AvatarBadge key={`size-${size}`} size={size} initials="UI" src={VALID_IMAGE} layoutOrder={index} />
            ))}
          </frame>
        </frame>

        {/* Status */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={2}
          className="w-225 bg-surface rounded-lg p-3 flex-col gap-2.5"
        >
          <SectionHeader text="IMAGE, FALLBACK INITIALS & STATUS DOT" order={1} />
          <frame LayoutOrder={2} className="w-215 h-16 bg-transparent flex-row items-center gap-4">
            {/* Loaded image + online */}
            <AvatarBadge size={56} initials="JD" src={VALID_IMAGE} status="online" layoutOrder={1} />
            {/* Broken image -> fallback initials + busy */}
            <AvatarBadge size={56} initials="MK" src={BROKEN_IMAGE} status="busy" layoutOrder={2} />
            {/* No src -> fallback initials + offline */}
            <AvatarBadge size={56} initials="RS" status="offline" layoutOrder={3} />
          </frame>
        </frame>

        {/* Overlapping group */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={3}
          className="w-225 bg-surface rounded-lg p-3 flex-col gap-2.5"
        >
          <SectionHeader text="STACKED / OVERLAPPING GROUP" order={1} />
          <frame LayoutOrder={2} className="w-215 h-13 bg-transparent">
            {STACK.map((member, index) => (
              <AvatarBadge
                key={`stack-${index}`}
                size={stackSize}
                initials={member.initials}
                src={member.src}
                ringed
                position={UDim2.fromOffset(index * (stackSize - overlap), 0)}
              />
            ))}
            <frame
              Position={UDim2.fromOffset(STACK.size() * (stackSize - overlap), 0)}
              className="w-11 h-11 bg-surface-100 rounded-full border-2 border-surface"
            >
              <textlabel Size={UDim2.fromScale(1, 1)} Text="+3" className="bg-transparent text-ink-400 text-sm" />
            </frame>
          </frame>
        </frame>

        {/* Delayed fallback toggle */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={4}
          className="w-225 bg-surface rounded-lg p-3 flex-col gap-2.5"
        >
          <SectionHeader text={`DELAYED FALLBACK — src: ${useBrokenImage ? "broken" : "valid"}`} order={1} />
          <frame LayoutOrder={2} className="w-215 h-14 bg-transparent">
            <AvatarBadge size={56} initials="UI" src={toggleSrc} />
          </frame>
          <textbutton
            AutoButtonColor={false}
            Event={{
              Activated: () => {
                setUseBrokenImage((value) => !value);
              },
            }}
            LayoutOrder={3}
            Text={useBrokenImage ? "Use valid image" : "Use broken image"}
            className="w-55 h-8.5 bg-surface text-ink text-base"
          />
        </frame>
      </frame>
    </frame>
  );
}
