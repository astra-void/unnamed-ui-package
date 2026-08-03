import { React } from "@lattice-ui/react-runtime";
import { useDensity } from "@lattice-ui/react-system";

function SectionHeader(props: { title: string; hint: string; layoutOrder: number }) {
  return (
    <frame
      AutomaticSize={Enum.AutomaticSize.Y}
      LayoutOrder={props.layoutOrder}
      className="w-225 bg-transparent flex-col gap-0.5"
    >
      <textlabel
        LayoutOrder={1}
        Size={UDim2.fromOffset(900, 18)}
        Text={props.title}
        className="text-ink-400 text-sm text-left"
      />
      <textlabel
        LayoutOrder={2}
        Size={UDim2.fromOffset(900, 18)}
        Text={props.hint}
        TextTransparency={0.25}
        className="text-ink-400 text-sm text-left"
      />
    </frame>
  );
}

type ToneKey = "surface" | "elevated" | "sunken" | "overlay";

type ToneMeta = {
  tone: ToneKey;
  title: string;
  detail: string;
  token: string;
};

const TONES: ReadonlyArray<ToneMeta> = [
  {
    tone: "surface",
    title: "Surface",
    detail: "Default system surface. rounded-lg + border.",
    token: "bg-surface",
  },
  {
    tone: "elevated",
    title: "Elevated",
    detail: "Raised panels/menus. rounded-lg + border.",
    token: "bg-surface-100",
  },
  {
    tone: "sunken",
    title: "Sunken",
    detail: "Recessed wells/insets. rounded-lg + border.",
    token: "bg-canvas",
  },
  {
    tone: "overlay",
    title: "Overlay",
    detail: "Scrims/dialog backdrops. No corner or border.",
    token: "bg-overlay/35",
  },
];

/**
 * `Surface tone="…"` becomes a literal `bg-*` per tone. The primitive resolves
 * the fill and decides corner/stroke from the token at render time, so a new
 * tone reaches every call site at once; here each site spells its own chrome
 * out and adding a tone means editing all four branches.
 */
function ToneCard(props: ToneMeta & { layoutOrder: number }) {
  if (props.tone === "overlay") {
    return (
      <frame
        LayoutOrder={props.layoutOrder}
        Size={UDim2.fromOffset(430, 150)}
        className="bg-overlay/35 px-3 py-2.5 flex-col gap-1.5"
      >
        <ToneCardBody {...props} onOverlay />
      </frame>
    );
  }

  if (props.tone === "elevated") {
    return (
      <frame
        LayoutOrder={props.layoutOrder}
        Size={UDim2.fromOffset(430, 150)}
        className="bg-surface-100 rounded-lg border border-edge px-3 py-2.5 flex-col gap-1.5"
      >
        <ToneCardBody {...props} />
      </frame>
    );
  }

  if (props.tone === "sunken") {
    return (
      <frame
        LayoutOrder={props.layoutOrder}
        Size={UDim2.fromOffset(430, 150)}
        className="bg-canvas rounded-lg border border-edge px-3 py-2.5 flex-col gap-1.5"
      >
        <ToneCardBody {...props} />
      </frame>
    );
  }

  return (
    <frame
      LayoutOrder={props.layoutOrder}
      Size={UDim2.fromOffset(430, 150)}
      className="bg-surface rounded-lg border border-edge px-3 py-2.5 flex-col gap-1.5"
    >
      <ToneCardBody {...props} />
    </frame>
  );
}

function ToneCardBody(props: ToneMeta & { onOverlay?: boolean }) {
  const titleClass = props.onOverlay === true ? "text-accent-50" : "text-ink";
  const detailClass = props.onOverlay === true ? "text-accent-50" : "text-ink-400";

  return (
    <React.Fragment>
      <textlabel
        LayoutOrder={1}
        Size={UDim2.fromOffset(400, 22)}
        Text={`${props.title}  ·  tone="${props.tone}"`}
        className={[titleClass, "text-base text-left"]}
      />
      <textlabel
        LayoutOrder={2}
        Size={UDim2.fromOffset(400, 34)}
        Text={props.detail}
        TextWrapped={true}
        className={[detailClass, "text-sm text-left align-top"]}
      />
      <textlabel
        LayoutOrder={3}
        Size={UDim2.fromOffset(400, 18)}
        Text={`fill: ${props.token}`}
        className={[detailClass, "text-sm text-left"]}
      />
      <textlabel
        LayoutOrder={4}
        Size={UDim2.fromOffset(400, 18)}
        Text={props.onOverlay === true ? "corner: none | stroke: none" : "corner: rounded-lg | stroke: border-edge 1px"}
        className={[detailClass, "text-sm text-left"]}
      />
    </React.Fragment>
  );
}

export function SurfaceShowcaseScene() {
  const { density } = useDensity();

  return (
    <frame AutomaticSize={Enum.AutomaticSize.Y} className="w-230 bg-transparent flex-col gap-3">
      <frame AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={1} className="w-225 bg-transparent flex-col gap-1">
        <textlabel
          LayoutOrder={1}
          Size={UDim2.fromOffset(900, 28)}
          Text="Surface tones, restated as bg-* + rounded-* + border utilities (overlay drops both)."
          className="text-ink text-xl text-left truncate"
        />
        {/*
          `density` still reaches Lattice components through SystemProvider, but
          it can no longer reach these utilities: `p-3` is 12px in the compiled
          output regardless of the density toggle in the header.
        */}
        <textlabel
          LayoutOrder={2}
          Size={UDim2.fromOffset(900, 20)}
          Text={`density: ${density} (components only — utilities are compile-time constants)`}
          className="text-ink-400 text-base text-left"
        />
      </frame>

      <SectionHeader
        hint="All four surface tones side by side. Each is a frame with its own fill utility."
        layoutOrder={2}
        title="TONES"
      />
      <frame
        AutomaticSize={Enum.AutomaticSize.Y}
        LayoutOrder={3}
        className="w-225 bg-transparent grid grid-cols-2 auto-rows-37.5 gap-2.5"
      >
        {TONES.map((meta, index) => (
          <ToneCard
            key={`tone-${meta.tone}`}
            detail={meta.detail}
            layoutOrder={index + 1}
            title={meta.title}
            token={meta.token}
            tone={meta.tone}
          />
        ))}
      </frame>

      <SectionHeader
        hint="Sunken well > surface panel > elevated card. Elevation reads as brighter fills stepping forward."
        layoutOrder={4}
        title="NESTED ELEVATION"
      />
      <frame LayoutOrder={5} className="w-225 h-55 bg-canvas rounded-lg border border-edge p-4">
        <textlabel
          Position={UDim2.fromOffset(0, -2)}
          Size={UDim2.fromOffset(400, 18)}
          Text="sunken"
          className="text-ink-400 text-sm text-left"
        />
        <frame
          Position={UDim2.fromOffset(0, 22)}
          Size={UDim2.fromOffset(868, 160)}
          className="bg-surface rounded-lg border border-edge p-3.5"
        >
          <textlabel
            Position={UDim2.fromOffset(0, -2)}
            Size={UDim2.fromOffset(400, 18)}
            Text="surface"
            className="text-ink-400 text-sm text-left"
          />
          <frame
            Position={UDim2.fromOffset(0, 22)}
            Size={UDim2.fromOffset(836, 96)}
            className="bg-surface-100 rounded-lg border border-edge p-3"
          >
            <textlabel
              Size={UDim2.fromOffset(800, 20)}
              Text="elevated — top of the stack"
              className="text-ink text-base text-left"
            />
            <textlabel
              Position={UDim2.fromOffset(0, 26)}
              Size={UDim2.fromOffset(800, 20)}
              Text="Each level keeps its own stroke; nesting does not compound corners."
              className="text-ink-400 text-sm text-left"
            />
          </frame>
        </frame>
      </frame>

      <SectionHeader
        hint="Border comparison: decorated tones own a stroke from the edge token; overlay is strokeless."
        layoutOrder={6}
        title="BORDER / STROKE"
      />
      <frame AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={7} className="w-225 bg-transparent flex-row gap-2.5">
        <frame
          LayoutOrder={1}
          Size={UDim2.fromOffset(295, 96)}
          className="bg-surface rounded-lg border border-edge p-2.5"
        >
          <textlabel Size={UDim2.fromOffset(270, 20)} Text="Decorated" className="text-ink text-base text-left" />
          <textlabel
            Position={UDim2.fromOffset(0, 26)}
            Size={UDim2.fromOffset(270, 36)}
            Text="border border-edge, 1px, rounded-lg corner."
            TextWrapped={true}
            className="text-ink-400 text-sm text-left align-top"
          />
        </frame>
        <frame LayoutOrder={2} Size={UDim2.fromOffset(295, 96)} className="bg-overlay/35 p-2.5">
          <textlabel
            Size={UDim2.fromOffset(270, 20)}
            Text="Overlay (strokeless)"
            className="text-accent-50 text-base text-left"
          />
          <textlabel
            Position={UDim2.fromOffset(0, 26)}
            Size={UDim2.fromOffset(270, 36)}
            Text="No corner, no stroke — a flat translucent scrim."
            TextWrapped={true}
            className="text-accent-50 text-sm text-left align-top"
          />
        </frame>
        <frame
          LayoutOrder={3}
          Size={UDim2.fromOffset(290, 96)}
          className="bg-surface rounded-md border-2 border-accent p-2.5"
        >
          <textlabel
            Size={UDim2.fromOffset(265, 20)}
            Text="Custom accent stroke"
            className="text-ink text-base text-left"
          />
          <textlabel
            Position={UDim2.fromOffset(0, 26)}
            Size={UDim2.fromOffset(265, 36)}
            Text="border-2 border-accent, rounded-md."
            TextWrapped={true}
            className="text-ink-400 text-sm text-left align-top"
          />
        </frame>
      </frame>
    </frame>
  );
}
