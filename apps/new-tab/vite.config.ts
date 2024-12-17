import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import path from "path";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssNested from "postcss-nested";

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer, postcssNested],
    },
  },
});
