/*
    Flowtide
    Copyright (C) 2024-present George Stone

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    https://github.com/thingbomb/flowtide
*/
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
