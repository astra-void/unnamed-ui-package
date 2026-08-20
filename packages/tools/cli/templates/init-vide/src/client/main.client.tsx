import { defaultLightTheme, ThemeProvider } from "@lattice-ui/vide-style";
import Vide from "@rbxts/vide";
import { App } from "./App";

const Players = game.GetService("Players");
const player = Players.LocalPlayer;
if (!player) {
  error("LocalPlayer is required.");
}

const playerGuiInstance = player.WaitForChild("PlayerGui");
if (!playerGuiInstance.IsA("PlayerGui")) {
  error("PlayerGui is required.");
}

const container = new Instance("Folder");
container.Name = "LatticeRoot";
container.Parent = playerGuiInstance;

// One mount owns every effect the tree creates; a Vide component runs once, so props that have to
// follow state are written as getters rather than read here.
Vide.mount(() => ThemeProvider({ theme: defaultLightTheme, children: () => App() }), container);
