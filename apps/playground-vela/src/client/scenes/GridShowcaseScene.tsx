import { React } from "@lattice-ui/react-runtime";
import { Grid, Surface } from "@lattice-ui/react-system";

type TileProps = {
  label: string;
  order: number;
};

function Tile(props: TileProps) {
  return (
    <frame LayoutOrder={props.order} Size={UDim2.fromOffset(10, 28)} className="bg-accent rounded-sm">
      <textlabel
        AnchorPoint={new Vector2(0.5, 0.5)}
        Position={UDim2.fromScale(0.5, 0.5)}
        Size={UDim2.fromOffset(100, 20)}
        Text={props.label}
        className="text-accent-50 text-sm"
      />
    </frame>
  );
}

type CardProps = {
  title: string;
  body: string;
  order: number;
};

function Card(props: CardProps) {
  return (
    <frame
      LayoutOrder={props.order}
      Size={UDim2.fromOffset(10, 10)}
      className="bg-surface-100 rounded-md border border-edge px-3 py-2.5 flex-col gap-1"
    >
      <textlabel
        LayoutOrder={1}
        Size={UDim2.fromOffset(200, 20)}
        Text={props.title}
        className="text-ink text-base text-left"
      />
      <textlabel
        LayoutOrder={2}
        Size={UDim2.fromOffset(200, 40)}
        Text={props.body}
        TextWrapped={true}
        className="text-ink-400 text-sm text-left align-top"
      />
    </frame>
  );
}

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

const TILE_INDICES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const CARDS: ReadonlyArray<{ title: string; body: string }> = [
  { title: "Overview", body: "Traffic up 12% week over week across all channels." },
  { title: "Revenue", body: "MRR reached the quarterly target three days early." },
  { title: "Latency", body: "p95 held under 180ms during the peak window." },
  { title: "Signups", body: "Trial conversions steady at 4.1% after the redesign." },
  { title: "Errors", body: "Error rate down to 0.3% after the retry rollout." },
  { title: "Storage", body: "Cold tier migration freed 2.4TB this cycle." },
];

/**
 * Fixed-track sections use `grid grid-cols-N gap-*`, which lowers to a
 * `UIGridLayout`. The auto-fill sections keep Lattice's `Grid`: vela has no
 * responsive counterpart to `minColumnWidth`, because deciding a column count
 * from the measured container width is a runtime job and `grid-cols-*` is a
 * compile-time constant. `UIGridLayout` also needs an explicit `CellSize`,
 * which no utility sets — so the fixed-track tiles carry their own `Size`.
 */
export function GridShowcaseScene() {
  return (
    <frame AutomaticSize={Enum.AutomaticSize.Y} className="w-230 bg-transparent flex-col gap-3">
      <frame AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={1} className="w-225 bg-transparent flex-col gap-1">
        <textlabel
          LayoutOrder={1}
          Size={UDim2.fromOffset(900, 28)}
          Text="Grid: columns (fixed) or minColumnWidth (responsive) driven two-dimensional layout."
          className="text-ink text-xl text-left truncate"
        />
        <textlabel
          LayoutOrder={2}
          Size={UDim2.fromOffset(900, 20)}
          Text="Fixed tracks are grid-cols-*; responsive auto-fill still needs the Grid primitive."
          className="text-ink-400 text-base text-left"
        />
      </frame>

      <SectionHeader
        hint="grid-cols-4 — exactly four equal tracks regardless of width."
        layoutOrder={2}
        title="FIXED COLUMNS"
      />
      <frame LayoutOrder={3} className="w-225 h-32 bg-surface rounded-lg p-3 grid grid-cols-4 gap-2">
        {TILE_INDICES.map((index) => (
          <Tile key={`fixed-${index}`} label={`Tile ${index}`} order={index} />
        ))}
      </frame>

      <SectionHeader
        hint="minColumnWidth={120} — column count auto-fits to the available width (no utility equivalent)."
        layoutOrder={4}
        title="RESPONSIVE (AUTO-FILL)"
      />
      <Surface LayoutOrder={5} Size={UDim2.fromOffset(900, 128)} tone="surface">
        <Grid cellHeight={34} gap={8} minColumnWidth={120} padding={12} sx={{ Size: UDim2.fromScale(1, 1) }}>
          {TILE_INDICES.map((index) => (
            <Tile key={`responsive-${index}`} label={`Tile ${index}`} order={index} />
          ))}
        </Grid>
      </Surface>

      <SectionHeader
        hint="gap-* feeds UIGridLayout.CellPadding on both axes; there is no per-axis grid gap utility."
        layoutOrder={6}
        title="GAP VARIATIONS"
      />
      <frame AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={7} className="w-225 bg-transparent flex-row gap-2.5">
        <frame
          LayoutOrder={1}
          Size={UDim2.fromOffset(445, 120)}
          className="bg-surface-100 rounded-lg p-3 grid grid-cols-6 gap-1"
        >
          {TILE_INDICES.map((index) => (
            <Tile key={`tight-${index}`} label={`${index}`} order={index} />
          ))}
        </frame>
        <frame
          LayoutOrder={2}
          Size={UDim2.fromOffset(445, 120)}
          className="bg-surface-100 rounded-lg p-3 grid grid-cols-6 gap-4"
        >
          {TILE_INDICES.map((index) => (
            <Tile key={`loose-${index}`} label={`${index}`} order={index} />
          ))}
        </frame>
      </frame>

      <SectionHeader
        hint="Realistic dashboard grid: responsive cards with title + body, minColumnWidth={260}."
        layoutOrder={8}
        title="CARD GRID"
      />
      <Surface LayoutOrder={9} Size={UDim2.fromOffset(900, 236)} tone="sunken">
        <Grid cellHeight={92} gap={12} minColumnWidth={260} padding={12} sx={{ Size: UDim2.fromScale(1, 1) }}>
          {CARDS.map((card, index) => (
            <Card key={`card-${index}`} body={card.body} order={index + 1} title={card.title} />
          ))}
        </Grid>
      </Surface>
    </frame>
  );
}
