import {
  AlignCenter,
  AlignVerticalJustifyStart,
  ArrowLeft,
  Bookmark,
  Clock,
  CloudLightningIcon,
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
  const [open, setOpen] = createSignal(false);
  const [font, setFont] = createStoredSignal("font", "sans");
  const [theme, setTheme] = createStoredSignal("kb-color-mode", "system");
  const [background, setBackground] = createStoredSignal("background", "image");
  const [layout, setLayout] = createStoredSignal("layout", "center");
  const [name, setName] = createStoredSignal("name", "");
  const [mode, setMode] = createStoredSignal("mode", "widgets");
  const [greetingNameValue, setGreetingNameValue] = createSignal(name());

  function SettingsPage() {
    return (
      <div class="bg-background text-foreground fixed inset-0 z-10 flex justify-center overflow-y-auto">
        <div class="h-full w-full max-w-lg py-20">
          <h1 class="text-5xl font-bold">
            {chrome.i18n.getMessage("settings")}
          </h1>
          <br />
          <br />
          <h3 class="text-2xl font-[500]">{chrome.i18n.getMessage("mode")}</h3>
          <div class="**:data-selected:!ring-primary grid w-full grid-cols-3 grid-rows-1 gap-4">
            <button
              class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 block h-[198px] w-full cursor-pointer overflow-hidden rounded-xl border-gray-950/10 pl-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
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
              class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 block h-[198px] w-full cursor-pointer overflow-hidden rounded-xl border-gray-950/10 pl-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
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
              class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 block h-[198px] w-full cursor-pointer overflow-hidden rounded-xl border-gray-950/10 pl-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
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
              <div class="**:data-selected:!ring-primary grid w-full grid-cols-1 grid-rows-2 gap-4">
                <button
                  class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 block h-[198px] w-full cursor-pointer overflow-hidden rounded-xl border-gray-950/10 pl-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
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
                  class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 block h-[198px] w-full cursor-pointer overflow-hidden rounded-xl border-gray-950/10 pl-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
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
          <div class="**:data-selected:!ring-primary grid w-full grid-cols-3 grid-rows-1 gap-4">
            <button
              class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 block size-[132px] w-full cursor-pointer overflow-hidden rounded-xl border-gray-950/10 pl-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
              {...(font() === "sans" ? { "data-selected": true } : {})}
              onClick={() => {
                setFont("sans");
              }}
            >
              <span class="!font-sans text-5xl font-bold">Aa</span>
              <br />
              <span class="text-xl">{chrome.i18n.getMessage("sans")}</span>
            </button>
            <button
              class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 block size-[132px] w-full cursor-pointer overflow-hidden rounded-xl border-gray-950/10 pl-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
              {...(font() === "serif" ? { "data-selected": true } : {})}
              onClick={() => {
                setFont("serif");
              }}
            >
              <span class="!font-serif text-5xl font-bold">Aa</span>
              <br />
              <span class="text-xl">{chrome.i18n.getMessage("serif")}</span>
            </button>
            <button
              class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 block size-[132px] w-full cursor-pointer overflow-hidden rounded-xl border-gray-950/10 pl-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
              {...(font() === "mono" ? { "data-selected": true } : {})}
              onClick={() => {
                setFont("mono");
              }}
            >
              <span class="!font-mono text-5xl font-bold">Aa</span>
              <br />
              <span class="text-xl">{chrome.i18n.getMessage("mono")}</span>
            </button>
          </div>
          <br />
          <br />
          <h3 class="text-2xl font-[500]">{chrome.i18n.getMessage("theme")}</h3>
          <div class="**:data-selected:!ring-primary grid w-full grid-cols-2 grid-rows-1 gap-4">
            <button
              class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 block h-[198px] w-full cursor-pointer overflow-hidden rounded-xl border-gray-950/10 pl-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
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
              class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 block h-[198px] w-full cursor-pointer overflow-hidden rounded-xl border-gray-950/10 pl-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
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
          <div class="**:data-selected:!ring-primary grid w-full grid-cols-2 grid-rows-1 gap-4">
            <button
              class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 block h-[198px] w-full cursor-pointer overflow-hidden rounded-xl border-gray-950/10 pl-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
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
              class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 block h-[198px] w-full cursor-pointer overflow-hidden rounded-xl border-gray-950/10 pl-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
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
              class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 block h-[198px] w-full cursor-pointer overflow-hidden rounded-xl border-gray-950/10 pl-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
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
              class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 block h-[198px] w-full cursor-pointer overflow-hidden rounded-xl border-gray-950/10 pl-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
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
          <h2 class="mb-3 text-2xl font-[500]">
            {chrome.i18n.getMessage("greeting")}
          </h2>
          <div class="flex items-start gap-2">
            <TextFieldRoot class="flex-1">
              <TextField
                placeholder="Enter greeting"
                value={greetingNameValue()}
                onInput={(e) => setGreetingNameValue(e.currentTarget.value)}
              />
              <span class="text-muted-foreground text-sm">
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
          <h2 class="mb-3 text-2xl font-[500]">
            {chrome.i18n.getMessage("more")}
          </h2>
          <div class="**:data-selected:!ring-primary grid w-full grid-cols-2 grid-rows-1 gap-4">
            <a
              class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 block h-[198px] w-full cursor-pointer overflow-hidden rounded-xl border-gray-950/10 pl-8 pt-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
              href="https://github.com/thingbomb/flowtide/discussions"
              target="_blank"
            >
              <MessageCircle class="size-[64px]" fill="none" />
              <br />
              <span class="text-xl">{chrome.i18n.getMessage("forum")}</span>
            </a>
            <a
              class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 block h-[198px] w-full cursor-pointer overflow-hidden rounded-xl border-gray-950/10 pl-8 pt-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
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
        <Settings class="hover:rotate-25 size-[20px] transition-transform" />
      </button>
      <button
        class={cn(
          "!text-foreground fixed left-0 top-0 z-20 flex cursor-pointer items-center gap-2 p-4 text-[16px]",
          open() ? "" : "hidden"
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
