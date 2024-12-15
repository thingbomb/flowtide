import type { Config } from "tailwindcss";
import sharedConfig from "@flowtide/tailwind-config";

const config: Pick<Config, "prefix" | "presets" | "content"> = {
  content: ["./src/*.{js,ts,jsx,tsx}"],
  presets: [sharedConfig],
};

export default config;
