import {
  AlignCenter,
  AlignVerticalJustifyStart,
  ArrowLeft,
  Bookmark,
  Clock,
  Grid,
  Image,
  MessageCircle,
  Moon,
  PaintBucket,
  Settings,
  Square,
  Sunrise,
  Text,
} from "lucide-solid";
import { createSignal } from "solid-js";
import { createStoredSignal } from "./hooks/localStorage";
import { cn } from "./libs/cn";
import { TextField, TextFieldRoot } from "./components/ui/textfield";
import { Button } from "./components/ui/button";

function SettingsTrigger() {
  const [open, setOpen] = createSignal(true);
  const [font, setFont] = createStoredSignal("font", "sans");
  const [theme, setTheme] = createStoredSignal("kb-color-mode", "system");
  const [background, setBackground] = createStoredSignal("background", "image");
  const [layout, setLayout] = createStoredSignal("layout", "center");
  const [name, setName] = createStoredSignal("name", "");
  const [mode, setMode] = createStoredSignal("mode", "widgets");
  const [greetingNameValue, setGreetingNameValue] = createSignal(name());

  function SettingsPage() {
    return (
      <div class="fixed inset-0 flex justify-center bg-background text-foreground z-10 overflow-y-auto">
        <div class="h-full w-full max-w-lg py-20">
          <h1 class="text-5xl font-bold">
            {chrome.i18n.getMessage("settings")}
          </h1>
          <br />
          <br />
          <h3 class="text-2xl font-[500]">{chrome.i18n.getMessage("mode")}</h3>
          <div class="w-full grid grid-cols-3 gap-4 grid-rows-1 **:data-selected:!ring-primary">
            <button
              class="card block not-prose font-normal group relative my-2 ring-2 ring-transparent rounded-xl h-[198px] dark:bg-background-dark border-1
              border-gray-950/10 dark:border-white/10 overflow-hidden w-full cursor-pointer hover:!border-primary dark:hover:!border-primary-light text-left pl-8"
              {...(mode() === "widgets" ? { "data-selected": true } : {})}
              onClick={() => {
                setMode("widgets");
              }}
            >
              <Grid class="size-[64px]" />
              <br />
              <span class="text-xl">{chrome.i18n.getMessage("widgets")}</span>
            </button>
            <button
              class="card block not-prose font-normal group relative my-2 ring-2 ring-transparent rounded-xl h-[198px] dark:bg-background-dark border-1
              border-gray-950/10 dark:border-white/10 overflow-hidden w-full cursor-pointer hover:!border-primary dark:hover:!border-primary-light text-left pl-8"
              {...(mode() === "nightstand" ? { "data-selected": true } : {})}
              onClick={() => {
                setMode("nightstand");
              }}
            >
              <Clock class="size-[64px]" />
              <br />
              <span class="text-xl">
                {chrome.i18n.getMessage("nightstand")}
              </span>
            </button>
            <button
              class="card block not-prose font-normal group relative my-2 ring-2 ring-transparent rounded-xl h-[198px] dark:bg-background-dark border-1
              border-gray-950/10 dark:border-white/10 overflow-hidden w-full cursor-pointer hover:!border-primary dark:hover:!border-primary-light text-left pl-8"
              {...(mode() === "speeddial" ? { "data-selected": true } : {})}
              onClick={() => {
                setMode("speeddial");
              }}
            >
              <Bookmark class="size-[64px]" />
              <br />
              <span class="text-xl">
                {chrome.i18n.getMessage("speed_dial")}
              </span>
            </button>
          </div>
          <br />
          <br />
          {mode() === "widgets" && (
            <div>
              <h3 class="text-2xl font-[500]">
                {chrome.i18n.getMessage("layout")}
              </h3>
              <div class="w-full grid grid-cols-1 gap-4 grid-rows-2 **:data-selected:!ring-primary">
                <button
                  class="card block not-prose font-normal group relative my-2 ring-2 ring-transparent rounded-xl h-[198px] dark:bg-background-dark border-1
              border-gray-950/10 dark:border-white/10 overflow-hidden w-full cursor-pointer hover:!border-primary dark:hover:!border-primary-light text-left pl-8"
                  {...(layout() === "center" ? { "data-selected": true } : {})}
                  onClick={() => {
                    setLayout("center");
                  }}
                >
                  <AlignCenter class="size-[64px]" fill="currentColor" />
                  <br />
                  <span class="text-xl">
                    {chrome.i18n.getMessage("center")}
                  </span>
                </button>
                <button
                  class="card block not-prose font-normal group relative my-2 ring-2 ring-transparent rounded-xl h-[198px] dark:bg-background-dark border-1
              border-gray-950/10 dark:border-white/10 overflow-hidden w-full cursor-pointer hover:!border-primary dark:hover:!border-primary-light text-left pl-8"
                  {...(layout() === "top" ? { "data-selected": true } : {})}
                  onClick={() => {
                    setLayout("top");
                  }}
                >
                  <AlignVerticalJustifyStart
                    class="size-[64px]"
                    fill="currentColor"
                  />
                  <br />
                  <span class="text-xl">{chrome.i18n.getMessage("top")}</span>
                </button>
              </div>
              <br />
              <br />
            </div>
          )}
          <h3 class="text-2xl font-[500]">{chrome.i18n.getMessage("font")}</h3>
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
              <span class="text-xl">{chrome.i18n.getMessage("sans")}</span>
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
              <span class="text-xl">{chrome.i18n.getMessage("serif")}</span>
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
              <span class="text-xl">{chrome.i18n.getMessage("mono")}</span>
            </button>
          </div>
          <br />
          <br />
          <h3 class="text-2xl font-[500]">{chrome.i18n.getMessage("theme")}</h3>
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
              <span class="text-xl">{chrome.i18n.getMessage("light")}</span>
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
              <span class="text-xl">{chrome.i18n.getMessage("dark")}</span>
            </button>
          </div>
          <br />
          <br />
          <h3 class="text-2xl font-[500]">
            {chrome.i18n.getMessage("background")}
          </h3>
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
              <span class="text-xl">{chrome.i18n.getMessage("image")}</span>
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
              <span class="text-xl">
                {chrome.i18n.getMessage("solid_color")}
              </span>
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
              <span class="text-xl">{chrome.i18n.getMessage("gradient")}</span>
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
              <span class="text-xl">{chrome.i18n.getMessage("blank")}</span>
            </button>
          </div>
          <br />
          <br />
          <h2 class="text-2xl font-[500] mb-3">
            {chrome.i18n.getMessage("greeting")}
          </h2>
          <div class="flex gap-2 items-start">
            <TextFieldRoot class="flex-1">
              <TextField
                placeholder="Enter greeting"
                value={greetingNameValue()}
                onInput={(e) => setGreetingNameValue(e.currentTarget.value)}
              />
              <span class="text-sm text-muted-foreground">
                {chrome.i18n.getMessage("leave_blank_to_disable")}
              </span>
            </TextFieldRoot>
            <Button
              onClick={() => setName(greetingNameValue())}
              disabled={name() == greetingNameValue()}
            >
              {name() == greetingNameValue()
                ? chrome.i18n.getMessage("saved")
                : chrome.i18n.getMessage("set_greeting")}
            </Button>
          </div>
          <br />
          <br />
          <h2 class="text-2xl font-[500] mb-3">
            {chrome.i18n.getMessage("more")}
          </h2>
          <div class="w-full grid grid-cols-2 gap-4 grid-rows-1 **:data-selected:!ring-primary">
            <a
              class="card block not-prose font-normal group relative my-2 ring-2 ring-transparent rounded-xl h-[198px] dark:bg-background-dark border-1
              border-gray-950/10 dark:border-white/10 overflow-hidden w-full cursor-pointer hover:!border-primary dark:hover:!border-primary-light text-left pl-8 pt-8"
              href="https://github.com/thingbomb/flowtide/discussions"
              target="_blank"
            >
              <MessageCircle class="size-[64px]" fill="none" />
              <br />
              <span class="text-xl">{chrome.i18n.getMessage("forum")}</span>
            </a>
            <a
              class="card block not-prose font-normal group relative my-2 ring-2 ring-transparent rounded-xl h-[198px] dark:bg-background-dark border-1
              border-gray-950/10 dark:border-white/10 overflow-hidden w-full cursor-pointer hover:!border-primary dark:hover:!border-primary-light text-left pl-8 pt-8"
              href="https://flowtide.canny.io/feature-requests"
              target="_blank"
            >
              <Text class="size-[64px]" fill="none" />
              <br />
              <span class="text-xl">
                {chrome.i18n.getMessage("feature_request")}
              </span>
            </a>
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
          "fixed top-0 left-0 flex items-center gap-2 p-4 cursor-pointer z-20 !text-foreground text-[16px]",
          open() ? "" : "hidden",
        )}
        onClick={() => setOpen(false)}
      >
        <ArrowLeft />
        {chrome.i18n.getMessage("go_back")}
      </button>
      {open() && <SettingsPage />}
    </div>
  );
}

export { SettingsTrigger };
