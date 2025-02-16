import {
  AlignVerticalJustifyStart,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  Bookmark,
  Calendar,
  Calendar1,
  Check,
  Clock,
  Dot,
  File,
  Grid,
  Hammer,
  Home,
  Hourglass,
  Image,
  Link,
  Notebook,
  PaintBucket,
  Palette,
  Plus,
  Quote,
  RefreshCcw,
  Settings,
  Square,
  Sun,
  Sunrise,
  Timer,
  Volume2,
} from "lucide-solid";
import { createSignal, onMount, Show, untrack } from "solid-js";
import { createStoredSignal } from "./hooks/localStorage";
import { cn } from "./libs/cn";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "./components/ui/textfield";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { actuallyBoolean } from "./libs/boolean";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemLabel,
} from "./components/ui/radio-group";
import {
  Switch,
  SwitchControl,
  SwitchLabel,
  SwitchThumb,
} from "./components/ui/switch";
import { updateWeatherManually } from "./hooks/weather";

interface PomodoroConfig {
  workMinutes: number;
  breakMinutes: number;
}

function BigButton(props: any) {
  return (
    <button class="card-style" {...props}>
      <div class="icon">{props.icon}</div>
      <span class="text-xl">{props.title}</span>
    </button>
  );
}

interface BookmarkTreeNode {
  children?: BookmarkTreeNode[];
  dateAdded?: number;
  dateGroupModified?: number;
  id: string;
  index?: number;
  parentId?: string;
  title: string;
  unmodifiable?: "managed";
  url?: string;
}

type Bookmark = {
  name: string;
  url: string;
};

function injectUserCSS(css: string) {
  document.getElementById("user-css")?.remove();
  const style = document.createElement("style");
  style.setAttribute("id", "user-css");
  style.innerHTML = `${css}`;
  document.head.appendChild(style);
}

function safeParse<T>(data: any, fallback: T): T {
  try {
    const parsed = JSON.parse(data);
    console.log(parsed);
    return parsed;
  } catch {
    return fallback;
  }
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
  const [squareWidgets, setSquareWidgets] = createStoredSignal(
    "squareWidgets",
    false
  );
  const [name, setName] = createStoredSignal("name", "");
  const [greetingNameValue, setGreetingNameValue] = createSignal(name());
  const [pageTitle, setPageTitle] = createStoredSignal("pageTitle", "");
  const [pageTitleValue, setPageTitleValue] = createSignal(pageTitle());
  const [pageIcon, setPageIcon] = createStoredSignal("pageIcon", "");
  const [color, setColor] = createStoredSignal("color", "unset");
  const [pageIconValue, setPageIconValue] = createSignal(pageIcon());
  const [opacity, setOpacity] = createStoredSignal<number>("opacity", 0.8);
  const [settingsMenu, setSettingsMenu] = createSignal<string>("general");
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [imperial, setImperial] = createStoredSignal("imperial", false);
  const [city, setCity] = createStoredSignal("locationCity", "");
  const [bookmarksShown, setBookmarksShown] = createStoredSignal<
    Array<Bookmark> | string
  >("bookmarksShown", []);
  const [clearDataDialogOpen, setClearDataDialogOpen] = createSignal(false);
  const [pomodoroConfig, setPomodoroConfig] = createStoredSignal<
    Function | PomodoroConfig | string
  >("pomodoroConfig", {
    workMinutes: 25,
    breakMinutes: 5,
  });
  const [location, setLocation] = createStoredSignal<Array<any>>("location", [
    null,
    null,
  ]);
  const [latitudeInput, setLatitudeInput] = createSignal("");
  const [longitudeInput, setLongitudeInput] = createSignal("");
  const [locationCityValue, setLocationCityValue] = createSignal(city());
  const [hideSettings, setHideSettings] = createStoredSignal(
    "hideSettings",
    false
  );
  const [weatherEnabled, setWeatherEnabled] = createStoredSignal(
    "weatherEnabled",
    false
  );
  const [dateContained, setDateContained] = createStoredSignal(
    "dateContained",
    false
  );
  const [counterContained, setCounterContained] = createStoredSignal(
    "counterContained",
    false
  );
  const [notepadContained, setNotepadContained] = createStoredSignal(
    "notepadContained",
    false
  );
  const [stopwatchContained, setStopwatchContained] = createStoredSignal(
    "stopwatchContained",
    false
  );
  const [mantrasContained, setMantrasContained] = createStoredSignal(
    "mantrasContained",
    true
  );
  const [bookmarksContained, setBookmarksContained] = createStoredSignal(
    "bookmarksContained",
    true
  );
  const [bookmarks, setBookmarks] = createSignal<Bookmark[]>([]);
  const [natureSounds, setNatureSounds] = createStoredSignal(
    "natureSounds",
    false
  );
  const [focusSounds, setFocusSounds] = createStoredSignal(
    "focusSounds",
    false
  );
  const [todosContained, setTodosContained] = createStoredSignal(
    "todosContained",
    true
  );
  const [ambienceSounds, setAmbienceSounds] = createStoredSignal(
    "ambienceSounds",
    false
  );
  const [pomodoroContained, setPomodoroContained] = createStoredSignal(
    "pomodoroContained",
    false
  );
  const [userCSS, setUserCSS] = createStoredSignal("userCSS", "");
  const [wallpaperBlur, setWallpaperBlur] = createStoredSignal<number>(
    "wallpaperBlur",
    0
  );
  const [localFileImage, setLocalFileImage] = createStoredSignal(
    "localFile",
    ""
  );
  const [dateFormat, setDateFormat] = createStoredSignal(
    "dateFormat",
    "normal"
  );
  const [customUrl, setCustomUrl] = createStoredSignal("customUrl", "");
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
          "text-foreground flex flex-col sm:flex-row absolute inset-0 overflow-auto p-0",
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
          class="sm:max-w-50 p-6 sticky top-0 flex h-[140px] w-full max-w-full flex-col gap-2
            sm:h-full overflow-y-auto scrollbar-track-transparent pr-3"
        >
          <h2 class="text-lg font-[600] mb-2 pl-4">
            {chrome.i18n.getMessage("settings")}
          </h2>
          <button
            class="flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10"
            {...(settingsMenu() == "general"
              ? { "data-selected": "true" }
              : "")}
            id="generalButton"
            onmousedown={() => {
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
            onmousedown={() => {
              setSettingsMenu("appearance");
            }}
            id="appearanceButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
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
            onmousedown={() => {
              setSettingsMenu("background");
            }}
            id="backgroundButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Image
              height={20}
              class="size-6 rounded-lg bg-teal-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("background")}
          </button>

          <button
            {...(settingsMenu() == "advanced"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("advanced");
            }}
            id="advancedButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Hammer
              height={20}
              class="size-6 rounded-lg bg-gray-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("advanced")}
          </button>
          <br />
          <button
            {...(settingsMenu() == "todos" ? { "data-selected": "true" } : "")}
            onmousedown={() => {
              setSettingsMenu("todos");
            }}
            id="todosButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Check
              height={20}
              class="size-6 rounded-lg bg-teal-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("tasks")}
          </button>
          <button
            {...(settingsMenu() == "weather"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("weather");
            }}
            id="weatherButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Sun
              height={20}
              class="size-6 rounded-lg bg-orange-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("weather")}
          </button>
          <button
            {...(settingsMenu() == "notepad"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("notepad");
            }}
            id="notepadButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Notebook
              height={20}
              class="size-6 rounded-lg bg-white p-0.5 text-black"
            />
            {chrome.i18n.getMessage("notepad")}
          </button>
          <button
            {...(settingsMenu() == "date" ? { "data-selected": "true" } : "")}
            onmousedown={() => {
              setSettingsMenu("date");
            }}
            id="dateButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Calendar
              height={20}
              class="size-6 rounded-lg bg-amber-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("date")}
          </button>
          <button
            {...(settingsMenu() == "bookmarks"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("bookmarks");
            }}
            id="bookmarksButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Bookmark
              height={20}
              class="size-6 rounded-lg bg-purple-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("bookmarks")}
          </button>
          <button
            {...(settingsMenu() == "counter"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("counter");
            }}
            id="counterButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Plus
              height={20}
              class="size-6 rounded-lg bg-cyan-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("counter")}
          </button>
          <button
            {...(settingsMenu() == "stopwatch"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("stopwatch");
            }}
            id="stopwatchButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Timer
              height={20}
              class="size-6 rounded-lg bg-orange-500 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("stopwatch")}
          </button>
          <button
            {...(settingsMenu() == "pomodoro"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("pomodoro");
            }}
            id="pomodoroButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Clock
              height={20}
              class="size-6 rounded-lg bg-blue-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("pomodoro")}
          </button>
          <button
            {...(settingsMenu() == "soundscapes"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("soundscapes");
            }}
            id="soundscapesButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Volume2
              height={20}
              class="size-6 rounded-lg bg-zinc-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("soundscapes")}
          </button>
          <button
            {...(settingsMenu() == "mantras"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("mantras");
            }}
            id="mantrasButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Quote
              height={20}
              class="size-6 rounded-lg bg-orange-900 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("mantras")}
          </button>
        </div>
        <div class="h-full w-full overflow-y-auto p-10 pt-6 pr-10">
          {settingsMenu() === "general" && (
            <>
              <div>
                <h3 class="text-lg font-[600]">
                  {chrome.i18n.getMessage("layout")}
                </h3>
                <div class="card-group grid-cols-3 grid-rows-2">
                  <BigButton
                    {...(layout() === "top-left"
                      ? { "data-selected": true }
                      : {})}
                    onmousedown={() => {
                      setLayout("top-left");
                    }}
                    title={chrome.i18n.getMessage("top_left")}
                    icon={
                      <ArrowUpLeft class="size-[64px]" fill="currentColor" />
                    }
                  />
                  <BigButton
                    {...(layout() === "top" ? { "data-selected": true } : {})}
                    onmousedown={() => {
                      setLayout("top");
                    }}
                    title={chrome.i18n.getMessage("top")}
                    icon={<ArrowUp class="size-[64px]" fill="currentColor" />}
                  />
                  <BigButton
                    {...(layout() === "top-right"
                      ? { "data-selected": true }
                      : {})}
                    onmousedown={() => {
                      setLayout("top-right");
                    }}
                    title={chrome.i18n.getMessage("top_right")}
                    icon={
                      <ArrowUpRight class="size-[64px]" fill="currentColor" />
                    }
                  />
                  <BigButton
                    {...(layout() === "bottom-left"
                      ? { "data-selected": true }
                      : {})}
                    onmousedown={() => {
                      setLayout("bottom-left");
                    }}
                    title={chrome.i18n.getMessage("bottom_left")}
                    icon={
                      <ArrowDownLeft class="size-[64px]" fill="currentColor" />
                    }
                  />
                  <BigButton
                    {...(layout() === "center"
                      ? { "data-selected": true }
                      : {})}
                    onmousedown={() => {
                      setLayout("center");
                    }}
                    title={chrome.i18n.getMessage("center")}
                    icon={<Dot class="size-[64px]" fill="currentColor" />}
                  />
                  <BigButton
                    {...(layout() === "bottom-right"
                      ? { "data-selected": true }
                      : {})}
                    onmousedown={() => {
                      setLayout("bottom-right");
                    }}
                    title={chrome.i18n.getMessage("bottom_right")}
                    icon={
                      <ArrowDownRight class="size-[64px]" fill="currentColor" />
                    }
                  />
                </div>
              </div>
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("greeting")}
              </h3>
              <div class="flex max-w-full items-start gap-2">
                <TextFieldRoot class="flex-1 w-full">
                  <TextField
                    placeholder={chrome.i18n.getMessage("enter_greeting")}
                    value={greetingNameValue()}
                    class="w-full h-[30.6px] text-sm"
                    onInput={(e: InputEvent) =>
                      setGreetingNameValue(
                        (e.currentTarget as HTMLInputElement)?.value
                      )
                    }
                  />
                  <br />
                  <span class="text-muted-foreground text-sm">
                    {chrome.i18n.getMessage("leave_blank_to_disable")}
                  </span>
                </TextFieldRoot>
                <Button
                  onmousedown={() => setName(greetingNameValue())}
                  disabled={name() == greetingNameValue()}
                >
                  {name() == greetingNameValue()
                    ? chrome.i18n.getMessage("saved")
                    : chrome.i18n.getMessage("set_greeting")}
                </Button>
              </div>
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("page")}
              </h3>
              <div class="flex items-start gap-2">
                <TextFieldRoot class="flex flex-1 gap-2 w-full">
                  <TextField
                    placeholder={chrome.i18n.getMessage("icon")}
                    class="w-10 h-[30.6px] text-sm"
                    value={pageIconValue()}
                    onInput={(e: InputEvent) =>
                      setPageIconValue(
                        (e.currentTarget as HTMLInputElement)?.value
                      )
                    }
                  />
                  <TextField
                    placeholder={chrome.i18n.getMessage("new_tab")}
                    class="flex-1 h-[30.6px] text-sm"
                    value={pageTitleValue()}
                    onInput={(e: InputEvent) =>
                      setPageTitleValue(
                        (e.currentTarget as HTMLInputElement)?.value
                      )
                    }
                  />
                </TextFieldRoot>
                <Button
                  onmousedown={() => {
                    setPageTitle(pageTitleValue());
                    setPageIcon(pageIconValue());
                    setPageIconURL(
                      pageIconValue() == ""
                        ? "assets/logo.png"
                        : textToImage(pageIconValue())
                    );
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
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("more")}
              </h3>
              <div class="flex gap-2">
                <a
                  href="https://discord.gg/hhPuurkvua"
                  class="text-gray-800 dark:text-white"
                >
                  Discord
                </a>
                •
                <a
                  href="https://github.com/thingbomb/flowtide/discussions"
                  class="text-gray-800 dark:text-white"
                >
                  {chrome.i18n.getMessage("forum")}
                </a>
                •
                <a
                  href="https://feedback.flowtide.app/feature-requests"
                  class="text-gray-800 dark:text-white"
                >
                  {chrome.i18n.getMessage("feature_request")}
                </a>
              </div>
            </>
          )}
          {settingsMenu() === "appearance" && (
            <>
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("font")}
              </h3>
              <div class="card-group grid-cols-2 grid-rows-2">
                <BigButton
                  {...(font() === "sans" ? { "data-selected": true } : {})}
                  onmousedown={() => {
                    setFont("sans");
                  }}
                  title={chrome.i18n.getMessage("sans")}
                  icon={<span class="!font-sans !text-5xl font-bold">Aa</span>}
                />
                <BigButton
                  {...(font() === "serif" ? { "data-selected": true } : {})}
                  onmousedown={() => {
                    setFont("serif");
                  }}
                  title={chrome.i18n.getMessage("serif")}
                  icon={<span class="!font-serif !text-5xl font-bold">Aa</span>}
                />
                <BigButton
                  {...(font() === "mono" ? { "data-selected": true } : {})}
                  onmousedown={() => {
                    setFont("mono");
                  }}
                  title={chrome.i18n.getMessage("mono")}
                  icon={<span class="!font-mono !text-5xl font-bold">Aa</span>}
                />
                <BigButton
                  {...(font() === "comic-sans"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
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
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("text_style")}
              </h3>
              <div class="card-group grid-cols-3 grid-rows-1">
                <BigButton
                  {...(textStyle() === "uppercase"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setTextStyle("uppercase");
                  }}
                  title={chrome.i18n.getMessage("uppercase")}
                  icon={<span class="!text-5xl font-bold !uppercase">AA</span>}
                />
                <BigButton
                  {...(textStyle() === "normal"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
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
                  onmousedown={() => {
                    setTextStyle("lowercase");
                  }}
                  title={chrome.i18n.getMessage("lowercase")}
                  icon={<span class="!text-5xl font-bold !lowercase">aa</span>}
                />
              </div>
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("clock_format")}
              </h3>
              <div class="card-group grid-cols-2 grid-rows-1">
                <BigButton
                  {...(clockFormat() === "12h"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setClockFormat("12h");
                  }}
                  icon={<span class="!text-5xl font-bold">12h</span>}
                />
                <BigButton
                  {...(clockFormat() === "24h"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setClockFormat("24h");
                  }}
                  icon={<span class="!text-5xl font-bold">24h</span>}
                />
              </div>
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("date_format")}
              </h3>
              <div class="card-group grid-cols-2 grid-rows-1">
                <BigButton
                  {...(dateFormat() === "normal"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setDateFormat("normal");
                  }}
                  icon={<span class="!text-5xl font-bold">Normal</span>}
                />
                <BigButton
                  {...(dateFormat() === "iso-8601"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setDateFormat("iso-8601");
                  }}
                  icon={<span class="!text-5xl font-bold">ISO-8601</span>}
                />
              </div>
              <br />
              <br />
              <h3 class="mb-2 text-lg font-[600]">
                {chrome.i18n.getMessage("square_widgets")}
              </h3>
              <div class="flex">
                <input
                  type="checkbox"
                  class="mt-0.5 shrink-0 rounded border-gray-200 text-blue-600 focus:ring-blue-500
                    disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700
                    dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500
                    dark:focus:ring-offset-gray-800"
                  id="sw-checked-checkbox"
                  onChange={(e) => setSquareWidgets(e.currentTarget.checked)}
                  checked={actuallyBoolean(squareWidgets())}
                />
                <label
                  for="sw-checked-checkbox"
                  class="ms-3 text-sm text-gray-800 dark:text-neutral-400"
                >
                  {chrome.i18n.getMessage("square_widgets_description")}
                </label>
              </div>
              <br />
              <br />
              <h3 class="mb-2 text-lg font-[600]">
                {chrome.i18n.getMessage("hide_settings")}
              </h3>
              <div class="flex">
                <input
                  type="checkbox"
                  class="mt-0.5 shrink-0 rounded border-gray-200 text-blue-600 focus:ring-blue-500
                    disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700
                    dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500
                    dark:focus:ring-offset-gray-800"
                  id="hs-checked-checkbox"
                  onChange={(e) => setHideSettings(e.currentTarget.checked)}
                  checked={hideSettings()}
                />
                <label
                  for="hs-checked-checkbox"
                  class="ms-3 text-sm text-gray-800 dark:text-neutral-400"
                >
                  {chrome.i18n.getMessage("hide_settings_description")}
                </label>
              </div>
            </>
          )}
          {settingsMenu() === "background" && (
            <>
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("background")}
              </h3>
              <div class="card-group grid-cols-2 grid-rows-1">
                <BigButton
                  {...(background() === "image"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("image");
                  }}
                  title={chrome.i18n.getMessage("image")}
                  icon={<Image class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "solid-color"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("solid-color");
                  }}
                  title={chrome.i18n.getMessage("solid_color")}
                  icon={<PaintBucket class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "gradient"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("gradient");
                  }}
                  title={chrome.i18n.getMessage("gradient")}
                  icon={<Sunrise class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "blank"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("blank");
                  }}
                  title={chrome.i18n.getMessage("blank")}
                  icon={<Square class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "custom-url"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("custom-url");
                  }}
                  title={chrome.i18n.getMessage("custom_url")}
                  icon={<Link class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "local-file"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("local-file");
                  }}
                  title={chrome.i18n.getMessage("local_file")}
                  icon={<File class="size-[64px]" fill="none" />}
                />
              </div>
              {background() === "custom-url" && (
                <>
                  <br />
                  <br />
                  <h3 class="text-lg font-[600]">
                    {chrome.i18n.getMessage("custom_url")}
                  </h3>
                  <TextFieldRoot class="flex-1">
                    <TextField
                      placeholder={chrome.i18n.getMessage("custom_url")}
                      value={customUrl()}
                      onInput={(e: InputEvent) =>
                        setCustomUrl(
                          (e.currentTarget as HTMLInputElement)?.value.trim()
                        )
                      }
                    />
                  </TextFieldRoot>
                </>
              )}
              {background() === "solid-color" && (
                <>
                  <br />
                  <br />
                  <h3 class="text-lg font-[600]">
                    {chrome.i18n.getMessage("custom_color")}
                  </h3>
                  <input
                    type="color"
                    class="block h-10 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1
                      disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700
                      dark:bg-neutral-900"
                    id="hs-color-input"
                    value={color()}
                    onInput={(e) => setColor(e.currentTarget.value)}
                    title="Choose your color"
                  />
                </>
              )}
              {background() === "local-file" && (
                <>
                  <br />
                  <br />
                  <h3 class="text-lg font-[600]">
                    {chrome.i18n.getMessage("local_file")}
                  </h3>
                  <form class="max-w-sm">
                    <label for="file-input" class="sr-only">
                      {chrome.i18n.getMessage("choose_file")}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      name="file-input"
                      id="file-input"
                      onChange={(e) => {
                        const files: FileList | null = e.target?.files;
                        if (files && files[0]) {
                          if (!files[0].type.startsWith("image/")) {
                            alert(chrome.i18n.getMessage("invalid_file_type"));
                            return;
                          }
                          const reader = new FileReader();

                          reader.onload = (e) => {
                            if (e.target && e.target.result) {
                              if (
                                e.target.result.toString().length >
                                2.5 * 1024 * 1024
                              ) {
                                alert(chrome.i18n.getMessage("file_too_large"));
                                return;
                              }
                              setLocalFileImage(e.target.result.toString());
                            }
                          };

                          reader.onerror = () => {
                            alert(chrome.i18n.getMessage("file_read_error"));
                          };

                          reader.readAsDataURL(files[0]);
                        }
                      }}
                      class="block w-full rounded-lg border-none bg-neutral-500 text-sm text-white
                        backdrop-blur-3xl file:me-4 file:border-0 file:bg-neutral-600 file:px-4
                        file:py-3 file:text-white focus:z-10 focus:border-blue-500 focus:ring-blue-500
                        disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700
                        dark:bg-black/5 dark:text-neutral-400 dark:file:bg-white/10
                        dark:file:text-neutral-400"
                    />
                  </form>
                </>
              )}
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("new_wallpaper")}
              </h3>
              <div class="card-group grid-cols-2 grid-rows-1">
                <BigButton
                  {...(Number(wallpaperChangeTime()) === 1
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
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
                  onmousedown={() => {
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
                  onmousedown={() => {
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
                  onmousedown={() => {
                    localStorage.removeItem("selectedImage");
                    setWallpaperChangeTime(1000 * 60 * 60 * 24 * 7);
                  }}
                  title={chrome.i18n.getMessage("every_week")}
                  icon={<Calendar class="size-[64px]" fill="none" />}
                />
              </div>
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("opacity")}
              </h3>
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
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("wallpaper_blur")}
              </h3>
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
          {settingsMenu() === "advanced" && (
            <>
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("custom_css")}
              </h3>
              <div class="flex gap-2 items-center">
                <textarea
                  class="mt-2 h-full w-full resize-none rounded-xl bg-black/10 p-3 text-sm text-white
                    shadow-inner shadow-white/10 outline-none backdrop-blur-2xl focus:ring-2"
                  value={userCSS()}
                  placeholder={chrome.i18n.getMessage("custom_css")}
                  onInput={(e) => {
                    setUserCSS(e.currentTarget.value);
                    injectUserCSS(e.currentTarget.value);
                  }}
                ></textarea>
              </div>
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("clear_data")}
              </h3>
              <Dialog
                open={clearDataDialogOpen()}
                onOpenChange={setClearDataDialogOpen}
              >
                <DialogTrigger
                  aria-label={chrome.i18n.getMessage("clear_data")}
                >
                  <Button>{chrome.i18n.getMessage("clear_data")}</Button>
                </DialogTrigger>
                <DialogContent class="h-fit w-80 overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {chrome.i18n.getMessage("clear_data")}
                    </DialogTitle>
                    <DialogDescription>
                      {chrome.i18n.getMessage("clear_data_description")}
                    </DialogDescription>
                  </DialogHeader>
                  <br />
                  <DialogFooter class="flex !justify-start mt-4">
                    <Button onClick={() => setClearDataDialogOpen(false)}>
                      {chrome.i18n.getMessage("cancel")}
                    </Button>
                    <Button
                      onClick={() => {
                        localStorage.clear();
                        if (chrome.storage) {
                          chrome.storage.local.clear();
                          chrome.storage.sync.clear();
                        }
                        window.location.reload();
                      }}
                    >
                      {chrome.i18n.getMessage("clear_data")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
          {settingsMenu() === "date" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("date")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={actuallyBoolean(dateContained())}
                onChange={(value: boolean) => {
                  setDateContained(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
            </>
          )}
          {settingsMenu() === "todos" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("tasks")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={actuallyBoolean(todosContained())}
                onChange={(value: boolean) => {
                  setTodosContained(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
            </>
          )}
          {settingsMenu() === "weather" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("weather")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={weatherEnabled()}
                onChange={(value: boolean) => {
                  setWeatherEnabled(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
              <Show when={weatherEnabled()}>
                <br />
                <p
                  innerHTML={chrome.i18n.getMessage("weatherDisclaimer", [
                    "https://open-meteo.com/en/docs",
                  ])}
                />
                <br />
                <h3 class="text-lg font-[600] mb-2">
                  {chrome.i18n.getMessage("location")}
                </h3>
                <TextFieldRoot class="flex-1">
                  <TextFieldLabel class="text-sm font-medium text-muted-foreground">
                    {chrome.i18n.getMessage("search")}
                  </TextFieldLabel>
                  <div class="flex items-center gap-2">
                    <TextField
                      placeholder={chrome.i18n.getMessage("location")}
                      value={locationCityValue()}
                      onInput={(e: InputEvent) =>
                        setLocationCityValue(
                          (e.currentTarget as HTMLInputElement)?.value
                        )
                      }
                    />
                    <Button
                      onClick={() => {
                        setLocationCityValue(locationCityValue());
                        fetch(
                          `https://geocoding-api.open-meteo.com/v1/search?name=${locationCityValue()}&count=10&language=en&format=json`
                        )
                          .then((response) => response.json())
                          .then((data) => {
                            if (data.results.length > 0) {
                              setLocationCityValue("");
                              setCity(data.results[0].name);
                              setLatitudeInput(data.results[0].latitude);
                              setLongitudeInput(data.results[0].longitude);
                              (document.getElementById(
                                "latitude-input"
                              ) as HTMLInputElement)!.value =
                                data.results[0].latitude;
                              (document.getElementById(
                                "longitude-input"
                              ) as HTMLInputElement)!.value =
                                data.results[0].longitude;
                              setLocation([
                                data.results[0].latitude,
                                data.results[0].longitude,
                              ]);
                              updateWeatherManually(
                                data.results[0].latitude,
                                data.results[0].longitude
                              );
                            }
                          });
                      }}
                    >
                      {chrome.i18n.getMessage("search")}
                    </Button>
                  </div>
                </TextFieldRoot>
                <br />
                <div class="flex flex-col">
                  <p class="text-sm font-medium text-muted-foreground">
                    {chrome.i18n.getMessage("coordinates")}
                  </p>
                  <div class="flex items-center gap-2">
                    <TextFieldRoot
                      class="flex-1"
                      defaultValue={safeParse(location(), location())[0]}
                    >
                      <TextField
                        placeholder={chrome.i18n.getMessage("latitude")}
                        onInput={(e: InputEvent) =>
                          setLatitudeInput(
                            (e.currentTarget as HTMLInputElement)?.value
                          )
                        }
                        id="latitude-input"
                      />
                    </TextFieldRoot>
                    <TextFieldRoot
                      class="flex-1"
                      defaultValue={safeParse(location(), location())[1]}
                    >
                      <TextField
                        placeholder={chrome.i18n.getMessage("longitude")}
                        onInput={(e: InputEvent) =>
                          setLongitudeInput(
                            (e.currentTarget as HTMLInputElement)?.value
                          )
                        }
                        id="longitude-input"
                      />
                    </TextFieldRoot>
                    <Button
                      onClick={() => {
                        setCity("");
                        setLocationCityValue("");
                        setLocation([
                          Number(latitudeInput()),
                          Number(longitudeInput()),
                        ]);
                        updateWeatherManually(
                          Number(latitudeInput()),
                          Number(longitudeInput())
                        );
                      }}
                    >
                      {chrome.i18n.getMessage("set")}
                    </Button>
                  </div>
                </div>
                <br />
                <h3 class="text-lg font-[600]">
                  {chrome.i18n.getMessage("unit")}
                </h3>
                <RadioGroup
                  defaultValue={imperial() ? "imperical" : "metric"}
                  onChange={(value: string) => {
                    setImperial(value === "imperical");
                  }}
                >
                  <RadioGroupItem
                    value="metric"
                    class="flex items-center gap-2"
                  >
                    <RadioGroupItemControl />
                    <RadioGroupItemLabel class="text-sm">
                      {chrome.i18n.getMessage("metric")}
                    </RadioGroupItemLabel>
                  </RadioGroupItem>
                  <RadioGroupItem
                    value="imperical"
                    class="flex items-center gap-2"
                  >
                    <RadioGroupItemControl />
                    <RadioGroupItemLabel class="text-sm">
                      {chrome.i18n.getMessage("imperial")}
                    </RadioGroupItemLabel>
                  </RadioGroupItem>
                </RadioGroup>
              </Show>
            </>
          )}
          {settingsMenu() === "bookmarks" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("bookmarks")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={actuallyBoolean(bookmarksContained())}
                onChange={(value: boolean) => {
                  setBookmarksContained(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
              <br />
              {bookmarksContained() && (
                <>
                  <span class="text-sm font-medium text-muted-foreground">
                    {chrome.i18n.getMessage("pinned_bookmarks")}
                  </span>
                  <div class="flex gap-2 flex-wrap">
                    {(
                      safeParse(
                        bookmarksShown(),
                        bookmarksShown()
                      ) as Array<Bookmark>
                    ).map((bookmark, index) => (
                      <button
                        onClick={() => {
                          const currentBookmarksShown = safeParse(
                            bookmarksShown(),
                            bookmarksShown()
                          ) as Array<Bookmark>;
                          if (
                            currentBookmarksShown.some(
                              (bookmarkShown: Bookmark) =>
                                bookmarkShown.url == bookmark.url
                            )
                          ) {
                            const newBookmarksShown =
                              currentBookmarksShown.filter(
                                (bookmarkShown: Bookmark) =>
                                  bookmarkShown.url != bookmark.url
                              );
                            setBookmarksShown(newBookmarksShown);
                          } else {
                            setBookmarksShown(
                              JSON.stringify([
                                ...currentBookmarksShown,
                                bookmark,
                              ])
                            );
                          }
                        }}
                        class="font-medium text-black rounded-lg dark:text-white text-sm p-4 bg-[#EDECEB]
                          border-1 border-[#C0C0B8] h-[30px] flex justify-center items-center gap-2
                          dark:bg-[#121314] dark:border-[#3F3F47]"
                      >
                        <span>{bookmark.name}</span>
                        <Check class="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                  <br />
                  <span class="text-sm font-medium text-muted-foreground">
                    {chrome.i18n.getMessage("available_bookmarks")}
                  </span>
                  <div class="flex gap-2 flex-wrap">
                    {bookmarks()
                      .filter((bookmark: Bookmark) => {
                        return !(
                          safeParse(
                            bookmarksShown(),
                            bookmarksShown()
                          ) as Array<Bookmark>
                        ).some(
                          (bookmarkShown: Bookmark) =>
                            bookmarkShown.url == bookmark.url
                        );
                      })
                      .map((bookmark, index) => (
                        <button
                          onClick={() => {
                            const currentBookmarksShown = safeParse(
                              bookmarksShown(),
                              bookmarksShown()
                            ) as Array<Bookmark>;
                            if (
                              currentBookmarksShown.some(
                                (bookmarkShown: Bookmark) =>
                                  bookmarkShown.url == bookmark.url
                              )
                            ) {
                              const newBookmarksShown =
                                currentBookmarksShown.filter(
                                  (bookmarkShown: Bookmark) =>
                                    bookmarkShown.url != bookmark.url
                                );
                              setBookmarksShown(
                                JSON.stringify(newBookmarksShown)
                              );
                            } else {
                              setBookmarksShown(
                                JSON.stringify([
                                  ...currentBookmarksShown,
                                  bookmark,
                                ])
                              );
                            }
                          }}
                          class="font-medium text-black rounded-lg dark:text-white text-sm p-4 bg-[#EDECEB]
                            border-1 border-[#C0C0B8] h-[30px] flex justify-center items-center gap-2
                            dark:bg-[#121314] dark:border-[#3F3F47]"
                        >
                          <span>{bookmark.name}</span>
                          <Plus class="h-4 w-4" />
                        </button>
                      ))}
                  </div>
                </>
              )}
            </>
          )}
          {settingsMenu() === "pomodoro" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("pomodoro")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={actuallyBoolean(pomodoroContained())}
                onChange={(value: boolean) => {
                  setPomodoroContained(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
              <br />
              {pomodoroContained() && (
                <div>
                  <TextFieldRoot class="mt-1 flex-1">
                    <span class="text-sm font-medium text-muted-foreground">
                      {chrome.i18n.getMessage("work_minutes")}
                    </span>
                    <br />
                    <TextField
                      placeholder={chrome.i18n.getMessage("work_minutes")}
                      value={
                        (typeof pomodoroConfig() === "object"
                          ? (pomodoroConfig as Function)().workMinutes
                          : pomodoroConfig()) as string
                      }
                      onInput={(e: InputEvent) => {
                        const newPomodoroConfig =
                          typeof pomodoroConfig() === "object"
                            ? JSON.parse(JSON.stringify(pomodoroConfig()))
                            : {};
                        newPomodoroConfig.workMinutes = Number(
                          (e.currentTarget as HTMLInputElement)?.value
                        );
                        setPomodoroConfig(newPomodoroConfig);
                      }}
                    />
                  </TextFieldRoot>
                  <br />
                  <TextFieldRoot class="mt-2 flex-1">
                    <span class="text-sm font-medium text-muted-foreground">
                      {chrome.i18n.getMessage("break_minutes")}
                    </span>
                    <br />
                    <TextField
                      placeholder={chrome.i18n.getMessage("break_minutes")}
                      value={
                        typeof pomodoroConfig() === "object"
                          ? (pomodoroConfig as Function)().breakMinutes
                          : pomodoroConfig()
                      }
                      onInput={(e: InputEvent) => {
                        const newPomodoroConfig =
                          typeof pomodoroConfig() === "object"
                            ? JSON.parse(JSON.stringify(pomodoroConfig()))
                            : {};
                        newPomodoroConfig.breakMinutes = Number(
                          (e.currentTarget as HTMLInputElement)?.value
                        );
                        setPomodoroConfig(newPomodoroConfig);
                      }}
                    />
                  </TextFieldRoot>
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {chrome.i18n.getMessage("you_may_need_to_refresh")}
                  </span>
                </div>
              )}
            </>
          )}
          {settingsMenu() === "soundscapes" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("soundscapes")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={natureSounds()}
                onChange={(value: boolean) => {
                  setNatureSounds(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("nature_sounds")}
                </SwitchLabel>
              </Switch>
              <br />
              <Switch
                class="flex items-center space-x-2"
                checked={focusSounds()}
                onChange={(value: boolean) => {
                  setFocusSounds(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("focus_sounds")}
                </SwitchLabel>
              </Switch>
              <br />
              <Switch
                class="flex items-center space-x-2"
                checked={ambienceSounds()}
                onChange={(value: boolean) => {
                  setAmbienceSounds(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("ambience_sounds")}
                </SwitchLabel>
              </Switch>
            </>
          )}
          {settingsMenu() === "mantras" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("mantras")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={actuallyBoolean(mantrasContained())}
                onChange={(value: boolean) => {
                  setMantrasContained(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
            </>
          )}
          {settingsMenu() === "stopwatch" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("stopwatch")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={actuallyBoolean(stopwatchContained())}
                onChange={(value: boolean) => {
                  setStopwatchContained(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
            </>
          )}
          {settingsMenu() === "counter" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("counter")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={actuallyBoolean(counterContained())}
                onChange={(value: boolean) => {
                  setCounterContained(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
            </>
          )}
          {settingsMenu() === "notepad" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("notepad")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={actuallyBoolean(notepadContained())}
                onChange={(value: boolean) => {
                  setNotepadContained(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
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

  onMount(() => {
    if (chrome.bookmarks !== undefined) {
      chrome.bookmarks.getTree((bookmarkTreeNodes: BookmarkTreeNode[]) => {
        const flattenBookmarks = (nodes: any[]): Bookmark[] => {
          let bookmarks: Bookmark[] = [];
          for (const node of nodes) {
            if (node.url) {
              bookmarks.push({ name: node.title, url: node.url });
            }
            if (node.children) {
              bookmarks = bookmarks.concat(flattenBookmarks(node.children));
            }
          }
          return bookmarks;
        };
        const allBookmarks = flattenBookmarks(bookmarkTreeNodes);
        setBookmarks(allBookmarks);
      });
    }
  });

  return (
    <Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
      <DialogTrigger
        id="settingsButton"
        class={triggerClass}
        aria-label={chrome.i18n.getMessage("add_widget")}
      >
        <Settings class="transition-transform" />
      </DialogTrigger>
      <DialogContent
        class={cn(
          "max-w-3xl overflow-hidden",
          textStyle() == "uppercase" ? "**:!uppercase" : "",
          textStyle() == "lowercase" ? "**:lowercase" : ""
        )}
      >
        <DialogHeader>
          <DialogTitle class="mb-4 pl-4 sr-only">
            {chrome.i18n.getMessage("settings")}
          </DialogTitle>
        </DialogHeader>
        <SettingsPage />
      </DialogContent>
    </Dialog>
  );
}

export { SettingsTrigger };
