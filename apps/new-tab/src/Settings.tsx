import {
  ArrowLeft,
  Image,
  Lightbulb,
  Moon,
  PaintBucket,
  Settings,
  Square,
  Sunrise,
} from "lucide-solid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { createSignal } from "solid-js";
import { createStoredSignal } from "./hooks/localStorage";
import { cn } from "./libs/cn";

function SettingsTrigger() {
  const [open, setOpen] = createSignal(false);
  const [font, setFont] = createStoredSignal("font", "sans");
  const [theme, setTheme] = createStoredSignal("kb-color-mode", "light");
  const [background, setBackground] = createStoredSignal("background", "image");

  function SettingsPage() {
    return (
      <div class="fixed inset-0 flex justify-center bg-background text-foreground z-10 overflow-y-auto">
        <div class="h-full w-full max-w-lg py-20">
          <h1 class="text-5xl font-bold">
            {chrome.i18n.getMessage("settings")}
          </h1>
          <br />
          <br />
          <h3 class="text-2xl font-[500]">Theme</h3>
          <div class="w-full grid grid-cols-2 gap-4 grid-rows-1 **:data-selected:!ring-primary">
            <button
              class="card block not-prose font-normal group relative my-2 ring-2 ring-transparent rounded-xl h-[198px] dark:bg-background-dark border-1
              border-gray-950/10 dark:border-white/10 overflow-hidden w-full cursor-pointer hover:!border-primary dark:hover:!border-primary-light text-left pl-8"
              {...(theme() === "light" ? { "data-selected": true } : {})}
              onClick={() => {
                setTheme("light");
                document.documentElement.setAttribute("data-kb-theme", "light");
                document.documentElement.style.colorScheme = "light";
              }}
            >
              <Moon class="size-[64px]" fill="none" />
              <br />
              <span class="text-xl">Light</span>
            </button>
            <button
              class="card block not-prose font-normal group relative my-2 ring-2 ring-transparent rounded-xl h-[198px] dark:bg-background-dark border-1
              border-gray-950/10 dark:border-white/10 overflow-hidden w-full cursor-pointer hover:!border-primary dark:hover:!border-primary-light text-left pl-8"
              {...(theme() === "dark" ? { "data-selected": true } : {})}
              onClick={() => {
                setTheme("dark");
                document.documentElement.setAttribute("data-kb-theme", "dark");
                document.documentElement.style.colorScheme = "dark";
              }}
            >
              <Moon class="size-[64px]" fill="currentColor" />
              <br />
              <span class="text-xl">Dark</span>
            </button>
          </div>
          <br />
          <br />
          <h3 class="text-2xl font-[500]">Font</h3>
          <div class="w-full grid grid-cols-3 gap-4 grid-rows-1 **:data-selected:!ring-primary">
            <button
              class="card block not-prose font-normal group relative my-2 ring-2 ring-transparent rounded-xl size-[132px] dark:bg-background-dark border-1
              border-gray-950/10 dark:border-white/10 overflow-hidden w-full cursor-pointer hover:!border-primary dark:hover:!border-primary-light text-left pl-8"
              {...(font() === "sans" ? { "data-selected": true } : {})}
              onClick={() => {
                setFont("sans");
              }}
            >
              <span class="!font-sans font-bold text-5xl">Aa</span>
              <br />
              <span class="text-xl">Sans</span>
            </button>
            <button
              class="card block not-prose font-normal group relative my-2 ring-2 ring-transparent rounded-xl size-[132px] dark:bg-background-dark border-1
              border-gray-950/10 dark:border-white/10 overflow-hidden w-full cursor-pointer hover:!border-primary dark:hover:!border-primary-light text-left pl-8"
              {...(font() === "serif" ? { "data-selected": true } : {})}
              onClick={() => {
                setFont("serif");
              }}
            >
              <span class="!font-serif font-bold text-5xl">Aa</span>
              <br />
              <span class="text-xl">Serif</span>
            </button>
            <button
              class="card block not-prose font-normal group relative my-2 ring-2 ring-transparent rounded-xl size-[132px] dark:bg-background-dark border-1
              border-gray-950/10 dark:border-white/10 overflow-hidden w-full cursor-pointer hover:!border-primary dark:hover:!border-primary-light text-left pl-8"
              {...(font() === "mono" ? { "data-selected": true } : {})}
              onClick={() => {
                setFont("mono");
              }}
            >
              <span class="!font-mono font-bold text-5xl">Aa</span>
              <br />
              <span class="text-xl">Mono</span>
            </button>
          </div>
          <br />
          <br />
          <h3 class="text-2xl font-[500]">Background</h3>
          <div class="w-full grid grid-cols-2 gap-4 grid-rows-1 **:data-selected:!ring-primary">
            <button
              class="card block not-prose font-normal group relative my-2 ring-2 ring-transparent rounded-xl h-[198px] dark:bg-background-dark border-1
              border-gray-950/10 dark:border-white/10 overflow-hidden w-full cursor-pointer hover:!border-primary dark:hover:!border-primary-light text-left pl-8"
              {...(background() === "image" ? { "data-selected": true } : {})}
              onClick={() => {
                setBackground("image");
              }}
            >
              <Image class="size-[64px]" fill="none" />
              <br />
              <span class="text-xl">Image</span>
            </button>
            <button
              class="card block not-prose font-normal group relative my-2 ring-2 ring-transparent rounded-xl h-[198px] dark:bg-background-dark border-1
              border-gray-950/10 dark:border-white/10 overflow-hidden w-full cursor-pointer hover:!border-primary dark:hover:!border-primary-light text-left pl-8"
              {...(background() === "solid-color"
                ? { "data-selected": true }
                : {})}
              onClick={() => {
                setBackground("solid-color");
              }}
            >
              <PaintBucket class="size-[64px]" fill="none" />
              <br />
              <span class="text-xl">Solid color</span>
            </button>
            <button
              class="card block not-prose font-normal group relative my-2 ring-2 ring-transparent rounded-xl h-[198px] dark:bg-background-dark border-1
              border-gray-950/10 dark:border-white/10 overflow-hidden w-full cursor-pointer hover:!border-primary dark:hover:!border-primary-light text-left pl-8"
              {...(background() === "gradient"
                ? { "data-selected": true }
                : {})}
              onClick={() => {
                setBackground("gradient");
              }}
            >
              <Sunrise class="size-[64px]" fill="none" />
              <br />
              <span class="text-xl">Gradient</span>
            </button>
            <button
              class="card block not-prose font-normal group relative my-2 ring-2 ring-transparent rounded-xl h-[198px] dark:bg-background-dark border-1
              border-gray-950/10 dark:border-white/10 overflow-hidden w-full cursor-pointer hover:!border-primary dark:hover:!border-primary-light text-left pl-8"
              {...(background() === "blank" ? { "data-selected": true } : {})}
              onClick={() => {
                setBackground("blank");
              }}
            >
              <Square class="size-[64px]" fill="none" />
              <br />
              <span class="text-xl">Blank</span>
            </button>
          </div>
          <br />
          <br />
          <p>
            Open-source on{" "}
            <a href="https://github.com/thingbomb/flowtide">GitHub</a>. Released
            under{" "}
            <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GPLv3</a>.
          </p>
          <br />
        </div>
      </div>
    );
  }

  return (
    <div class="h-[20px]">
      <button class="group" onclick={() => setOpen(true)} aria-haspopup="true">
        <Settings class="size-[20px] hover:rotate-25 transition-transform" />
      </button>
      <button
        class={cn(
          "fixed top-0 left-0 flex items-center gap-2 p-4 cursor-pointer z-20 !text-foreground",
          open() ? "" : "hidden",
        )}
        onClick={() => setOpen(false)}
      >
        <ArrowLeft />
        Go back
      </button>
      {open() && <SettingsPage />}
    </div>
  );
}

export { SettingsTrigger };
