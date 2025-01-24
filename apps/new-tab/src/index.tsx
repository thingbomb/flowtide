/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

const scheme =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const rootElement = document.documentElement;
rootElement.setAttribute("data-kb-theme", scheme);
rootElement.style.colorScheme = scheme;

setInterval(() => {
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const rootElement = document.documentElement;
  rootElement.setAttribute("data-kb-theme", prefersDark ? "dark" : "light");
  rootElement.style.colorScheme = prefersDark ? "dark" : "light";
}, 500);

render(
  () => (
    <div>
      <App />
    </div>
  ),
  root!
);
