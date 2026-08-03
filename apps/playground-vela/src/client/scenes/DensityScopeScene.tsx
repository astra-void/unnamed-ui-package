import { React } from "@lattice-ui/react-runtime";
import type { DensityToken } from "@lattice-ui/react-system";
import { DensityProvider, useDensity } from "@lattice-ui/react-system";

const densityOrder = ["compact", "comfortable", "spacious"] as const satisfies ReadonlyArray<DensityToken>;

function nextDensity(current: DensityToken): DensityToken {
  const currentIndex = densityOrder.indexOf(current);
  const normalizedIndex = currentIndex >= 0 ? currentIndex : 0;
  return densityOrder[(normalizedIndex + 1) % densityOrder.size()];
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

/**
 * This is where the two models diverge most sharply.
 *
 * The sibling scene renders ONE `DensityCluster` and lets `useTheme()` resolve
 * the nearest `DensityProvider`, so identical JSX comes out tight or loose
 * depending on the scope it lands in — and the root toggle restyles it live.
 *
 * A `p-*`/`gap-*` utility is a constant baked in at compile time. It cannot
 * read a provider, so density has to be enumerated: one literal class set per
 * step, chosen by a branch. The three scales below are hand-written rather than
 * derived, and nothing here reacts to the density toggle in the header.
 */
function DensityCluster(props: { scale: DensityToken; width: number }) {
  if (props.scale === "compact") {
    return (
      <frame
        AutomaticSize={Enum.AutomaticSize.Y}
        Size={UDim2.fromOffset(props.width, 0)}
        className="bg-surface-100 rounded-md border border-edge p-2 flex-col gap-1.5"
      >
        <ClusterBody scale="compact" width={props.width} pad={8} gap={6} barW={16} barH={10} />
      </frame>
    );
  }

  if (props.scale === "spacious") {
    return (
      <frame
        AutomaticSize={Enum.AutomaticSize.Y}
        Size={UDim2.fromOffset(props.width, 0)}
        className="bg-surface-100 rounded-md border border-edge p-4 flex-col gap-3"
      >
        <ClusterBody scale="spacious" width={props.width} pad={16} gap={12} barW={32} barH={20} />
      </frame>
    );
  }

  return (
    <frame
      AutomaticSize={Enum.AutomaticSize.Y}
      Size={UDim2.fromOffset(props.width, 0)}
      className="bg-surface-100 rounded-md border border-edge p-3 flex-col gap-2"
    >
      <ClusterBody scale="comfortable" width={props.width} pad={12} gap={8} barW={24} barH={16} />
    </frame>
  );
}

function ClusterBody(props: {
  scale: DensityToken;
  width: number;
  pad: number;
  gap: number;
  barW: number;
  barH: number;
}) {
  const inner = props.width - props.pad * 2;

  return (
    <React.Fragment>
      <textlabel
        LayoutOrder={1}
        Size={UDim2.fromOffset(inner, 22)}
        Text="Controls"
        className="text-ink text-base text-left"
      />

      <textbutton
        AutoButtonColor={false}
        LayoutOrder={2}
        Size={new UDim2(1, 0, 0, props.pad + 16)}
        Text="Primary"
        className="bg-accent text-accent-50 text-base rounded-md"
      />

      <textbutton
        AutoButtonColor={false}
        LayoutOrder={3}
        Size={new UDim2(1, 0, 0, props.pad + 16)}
        Text="Surface"
        className="bg-surface text-ink text-base rounded-md"
      />

      {/* Token swatch bars: sizes are numbers here, not utilities. */}
      <frame LayoutOrder={4} Size={UDim2.fromOffset(inner, props.barH)} className="bg-transparent flex-row gap-2">
        <frame LayoutOrder={1} Size={UDim2.fromOffset(props.barW, props.barH)} className="bg-accent rounded-sm" />
        <frame LayoutOrder={2} Size={UDim2.fromOffset(props.barW, props.barH)} className="bg-accent rounded-sm" />
        <frame LayoutOrder={3} Size={UDim2.fromOffset(props.barW, props.barH)} className="bg-accent rounded-sm" />
      </frame>

      <textlabel
        LayoutOrder={5}
        Size={UDim2.fromOffset(inner, 18)}
        Text={`gap=${props.gap}px · pad=${props.pad}px (literal)`}
        className="text-ink-400 text-sm text-left"
      />
      <textlabel
        LayoutOrder={6}
        Size={UDim2.fromOffset(inner, 18)}
        Text={`scale="${props.scale}" · chosen by a branch, not a provider`}
        className="text-ink-400 text-sm text-left truncate"
      />
    </React.Fragment>
  );
}

function DensityColumn(props: { density: DensityToken; layoutOrder: number }) {
  return (
    <frame
      AutomaticSize={Enum.AutomaticSize.Y}
      LayoutOrder={props.layoutOrder}
      Size={UDim2.fromOffset(286, 0)}
      className="bg-transparent flex-col gap-1.5"
    >
      <textlabel
        LayoutOrder={1}
        Size={UDim2.fromOffset(286, 20)}
        Text={`density="${props.density}"`}
        className="text-ink text-base text-left"
      />
      <frame
        AutomaticSize={Enum.AutomaticSize.Y}
        LayoutOrder={2}
        Size={UDim2.fromOffset(286, 0)}
        className="bg-transparent"
      >
        {/*
          The provider still wraps the subtree so Lattice components inside it
          pick up the scope; the utilities above it do not.
        */}
        <DensityProvider defaultDensity={props.density}>
          <DensityCluster scale={props.density} width={286} />
        </DensityProvider>
      </frame>
    </frame>
  );
}

function DensityDetails(props: { title: string; description: string; layoutOrder: number }) {
  const { density, setDensity } = useDensity();

  return (
    <frame
      AutomaticSize={Enum.AutomaticSize.Y}
      LayoutOrder={props.layoutOrder}
      className="w-215 bg-surface rounded-md px-3 py-2.5 flex-col gap-2"
    >
      <textlabel
        LayoutOrder={1}
        Size={UDim2.fromOffset(640, 22)}
        Text={`${props.title} density: ${density}`}
        className="text-ink text-base text-left"
      />
      <textlabel
        LayoutOrder={2}
        Size={UDim2.fromOffset(800, 42)}
        Text={props.description}
        TextWrapped={true}
        className="text-ink-400 text-sm text-left align-top"
      />
      <frame LayoutOrder={3} Size={UDim2.fromOffset(820, 32)} className="bg-transparent flex-row items-center gap-2">
        <textbutton
          AutoButtonColor={false}
          Event={{
            Activated: () => {
              setDensity(nextDensity(density));
            },
          }}
          LayoutOrder={1}
          Text="Cycle Local Density"
          className="w-55 h-8 bg-surface text-ink text-base"
        />
        <textlabel
          LayoutOrder={2}
          Size={UDim2.fromOffset(520, 20)}
          Text="Chrome here is utility-styled, so this readout changes but the spacing does not."
          className="text-ink-400 text-sm text-left align-middle"
        />
      </frame>
    </frame>
  );
}

export function DensityScopeScene() {
  const { density, setDensity } = useDensity();

  return (
    <frame AutomaticSize={Enum.AutomaticSize.Y} className="w-230 bg-transparent flex-col gap-3">
      <frame AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={1} className="w-225 bg-transparent flex-col gap-1">
        <textlabel
          LayoutOrder={1}
          Size={UDim2.fromOffset(900, 28)}
          Text="Density scopes: a provider re-derives tokens at render time; utilities are fixed at compile time."
          className="text-ink text-xl text-left truncate"
        />
        <frame
          LayoutOrder={2}
          Size={UDim2.fromOffset(900, 34)}
          className="bg-transparent flex-row items-center gap-2.5"
        >
          <textlabel
            LayoutOrder={1}
            Size={UDim2.fromOffset(330, 24)}
            Text={`Root density: ${density}`}
            className="text-ink-400 text-base text-left align-middle"
          />
          <textbutton
            AutoButtonColor={false}
            Event={{
              Activated: () => {
                setDensity(nextDensity(density));
              },
            }}
            LayoutOrder={2}
            Text="Cycle Root Density"
            className="w-47.5 h-8 bg-surface text-ink text-base"
          />
        </frame>
      </frame>

      <SectionHeader
        hint="Three hand-written scales, one per step. The sibling scene renders one cluster and lets the provider size it."
        layoutOrder={2}
        title="SIDE BY SIDE — compact / comfortable / spacious"
      />
      <frame AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={3} className="w-225 bg-transparent flex-row gap-2.5">
        <DensityColumn density="compact" layoutOrder={1} />
        <DensityColumn density="comfortable" layoutOrder={2} />
        <DensityColumn density="spacious" layoutOrder={3} />
      </frame>

      <SectionHeader
        hint="The readouts still scope correctly — only the spacing they describe has stopped following them."
        layoutOrder={4}
        title="NESTED SCOPING"
      />
      <frame
        AutomaticSize={Enum.AutomaticSize.Y}
        LayoutOrder={5}
        className="w-225 bg-surface-100 rounded-lg p-3 flex-col gap-2.5"
      >
        <DensityDetails
          description="This section follows root density. Use the root toggle above and confirm the value updates."
          layoutOrder={1}
          title="Outer"
        />

        <DensityProvider defaultDensity="compact">
          <DensityDetails
            description="This section has its own DensityProvider. Change inner density and verify outer values stay unchanged."
            layoutOrder={2}
            title="Inner (nested)"
          />
        </DensityProvider>
      </frame>
    </frame>
  );
}
