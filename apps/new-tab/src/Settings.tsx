import {
  AlignCenter,
  AlignVerticalJustifyStart,
  ArrowLeft,
  Bookmark,
  Calendar,
  Calendar1,
  Clock,
  CloudLightningIcon,
  Grid,
  Hourglass,
  Image,
  MessageCircle,
  Moon,
  PaintBucket,
  Palette,
  RefreshCcw,
  Settings,
  Square,
  Sunrise,
  Text,
} from "lucide-solid";
import { createSignal, on, onMount } from "solid-js";
import { createStoredSignal } from "./hooks/localStorage";
import { cn } from "./libs/cn";
import { TextField, TextFieldRoot } from "./components/ui/textfield";
import { Button } from "./components/ui/button";

function BigButton(props: any) {
  return (
    <button class="card-style" {...props}>
      <div class="icon">{props.icon}</div>
      <span class="text-xl">{props.title}</span>
    </button>
  );
}

function SettingsTrigger({
  className,
  triggerClass,
}: {
  className?: string;
  triggerClass?: string;
}) {
  function textToImage(text: string) {
    const canvas = document.createElement("canvas");
    const ctx: any = canvas.getContext("2d");

    canvas.width = 128;
    canvas.height = 128;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let fontSize = 128;
    ctx.font = `bold ${fontSize}px system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    while (ctx.measureText(text).width > canvas.width - 10 && fontSize > 10) {
      fontSize -= 2;
      ctx.font = `bold ${fontSize}px system-ui`;
    }

    if (document.documentElement.style.colorScheme === "dark") {
      ctx.fillStyle = "white";
    } else {
      ctx.fillStyle = "black";
    }

    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL();
  }

  const [open, setOpen] = createSignal(false);
  const [font, setFont] = createStoredSignal("font", "sans");
  const [theme, setTheme] = createStoredSignal("kb-color-mode", "system");
  const [background, setBackground] = createStoredSignal("background", "image");
  const [layout, setLayout] = createStoredSignal("layout", "center");
  const [clockFormat, setClockFormat] = createStoredSignal(
    "clockFormat",
    "12h"
  );
  const [name, setName] = createStoredSignal("name", "");
  const [mode, setMode] = createStoredSignal("mode", "widgets");
  const [greetingNameValue, setGreetingNameValue] = createSignal(name());
  const [pageTitle, setPageTitle] = createStoredSignal("pageTitle", "");
  const [pageTitleValue, setPageTitleValue] = createSignal(pageTitle());
  const [pageIcon, setPageIcon] = createStoredSignal("pageIcon", "");
  const [pageIconValue, setPageIconValue] = createSignal(pageIcon());
  const [opacity, setOpacity] = createStoredSignal<number>("opacity", 0.8);
  const [settingsMenu, setSettingsMenu] = createSignal<string>("general");
  const [wallpaperBlur, setWallpaperBlur] = createStoredSignal<number>(
    "wallpaperBlur",
    0
  );
  const [wallpaperChangeTime, setWallpaperChangeTime] =
    createStoredSignal<number>("wallpaperChangeTime", 1000 * 60 * 60 * 24);
  const [pageIconURL, setPageIconURL] = createStoredSignal(
    "iconUrl",
    "assets/logo.png"
  );
  const [textStyle, setTextStyle] = createStoredSignal("textStyle", "normal");
  onMount(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      } else if ((e.ctrlKey || e.metaKey) && e.key === ",") {
        e.preventDefault();
        setOpen(true);
      }
    });
  });
  function SettingsPage() {
    return (
      <div
        class={cn(
          "text-foreground bg-background fixed inset-0 z-10 grid max-h-screen grid-cols-[300px_calc(100vw-300px)]",
          {
            "**:font-sans": font() == "sans",
            "**:font-serif": font() == "serif",
            "**:font-mono": font() == "mono",
            "**:font-comic-sans": font() == "comic-sans",
          }
        )}
      >
        <div
          id="sidebar"
          class="border-r-[rgb(39, 39, 42)] flex h-full w-[300px] max-w-lg flex-col gap-2 border-r-2 bg-[hsl(var(--sidebar))] px-4 py-20"
        >
          <button
            class="flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-left text-sm active:opacity-80 data-[selected]:border-blue-800 data-[selected]:bg-blue-800 data-[selected]:text-white"
            {...(settingsMenu() == "general"
              ? { "data-selected": "true" }
              : "")}
            onClick={() => {
              setSettingsMenu("general");
            }}
          >
            <Settings
              height={20}
              class="size-6 justify-start rounded-lg bg-purple-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("general")}
          </button>
          <button
            {...(settingsMenu() == "appearance"
              ? { "data-selected": "true" }
              : "")}
            onClick={() => {
              setSettingsMenu("appearance");
            }}
            class="flex items-center justify-start gap-2 rounded-lg border-2 px-4 py-2 text-left text-sm active:opacity-80 data-[selected]:border-blue-800 data-[selected]:bg-blue-800 data-[selected]:text-white"
          >
            <Palette
              height={20}
              class="size-6 rounded-lg bg-pink-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("appearance")}
          </button>
          <button
            {...(settingsMenu() == "background"
              ? { "data-selected": "true" }
              : "")}
            onClick={() => {
              setSettingsMenu("background");
            }}
            class="flex items-center justify-start gap-2 rounded-lg border-2 px-4 py-2 text-left text-sm active:opacity-80 data-[selected]:border-blue-800 data-[selected]:bg-blue-800 data-[selected]:text-white"
          >
            <Image
              height={20}
              class="size-6 rounded-lg bg-teal-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("background")}
          </button>
        </div>
        <div class="h-full w-[calc(100vw-300px)] overflow-y-auto p-10 pt-14">
          {settingsMenu() === "general" && (
            <>
              <h3 class="text-2xl font-[500]">
                {chrome.i18n.getMessage("mode")}
              </h3>
              <div class="card-group grid-cols-3 grid-rows-1">
                <BigButton
                  {...(mode() === "widgets" ? { "data-selected": true } : {})}
                  onClick={() => {
                    setMode("widgets");
                  }}
                  title={chrome.i18n.getMessage("widgets")}
                  icon={<Grid class="size-[64px]" />}
                />
                <BigButton
                  {...(mode() === "nightstand"
                    ? { "data-selected": true }
                    : {})}
                  onClick={() => {
                    setMode("nightstand");
                  }}
                  title={chrome.i18n.getMessage("nightstand")}
                  icon={<Clock class="size-[64px]" />}
                />
                <BigButton
                  {...(mode() === "speeddial" ? { "data-selected": true } : {})}
                  onClick={() => {
                    setMode("speeddial");
                  }}
                  title={chrome.i18n.getMessage("speed_dial")}
                  icon={<Bookmark class="size-[64px]" />}
                />
              </div>
              <br />
              <br />
              {mode() === "widgets" && (
                <div>
                  <h3 class="text-2xl font-[500]">
                    {chrome.i18n.getMessage("layout")}
                  </h3>
                  <div class="card-group grid-cols-2 grid-rows-1">
                    <BigButton
                      {...(layout() === "center"
                        ? { "data-selected": true }
                        : {})}
                      onClick={() => {
                        setLayout("center");
                      }}
                      title={chrome.i18n.getMessage("center")}
                      icon={
                        <AlignCenter class="size-[64px]" fill="currentColor" />
                      }
                    />
                    <BigButton
                      {...(layout() === "top" ? { "data-selected": true } : {})}
                      onClick={() => {
                        setLayout("top");
                      }}
                      title={chrome.i18n.getMessage("top")}
                      icon={
                        <AlignVerticalJustifyStart
                          class="size-[64px]"
                          fill="currentColor"
                        />
                      }
                    />
                  </div>
                </div>
              )}
              <br />
              <br />
              <h2 class="mb-3 text-2xl font-[500]">
                {chrome.i18n.getMessage("greeting")}
              </h2>
              <div class="flex items-start gap-2">
                <TextFieldRoot class="flex-1">
                  <TextField
                    placeholder={chrome.i18n.getMessage("enter_greeting")}
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
                {chrome.i18n.getMessage("page")}
              </h2>
              <div class="flex items-start gap-2">
                <TextFieldRoot class="flex flex-1 gap-2">
                  <TextField
                    placeholder={chrome.i18n.getMessage("icon")}
                    class="h-10 w-10"
                    value={pageIconValue()}
                    onInput={(e) => setPageIconValue(e.currentTarget.value)}
                  />
                  <TextField
                    placeholder={chrome.i18n.getMessage("new_tab")}
                    class="h-10"
                    value={pageTitleValue()}
                    onInput={(e) => setPageTitleValue(e.currentTarget.value)}
                  />
                </TextFieldRoot>
                <Button
                  onClick={() => {
                    setPageTitle(pageTitleValue());
                    setPageIcon(pageIconValue());
                    setPageIconURL(textToImage(pageIconValue()));
                  }}
                  disabled={
                    pageTitle() == pageTitleValue() &&
                    pageIcon() == pageIconValue()
                  }
                >
                  {pageTitle() == pageTitleValue() &&
                    pageIcon() == pageIconValue()
                    ? chrome.i18n.getMessage("saved")
                    : chrome.i18n.getMessage("save")}
                </Button>
              </div>
              <br />
              <br />
              <h2 class="mb-3 text-2xl font-[500]">
                {chrome.i18n.getMessage("more")}
              </h2>
              <div class="flex gap-2">
                <a
                  href="https://github.com/thingbomb/flowtide/discussions"
                  class="text-blue-400 hover:underline"
                >
                  {chrome.i18n.getMessage("forum")}
                </a>
                •
                <a
                  href="https://feedback.flowtide.app/feature-requests"
                  class="text-blue-400 hover:underline"
                >
                  {chrome.i18n.getMessage("feature_request")}
                </a>
              </div>
            </>
          )}
          {settingsMenu() === "appearance" && (
            <>
              <h3 class="text-2xl font-[500]">
                {chrome.i18n.getMessage("font")}
              </h3>
              <div class="card-group grid-cols-2 grid-rows-2">
                <BigButton
                  {...(font() === "sans" ? { "data-selected": true } : {})}
                  onClick={() => {
                    setFont("sans");
                  }}
                  title={chrome.i18n.getMessage("sans")}
                  icon={<span class="!font-sans !text-5xl font-bold">Aa</span>}
                />
                <BigButton
                  {...(font() === "serif" ? { "data-selected": true } : {})}
                  onClick={() => {
                    setFont("serif");
                  }}
                  title={chrome.i18n.getMessage("serif")}
                  icon={<span class="!font-serif !text-5xl font-bold">Aa</span>}
                />
                <BigButton
                  {...(font() === "mono" ? { "data-selected": true } : {})}
                  onClick={() => {
                    setFont("mono");
                  }}
                  title={chrome.i18n.getMessage("mono")}
                  icon={<span class="!font-mono !text-5xl font-bold">Aa</span>}
                />
                <BigButton
                  {...(font() === "comic-sans"
                    ? { "data-selected": true }
                    : {})}
                  onClick={() => {
                    setFont("comic-sans");
                  }}
                  title={chrome.i18n.getMessage("comic_sans")}
                  icon={
                    <span class="!font-comic-sans !text-5xl font-bold">Aa</span>
                  }
                />
              </div>
              <br />
              <br />
              <h3 class="text-2xl font-[500]">
                {chrome.i18n.getMessage("theme")}
              </h3>
              <div class="card-group grid-cols-2 grid-rows-1">
                <BigButton
                  {...(theme() === "light" ? { "data-selected": true } : {})}
                  onClick={() => {
                    setTheme("light");
                    document.documentElement.setAttribute(
                      "data-kb-theme",
                      "light"
                    );
                    document.documentElement.style.colorScheme = "light";
                  }}
                  title={chrome.i18n.getMessage("light")}
                  icon={<Moon class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(theme() === "dark" ? { "data-selected": true } : {})}
                  onClick={() => {
                    setTheme("dark");
                    document.documentElement.setAttribute(
                      "data-kb-theme",
                      "dark"
                    );
                    document.documentElement.style.colorScheme = "dark";
                  }}
                  title={chrome.i18n.getMessage("dark")}
                  icon={<Moon class="size-[64px]" fill="currentColor" />}
                />
              </div>
              <br />
              <br />
              <h3 class="text-2xl font-[500]">
                {chrome.i18n.getMessage("text_style")}
              </h3>
              <div class="card-group grid-cols-3 grid-rows-1">
                <BigButton
                  {...(textStyle() === "uppercase"
                    ? { "data-selected": true }
                    : {})}
                  onClick={() => {
                    setTextStyle("uppercase");
                  }}
                  title={chrome.i18n.getMessage("uppercase")}
                  icon={<span class="!text-5xl font-bold !uppercase">AA</span>}
                />
                <BigButton
                  {...(textStyle() === "normal"
                    ? { "data-selected": true }
                    : {})}
                  onClick={() => {
                    setTextStyle("normal");
                  }}
                  title={chrome.i18n.getMessage("normal")}
                  icon={
                    <span class="!text-5xl font-bold !normal-case">Aa</span>
                  }
                />
                <BigButton
                  {...(textStyle() === "lowercase"
                    ? { "data-selected": true }
                    : {})}
                  onClick={() => {
                    setTextStyle("lowercase");
                  }}
                  title={chrome.i18n.getMessage("lowercase")}
                  icon={<span class="!text-5xl font-bold !lowercase">aa</span>}
                />
              </div>
              <br />
              <br />
              <h3 class="text-2xl font-[500]">
                {chrome.i18n.getMessage("clock_format")}
              </h3>
              <div class="card-group grid-cols-2 grid-rows-1">
                <BigButton
                  {...(clockFormat() === "12h"
                    ? { "data-selected": true }
                    : {})}
                  onClick={() => {
                    setClockFormat("12h");
                  }}
                  icon={<span class="!text-5xl font-bold">12h</span>}
                />
                <BigButton
                  {...(clockFormat() === "24h"
                    ? { "data-selected": true }
                    : {})}
                  onClick={() => {
                    setClockFormat("24h");
                  }}
                  icon={<span class="!text-5xl font-bold">24h</span>}
                />
              </div>
            </>
          )}
          {settingsMenu() === "background" && (
            <>
              <h3 class="text-2xl font-[500]">
                {chrome.i18n.getMessage("background")}
              </h3>
              <div class="card-group grid-cols-2 grid-rows-1">
                <BigButton
                  {...(background() === "image"
                    ? { "data-selected": true }
                    : {})}
                  onClick={() => {
                    setBackground("image");
                  }}
                  title={chrome.i18n.getMessage("image")}
                  icon={<Image class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "solid-color"
                    ? { "data-selected": true }
                    : {})}
                  onClick={() => {
                    setBackground("solid-color");
                  }}
                  title={chrome.i18n.getMessage("solid_color")}
                  icon={<PaintBucket class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "gradient"
                    ? { "data-selected": true }
                    : {})}
                  onClick={() => {
                    setBackground("gradient");
                  }}
                  title={chrome.i18n.getMessage("gradient")}
                  icon={<Sunrise class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "blank"
                    ? { "data-selected": true }
                    : {})}
                  onClick={() => {
                    setBackground("blank");
                  }}
                  title={chrome.i18n.getMessage("blank")}
                  icon={<Square class="size-[64px]" fill="none" />}
                />
              </div>
              <br />
              <br />
              <h2 class="mb-3 text-2xl font-[500]">
                {chrome.i18n.getMessage("new_wallpaper")}
              </h2>
              <div class="card-group grid-cols-2 grid-rows-1">
                <BigButton
                  {...(Number(wallpaperChangeTime()) === 1
                    ? { "data-selected": true }
                    : {})}
                  onClick={() => {
                    localStorage.removeItem("selectedImage");
                    setWallpaperChangeTime(1);
                  }}
                  title={chrome.i18n.getMessage("every_reload")}
                  icon={<RefreshCcw class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(Number(wallpaperChangeTime()) === 1000 * 60 * 60
                    ? { "data-selected": true }
                    : {})}
                  onClick={() => {
                    localStorage.removeItem("selectedImage");
                    setWallpaperChangeTime(1000 * 60 * 60);
                  }}
                  title={chrome.i18n.getMessage("every_hour")}
                  icon={<Hourglass class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(Number(wallpaperChangeTime()) === 1000 * 60 * 60 * 24
                    ? { "data-selected": true }
                    : {})}
                  onClick={() => {
                    localStorage.removeItem("selectedImage");
                    setWallpaperChangeTime(1000 * 60 * 60 * 24);
                  }}
                  title={chrome.i18n.getMessage("every_day")}
                  icon={<Calendar1 class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(Number(wallpaperChangeTime()) === 1000 * 60 * 60 * 24 * 7
                    ? { "data-selected": true }
                    : {})}
                  onClick={() => {
                    localStorage.removeItem("selectedImage");
                    setWallpaperChangeTime(1000 * 60 * 60 * 24 * 7);
                  }}
                  title={chrome.i18n.getMessage("every_week")}
                  icon={<Calendar class="size-[64px]" fill="none" />}
                />
              </div>
              <br />
              <br />
              <h2 class="mb-3 text-2xl font-[500]">
                {chrome.i18n.getMessage("opacity")}
              </h2>
              <div class="flex items-start gap-2">
                <input
                  type="range"
                  class="h-2 w-full appearance-none rounded-lg bg-zinc-100 dark:bg-zinc-600"
                  value={Number(opacity()) * 100}
                  onInput={(e) =>
                    setOpacity(Number(e.currentTarget.value) / 100)
                  }
                />
              </div>
              <br />
              <br />
              <h2 class="mb-3 text-2xl font-[500]">
                {chrome.i18n.getMessage("wallpaper_blur")}
              </h2>
              <div class="flex items-start gap-2">
                <input
                  type="range"
                  class="h-2 w-full appearance-none rounded-lg bg-zinc-100 dark:bg-zinc-600"
                  value={Number(wallpaperBlur() * 2.5)}
                  onInput={(e) =>
                    setWallpaperBlur(Number(e.currentTarget.value) / 2.5)
                  }
                />
              </div>
            </>
          )}
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
    <div class={cn("h-[20px]", className)}>
      <button
        class={cn("group", triggerClass)}
        onclick={() => setOpen(true)}
        aria-haspopup="true"
      >
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
