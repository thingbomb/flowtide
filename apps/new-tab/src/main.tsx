import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "@flowtide/ui/styles.css";
import { ThemeProvider } from "@flowtide/ui";
import { Toaster } from "@flowtide/ui";

const root = document.getElementById("root") as HTMLElement;

createRoot(root).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <App />
      <Toaster />
    </ThemeProvider>
  </StrictMode>,
);
