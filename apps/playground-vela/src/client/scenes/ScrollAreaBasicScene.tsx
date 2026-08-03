import { React } from "@lattice-ui/react-runtime";
import { ScrollArea } from "@lattice-ui/react-scroll-area";

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

function ContentTile(props: { label: string; size: UDim2; position: UDim2; layoutOrder?: number; danger?: boolean }) {
  if (props.danger === true) {
    return (
      <frame
        LayoutOrder={props.layoutOrder}
        Position={props.position}
        Size={props.size}
        className="bg-danger rounded-sm"
      >
        <textlabel
          AnchorPoint={new Vector2(0.5, 0.5)}
          Position={UDim2.fromScale(0.5, 0.5)}
          Size={UDim2.fromScale(1, 1)}
          Text={props.label}
          className="text-danger-50 text-sm"
        />
      </frame>
    );
  }

  return (
    <frame LayoutOrder={props.layoutOrder} Position={props.position} Size={props.size} className="bg-accent rounded-sm">
      <textlabel
        AnchorPoint={new Vector2(0.5, 0.5)}
        Position={UDim2.fromScale(0.5, 0.5)}
        Size={UDim2.fromScale(1, 1)}
        Text={props.label}
        className="text-accent-50 text-sm"
      />
    </frame>
  );
}

const VERTICAL_ITEMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const HORIZONTAL_ITEMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const BIG_ITEMS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const BIG_COLUMNS = 6;
const BIG_TILE_W = 160;
const BIG_TILE_H = 110;
const BIG_GAP = 12;
const BIG_PAD = 16;

export function ScrollAreaBasicScene() {
  const bigCanvasWidth = BIG_PAD * 2 + BIG_COLUMNS * BIG_TILE_W + (BIG_COLUMNS - 1) * BIG_GAP;
  const bigRows = math.ceil(BIG_ITEMS.size() / BIG_COLUMNS);
  const bigCanvasHeight = BIG_PAD * 2 + bigRows * BIG_TILE_H + (bigRows - 1) * BIG_GAP;

  return (
    <frame AutomaticSize={Enum.AutomaticSize.Y} className="w-235 bg-transparent flex-col gap-3">
      <frame AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={1} className="w-230 bg-transparent flex-col gap-1">
        <textlabel
          LayoutOrder={1}
          Size={UDim2.fromOffset(920, 28)}
          Text="ScrollArea: custom viewport + composable horizontal/vertical scrollbars and thumbs."
          className="text-ink text-xl text-left truncate"
        />
        <textlabel
          LayoutOrder={2}
          Size={UDim2.fromOffset(920, 20)}
          Text="Scrollbars auto-hide when content fits their axis, so a viewport shows only the bars it needs."
          className="text-ink-400 text-base text-left"
        />
      </frame>

      {/* VERTICAL ONLY */}
      <SectionHeader
        hint="Content overflows the Y axis only; the horizontal bar stays hidden."
        layoutOrder={2}
        title="VERTICAL ONLY"
      />
      <frame LayoutOrder={3} className="w-225 h-59 bg-surface rounded-lg p-3">
        <ScrollArea.Root>
          <frame className="w-105 h-50 bg-transparent">
            <ScrollArea.Viewport asChild>
              <scrollingframe
                AutomaticCanvasSize={Enum.AutomaticSize.Y}
                CanvasSize={UDim2.fromScale(0, 0)}
                ScrollBarImageTransparency={1}
                ScrollBarThickness={0}
                ScrollingDirection={Enum.ScrollingDirection.Y}
                Size={UDim2.fromOffset(408, 200)}
                className="bg-surface-100 rounded-md p-2 flex-col gap-2"
              >
                {VERTICAL_ITEMS.map((index) => (
                  <ContentTile
                    key={`v-${index}`}
                    label={`Row ${index}`}
                    layoutOrder={index}
                    position={UDim2.fromScale(0, 0)}
                    size={new UDim2(1, 0, 0, 40)}
                  />
                ))}
              </scrollingframe>
            </ScrollArea.Viewport>

            <ScrollArea.Scrollbar asChild orientation="vertical">
              <frame Position={UDim2.fromOffset(412, 0)} className="w-2 h-50 bg-edge">
                <ScrollArea.Thumb asChild orientation="vertical">
                  <frame Size={UDim2.fromScale(1, 1)} className="bg-ink-400 rounded-full" />
                </ScrollArea.Thumb>
              </frame>
            </ScrollArea.Scrollbar>
          </frame>
        </ScrollArea.Root>
      </frame>

      {/* HORIZONTAL ONLY */}
      <SectionHeader
        hint="Content overflows the X axis only; the vertical bar stays hidden."
        layoutOrder={4}
        title="HORIZONTAL ONLY"
      />
      <frame LayoutOrder={5} className="w-225 h-47.5 bg-surface rounded-lg p-3">
        <ScrollArea.Root>
          <frame className="w-215 h-37.5 bg-transparent">
            <ScrollArea.Viewport asChild>
              <scrollingframe
                AutomaticCanvasSize={Enum.AutomaticSize.X}
                CanvasSize={UDim2.fromScale(0, 0)}
                ScrollBarImageTransparency={1}
                ScrollBarThickness={0}
                ScrollingDirection={Enum.ScrollingDirection.X}
                Size={UDim2.fromOffset(860, 130)}
                className="bg-surface-100 rounded-md p-2.5 flex-row gap-2.5"
              >
                {HORIZONTAL_ITEMS.map((index) => (
                  <ContentTile
                    key={`h-${index}`}
                    label={`Col ${index}`}
                    layoutOrder={index}
                    position={UDim2.fromScale(0, 0)}
                    size={new UDim2(0, 150, 1, 0)}
                  />
                ))}
              </scrollingframe>
            </ScrollArea.Viewport>

            <ScrollArea.Scrollbar asChild orientation="horizontal">
              <frame Position={UDim2.fromOffset(0, 134)} className="w-215 h-2 bg-edge">
                <ScrollArea.Thumb asChild orientation="horizontal">
                  <frame Size={UDim2.fromScale(1, 1)} className="bg-ink-400 rounded-full" />
                </ScrollArea.Thumb>
              </frame>
            </ScrollArea.Scrollbar>
          </frame>
        </ScrollArea.Root>
      </frame>

      {/* BOTH AXES — LARGE CONTENT */}
      <SectionHeader
        hint="A large canvas that overflows both axes: vertical bar, horizontal bar, and the corner square between them."
        layoutOrder={6}
        title="BOTH AXES — LARGE CONTENT"
      />
      <frame LayoutOrder={7} className="w-225 h-80 bg-surface rounded-lg p-3">
        <ScrollArea.Root>
          <frame className="w-215 h-70 bg-transparent">
            <ScrollArea.Viewport asChild>
              <scrollingframe
                AutomaticCanvasSize={Enum.AutomaticSize.None}
                CanvasSize={UDim2.fromOffset(bigCanvasWidth, bigCanvasHeight)}
                ScrollBarImageTransparency={1}
                ScrollBarThickness={0}
                ScrollingDirection={Enum.ScrollingDirection.XY}
                Size={UDim2.fromOffset(848, 268)}
                className="bg-surface-100 rounded-md"
              >
                {BIG_ITEMS.map((index) => {
                  const column = index % BIG_COLUMNS;
                  const row = math.floor(index / BIG_COLUMNS);
                  return (
                    <ContentTile
                      key={`b-${index}`}
                      danger={index % 7 === 0}
                      label={`${index + 1}`}
                      position={UDim2.fromOffset(
                        BIG_PAD + column * (BIG_TILE_W + BIG_GAP),
                        BIG_PAD + row * (BIG_TILE_H + BIG_GAP),
                      )}
                      size={UDim2.fromOffset(BIG_TILE_W, BIG_TILE_H)}
                    />
                  );
                })}
              </scrollingframe>
            </ScrollArea.Viewport>

            <ScrollArea.Scrollbar asChild orientation="vertical">
              <frame Position={UDim2.fromOffset(852, 0)} className="w-2 h-67 bg-edge">
                <ScrollArea.Thumb asChild orientation="vertical">
                  <frame Size={UDim2.fromScale(1, 1)} className="bg-ink-400 rounded-full" />
                </ScrollArea.Thumb>
              </frame>
            </ScrollArea.Scrollbar>

            <ScrollArea.Scrollbar asChild orientation="horizontal">
              <frame Position={UDim2.fromOffset(0, 272)} className="w-212 h-2 bg-edge">
                <ScrollArea.Thumb asChild orientation="horizontal">
                  <frame Size={UDim2.fromScale(1, 1)} className="bg-ink-400 rounded-full" />
                </ScrollArea.Thumb>
              </frame>
            </ScrollArea.Scrollbar>

            <ScrollArea.Corner asChild>
              <frame Position={UDim2.fromOffset(852, 272)} className="w-2 h-2 bg-edge" />
            </ScrollArea.Corner>
          </frame>
        </ScrollArea.Root>
      </frame>
    </frame>
  );
}
