import { render } from "ink";
import { GameProvider } from "./state/GameContext.js";
import { LocaleProvider } from "./i18n/LocaleContext.js";
import { App } from "./components/App.js";

render(
  <LocaleProvider>
    <GameProvider>
      <App />
    </GameProvider>
  </LocaleProvider>,
);
