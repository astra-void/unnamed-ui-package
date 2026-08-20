export type DensityToken = "compact" | "comfortable" | "spacious";

export type DensityContextValue = {
  density: DensityToken;
  setDensity: (next: DensityToken) => void;
};
