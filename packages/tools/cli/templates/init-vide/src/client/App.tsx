import { Text } from "@lattice-ui/vide-style";
// The JSX in this file compiles to `Vide.jsx(...)`, so the identifier has to be in scope as a value.
import Vide from "@rbxts/vide";
import { LATTICE_INIT_MESSAGE } from "../shared/constants";

export function App() {
  return (
    <screengui IgnoreGuiInset ResetOnSpawn={false}>
      <frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
        <Text
          AnchorPoint={new Vector2(0.5, 0.5)}
          Position={UDim2.fromScale(0.5, 0.5)}
          Size={UDim2.fromOffset(420, 40)}
          Text={LATTICE_INIT_MESSAGE}
          TextSize={24}
          TextXAlignment={Enum.TextXAlignment.Center}
          TextYAlignment={Enum.TextYAlignment.Center}
        />
      </frame>
    </screengui>
  );
}
