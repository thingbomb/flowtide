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

  const [open, setOpen] = createSignal(true);
  const [font, setFont] = createStoredSignal("font", "sans");
  const [theme, setTheme] = createStoredSignal("kb-color-mode", "system");
  const [background, setBackground] = createStoredSignal("background", "image");
  const [layout, setLayout] = createStoredSignal("layout", "center");
  const [name, setName] = createStoredSignal("name", "");
  const [mode, setMode] = createStoredSignal("mode", "widgets");
  const [greetingNameValue, setGreetingNameValue] = createSignal(name());
  const [pageTitle, setPageTitle] = createStoredSignal("pageTitle", "");
  const [pageTitleValue, setPageTitleValue] = createSignal(pageTitle());
  const [pageIcon, setPageIcon] = createStoredSignal("pageIcon", "");
  const [pageIconValue, setPageIconValue] = createSignal(pageIcon());
  const [opacity, setOpacity] = createStoredSignal<number>("opacity", 0.8);
  const [wallpaperBlur, setWallpaperBlur] = createStoredSignal<number>(
    "wallpaperBlur",
    0
  );
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
      <div class="text-foreground bg-background fixed inset-0 z-10 flex justify-center overflow-y-auto">
        <div class="h-full w-full max-w-lg py-20">
          <h1 class="text-5xl font-bold">
            {chrome.i18n.getMessage("settings")}
          </h1>
          <br />
          <br />
          <h3 class="text-2xl font-[500]">{chrome.i18n.getMessage("mode")}</h3>
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
              {...(mode() === "nightstand" ? { "data-selected": true } : {})}
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
                  {...(layout() === "center" ? { "data-selected": true } : {})}
                  onClick={() => {
                    setLayout("center");
                  }}
                  title={chrome.i18n.getMessage("center")}
                  icon={<AlignCenter class="size-[64px]" fill="currentColor" />}
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
              <br />
              <br />
            </div>
          )}
          <h3 class="text-2xl font-[500]">{chrome.i18n.getMessage("font")}</h3>
          <div class="card-group grid-cols-3 grid-rows-1">
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
          </div>
          <br />
          <br />
          <h3 class="text-2xl font-[500]">{chrome.i18n.getMessage("theme")}</h3>
          <div class="card-group grid-cols-2 grid-rows-1">
            <BigButton
              {...(theme() === "light" ? { "data-selected": true } : {})}
              onClick={() => {
                setTheme("light");
                document.documentElement.setAttribute("data-kb-theme", "light");
                document.documentElement.style.colorScheme = "light";
              }}
              title={chrome.i18n.getMessage("light")}
              icon={<Moon class="size-[64px]" fill="none" />}
            />
            <BigButton
              {...(theme() === "dark" ? { "data-selected": true } : {})}
              onClick={() => {
                setTheme("dark");
                document.documentElement.setAttribute("data-kb-theme", "dark");
                document.documentElement.style.colorScheme = "dark";
              }}
              title={chrome.i18n.getMessage("dark")}
              icon={<Moon class="size-[64px]" fill="currentColor" />}
            />
          </div>
          <br />
          <br />
          <h3 class="text-2xl font-[500]">
            {chrome.i18n.getMessage("background")}
          </h3>
          <div class="card-group grid-cols-2 grid-rows-1">
            <BigButton
              {...(background() === "image" ? { "data-selected": true } : {})}
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
              {...(background() === "blank" ? { "data-selected": true } : {})}
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
            {chrome.i18n.getMessage("opacity")}
          </h2>
          <div class="flex items-start gap-2">
            <input
              type="range"
              class="h-2 w-full appearance-none rounded-lg bg-zinc-100 dark:bg-zinc-600"
              value={Number(opacity()) * 100}
              onInput={(e) => setOpacity(Number(e.currentTarget.value) / 100)}
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
              value={Number(wallpaperBlur() * 2)}
              onInput={(e) =>
                setWallpaperBlur(Number(e.currentTarget.value) / 2)
              }
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
              {...(textStyle() === "normal" ? { "data-selected": true } : {})}
              onClick={() => {
                setTextStyle("normal");
              }}
              title={chrome.i18n.getMessage("normal")}
              icon={<span class="!text-5xl font-bold !normal-case">Aa</span>}
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
            {chrome.i18n.getMessage("page")}
          </h2>
          <div class="flex items-start gap-2">
            <TextFieldRoot class="flex flex-1 gap-2">
              <TextField
                placeholder="Icon"
                class="h-10 w-10"
                value={pageIconValue()}
                onInput={(e) => setPageIconValue(e.currentTarget.value)}
              />
              <TextField
                placeholder="New Tab"
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
                pageTitle() == pageTitleValue() && pageIcon() == pageIconValue()
              }
            >
              {pageTitle() == pageTitleValue() && pageIcon() == pageIconValue()
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
              Forum
            </a>
            •
            <a
              href="https://feedback.flowtide.app/feature-requests"
              class="text-blue-400 hover:underline"
            >
              Feature request
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
