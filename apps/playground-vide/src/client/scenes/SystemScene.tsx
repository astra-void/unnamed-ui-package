import { Vide } from "@lattice-ui/vide-runtime";
import { Box, Text, useTheme } from "@lattice-ui/vide-style";
import { DensityProvider, Grid, Row, Stack, surface, useSystemTheme } from "@lattice-ui/vide-system";
import { SceneReadout, SceneRoot } from "./parts";

const SURFACES = ["sunken", "surface", "elevated"] as const;

function SurfaceCard(props: { token: (typeof SURFACES)[number]; order: number }) {
  const { theme } = useTheme();

  return (
    <Box
      sx={surface(props.token)}
      LayoutOrder={props.order}
      Size={UDim2.fromOffset(180, 84)}
      // Corner and label are appearance, which is the demo's business rather than the token's.
    >
      {() => [
        <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />,
        <Text
          BackgroundTransparency={1}
          Size={UDim2.fromScale(1, 1)}
          Text={props.token}
          TextColor3={() => theme().colors.textPrimary}
          TextSize={() => theme().typography.bodyMd.textSize}
        />,
      ]}
    </Box>
  );
}

function DensitySample(props: { label: string }) {
  const { theme } = useTheme();
  const { density } = useSystemTheme();

  return (
    <Stack gap={8} padding={12} sx={surface("elevated")} autoSize="y" Size={UDim2.fromOffset(280, 0)}>
      {() => [
        <uicorner CornerRadius={() => new UDim(0, theme().radius.md)} />,
        <Text
          BackgroundTransparency={1}
          LayoutOrder={1}
          Size={UDim2.fromOffset(256, 20)}
          Text={() => `${props.label} — ${density()}`}
          TextColor3={() => theme().colors.textPrimary}
          TextSize={() => theme().typography.bodyMd.textSize}
          TextXAlignment={Enum.TextXAlignment.Left}
        />,
        <Text
          BackgroundTransparency={1}
          LayoutOrder={2}
          Size={UDim2.fromOffset(256, 36)}
          Text={() => `space[12] resolves to ${theme().space[12]}px at this density.`}
          TextColor3={() => theme().colors.textSecondary}
          TextSize={() => theme().typography.labelSm.textSize}
          TextWrapped
          TextXAlignment={Enum.TextXAlignment.Left}
          TextYAlignment={Enum.TextYAlignment.Top}
        />,
      ]}
    </Stack>
  );
}

export function SystemScene() {
  const { theme } = useTheme();

  return (
    <SceneRoot
      title="Style & System — tokens, layout and a nested density scope"
      summary={() =>
        `Radius lg is ${theme().radius.lg}px; the grid measures its own width before it picks a column count.`
      }
    >
      <Stack gap={12} LayoutOrder={1} Size={UDim2.fromOffset(900, 120)}>
        {() => [
          <Text
            BackgroundTransparency={1}
            LayoutOrder={1}
            Size={UDim2.fromOffset(880, 18)}
            Text="SURFACE TOKENS"
            TextColor3={() => theme().colors.textSecondary}
            TextSize={() => theme().typography.labelSm.textSize}
            TextXAlignment={Enum.TextXAlignment.Left}
          />,
          <Row gap={12} LayoutOrder={2} Size={UDim2.fromOffset(880, 84)}>
            {() => SURFACES.map((token, index) => <SurfaceCard token={token} order={index + 1} />)}
          </Row>,
        ]}
      </Stack>

      <Stack gap={12} LayoutOrder={2} Size={UDim2.fromOffset(900, 150)}>
        {() => [
          <Text
            BackgroundTransparency={1}
            LayoutOrder={1}
            Size={UDim2.fromOffset(880, 18)}
            Text="GRID — COLUMNS FOLLOW THE WIDTH THE GRID ACTUALLY GOT"
            TextColor3={() => theme().colors.textSecondary}
            TextSize={() => theme().typography.labelSm.textSize}
            TextXAlignment={Enum.TextXAlignment.Left}
          />,
          <Grid minColumnWidth={160} cellHeight={48} gap={8} LayoutOrder={2} Size={UDim2.fromOffset(880, 110)}>
            {() =>
              [1, 2, 3, 4, 5, 6, 7, 8].map((cell) => (
                <Box sx={surface("surface")} LayoutOrder={cell} Size={UDim2.fromOffset(160, 48)}>
                  {() => (
                    <Text
                      BackgroundTransparency={1}
                      Size={UDim2.fromScale(1, 1)}
                      Text={`Cell ${cell}`}
                      TextColor3={() => theme().colors.textSecondary}
                      TextSize={() => theme().typography.labelSm.textSize}
                    />
                  )}
                </Box>
              ))
            }
          </Grid>,
        ]}
      </Stack>

      <Row gap={12} LayoutOrder={3} Size={UDim2.fromOffset(900, 130)}>
        {() => [
          <DensitySample label="Inherited scope" />,
          // A nested DensityProvider re-derives the same base theme at another density, which is why
          // the base theme and the density scope are separate cores.
          <DensityProvider defaultDensity="compact">{() => <DensitySample label="Nested scope" />}</DensityProvider>,
        ]}
      </Row>

      <SceneReadout order={4} width={880} text="Both scopes read one base theme; only the spacing scale differs." />
    </SceneRoot>
  );
}
