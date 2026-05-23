import { render } from "ink";
import { GameProvider } from "./state/GameContext.js";
import { App } from "./components/App.js";

render(
  <GameProvider>
    <App />
  </GameProvider>,
);
