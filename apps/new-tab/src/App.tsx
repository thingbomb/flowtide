import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import type { Component } from "solid-js";
import { Button } from "./components/ui/button";
import {
  ArrowRight,
  Bookmark,
  Check,
  Clock,
  Eye,
  EyeOff,
  Grid,
  GripVertical,
  Home,
  Minus,
  Pause,
  Play,
  Plus,
  Star,
  Volume2,
  X,
} from "lucide-solid";
import { createSwapy, Swapy } from "swapy";
import { v4 as uuidv4 } from "uuid";
import {
  AmbienceSoundscapes,
  BookmarksWidget,
  ClockWidget,
  CounterWidget,
  DateWidget,
  FocusSoundscapes,
  Mantras,
  NatureWidget,
  NotepadWidget,
  PomodoroWidget,
  StopwatchWidget,
  TodoPopover,
  TodoWidget,
} from "./Widgets";
import data from "../public/_locales/en/messages.json";
import images from "./images";
import { cn } from "./libs/cn";
import { SettingsTrigger } from "./Settings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { createStoredSignal } from "./hooks/localStorage";
import { TextField, TextFieldRoot } from "./components/ui/textfield";
import { CommandPalette } from "./components/ui/cmd";
import { formattedClock } from "./hooks/clockFormatter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { DropdownMenuSubTriggerProps } from "@kobalte/core/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { PopoverTriggerProps } from "@kobalte/core/popover";
import soundscapes, { Soundscape } from "./soundscapes";
import { actuallyBoolean } from "./libs/boolean";

type MessageKeys = keyof typeof data;

interface Data {
  [key: string]: { message: string };
}

const mantras = [
  "mantra_1",
  "mantra_2",
  "mantra_3",
  "mantra_4",
  "mantra_5",
  "mantra_6",
  "mantra_7",
  "mantra_8",
  "mantra_9",
  "mantra_10",
  "mantra_11",
  "mantra_12",
  "mantra_13",
  "mantra_14",
  "mantra_15",
];

declare global {
  interface Window {
    initSwapy: () => void;
    disableSwapy: () => void;
  }
}

try {
  chrome.i18n.getMessage("work");
} catch (error) {
  const jsonDataTyped = data as Data;
  window.chrome = {} as any;
  chrome.i18n = {
    getMessage: (message: MessageKeys) => {
      try {
        return jsonDataTyped[message]?.message || message;
      } catch (error) {
        console.log(message);
      }
    },
  } as any;
}

const colorPalette = [
  "#fb2c36",
  "#c27aff",
  "#0092b8",
  "#e60076",
  "#ff6900",
  "#053345",
  "#1e1a4d",
  "#861043",
  "#00d492",
  "#002c22",
];

interface Pomodoro {
  time: number;
  session: string;
  playing: boolean;
}

interface PomodoroConfig {
  workMinutes: number;
  breakMinutes: number;
}

const gradients = [
  "linear-gradient(to right, #2e3192, #1bffff)",
  "linear-gradient(to right, #d4145a, #fbb03b)",
  "linear-gradient(to right, #009245, #fcee21)",
  "linear-gradient(to right, #662d8c, #ed1e79)",
  "linear-gradient(to right, #ee9ca7, #ffdde1)",
  "linear-gradient(to right, #614385, #516395)",
  "linear-gradient(to right, #02aabd, #00cdac)",
  "linear-gradient(to right, #ff512f, #dd2476)",
  "linear-gradient(to right, #ff5f6d, #ffc371)",
  "linear-gradient(to right, #11998e, #38ef7d)",
  "linear-gradient(to right, #c6ea8d, #fe90af)",
  "linear-gradient(to right, #ea8d8d, #a890fe)",
  "linear-gradient(to right, #d8b5ff, #1eae98)",
  "linear-gradient(to right, #ff61d2, #fe9090)",
  "linear-gradient(to right, #bff098, #6fd6ff)",
  "linear-gradient(to right, #4e65ff, #92effd)",
  "linear-gradient(to right, #a9f1df, #ffbbbb)",
  "linear-gradient(to right, #c33764, #1d2671)",
  "linear-gradient(to right, #93a5cf, #e4efe9)",
  "linear-gradient(to right, #868f96, #596164)",
  "linear-gradient(to right, #09203f, #537895)",
  "linear-gradient(to right, #ffecd2, #fcb69f)",
  "linear-gradient(to right, #a1c4fd, #c2e9fb)",
  "linear-gradient(to right, #764ba2, #667eea)",
  "linear-gradient(to right, #fdfcfb, #e2d1c3)",
];

type Widget =
  | "clock"
  | "date"
  | "stopwatch"
  | "todo"
  | "bookmarks"
  | "nature"
  | "pomodoro"
  | "focus"
  | "ambience"
  | "notepad"
  | "counter"
  | "mantras";

type Bookmark = {
  name: string;
  url: string;
};

const App: Component = () => {
  const [needsOnboarding, setNeedsOnboarding] = createStoredSignal(
    "onboarding",
    false
  );
  const [onboardingScreen, setOnboardingScreen] = createSignal<number>(1);
  const [widgetOrder, setWidgetOrder] = createSignal<any[]>(
    localStorage.getItem("widgetPlacement")
      ? JSON.parse(localStorage.getItem("widgetPlacement") as string)
      : {
          clock: "clock",
          bookmarks: "bookmarks",
        }
  );
  const [greetingNameValue, setGreetingNameValue] = createSignal("");
  const [imageLoaded, setImageLoaded] = createSignal(false);
  const [filteredWidgets, setFilteredWidgets] = createSignal<any[]>([]);
  const [dialogOpen, setDialogOpen] = createSignal<boolean>(false);
  const [customUrl, setCustomUrl] = createStoredSignal("customUrl", "");
  const [hideSettings, setHideSettings] = createStoredSignal(
    "hideSettings",
    false
  );
  const [squareWidgets, setSquareWidgets] = createStoredSignal(
    "squareWidgets",
    false
  );
  const [currentlyPlaying, setCurrentlyPlaying] = createSignal<any>(null);
  const [pageIconURL, setPageIconURL] = createStoredSignal(
    "iconUrl",
    "assets/logo.png"
  );
  const [dateFormat, setDateFormat] = createStoredSignal(
    "dateFormat",
    "normal"
  );
  const [notepad, setNotepad] = createStoredSignal<string>("notepad", "");
  const [layout, setLayout] = createStoredSignal("layout", "center");
  const [currentFont, setCurrentFont] = createStoredSignal("font", "sans");
  const [background, setBackground] = createStoredSignal("background", "image");
  const [name, setName] = createStoredSignal("name", "");
  const [mode, setMode] = createStoredSignal("mode", "widgets");
  const [bookmarks, setBookmarks] = createSignal<any[]>([]);
  const [pageTitle, setPageTitle] = createStoredSignal("pageTitle", "");
  const [textStyle, setTextStyle] = createStoredSignal("textStyle", "normal");
  const [color, setColor] = createStoredSignal("color", "unset");
  const [opacity, setOpacity] = createStoredSignal("opacity", "0.8");
  const [wallpaperBlur, setWallpaperBlur] = createStoredSignal<number>(
    "wallpaperBlur",
    0
  );
  const [pomodoroContained, setPomodoroContained] = createSignal(false);
  const [pomodoroConfig, setPomodoroConfig] = createStoredSignal<
    Function | PomodoroConfig | string
  >("pomodoroConfig", {
    workMinutes: 25,
    breakMinutes: 5,
  });
  const [pomodoro, setPomodoro] = createSignal<Pomodoro>({
    time:
      typeof pomodoroConfig() === "object"
        ? (pomodoroConfig as Function)().workMinutes * 60
        : JSON.parse(pomodoroConfig() as string).workMinutes * 60,
    session: "Work",
    playing: false,
  });
  const [dateContained, setDateContained] = createSignal(false);
  const [counterContained, setCounterContained] = createSignal(false);
  const [notepadContained, setNotepadContained] = createSignal(false);
  const [stopwatchContained, setStopwatchContained] = createSignal(false);
  const [mantrasContained, setMantrasContained] = createSignal(false);
  const [bookmarksContained, setBookmarksContained] = createSignal(false);
  const [wallpaperChangeTime, setWallpaperChangeTime] =
    createStoredSignal<number>("wallpaperChangeTime", 1000 * 60 * 60 * 24 * 7);
  const clock = formattedClock();
  const [localFileImage, setLocalFileImage] = createStoredSignal(
    "localFile",
    ""
  );
  const [pomodoroDialogOpen, setPomodoroDialogOpen] = createSignal(false);
  function getInitialSelectedImage() {
    try {
      const storedItem = localStorage.getItem("selectedImage");
      if (storedItem) {
        const parsedItem = JSON.parse(storedItem);

        // ensure the parsed value is a valid object
        if (typeof parsedItem === "object" && parsedItem !== null) {
          return parsedItem;
        }
      }
    } catch (error) {
      localStorage.removeItem("selectedImage");
      let selectedImage = images[Math.floor(Math.random() * images.length)];
      return JSON.stringify({
        url: selectedImage.url,
        author: selectedImage.author,
        expiry: Date.now() + Number(wallpaperChangeTime()),
      });
    }

    let selectedImage = images[Math.floor(Math.random() * images.length)];

    return {
      url: selectedImage.url,
      author: selectedImage.author,
      expiry: Date.now() + Number(wallpaperChangeTime()),
    };
  }

  let swapy: Swapy;

  function initSwapy() {
    const container = document.querySelector(".widgets") as HTMLDivElement;

    swapy = createSwapy(container, {
      animation: "dynamic",
    });

    swapy.onSwap((event) => {
      localStorage.setItem(
        "widgetPlacement",
        JSON.stringify(event.newSlotItemMap.asObject)
      );
    });

    createEffect(() => {
      if (swapy && filteredWidgets() && widgets && widgetOrder()) {
        swapy.update();
      }
    });

    swapy.enable(true);
  }

  function disableSwapy() {
    if (swapy) {
      swapy.enable(false);
    }
  }

  window.initSwapy = initSwapy;
  window.disableSwapy = disableSwapy;

  const [selectedImage, setSelectedImage] = createStoredSignal<any>(
    "selectedImage",
    getInitialSelectedImage()
  );

  const [backgroundPaused, setBackgroundPaused] = createStoredSignal<string>(
    "backgroundPaused",
    "false"
  );
  const [itemsHidden, setItemsHidden] = createStoredSignal<string>(
    "itemsHidden",
    "false"
  );
  const [todosContained, setTodosContained] = createSignal(false);
  const [natureSounds, setNatureSounds] = createSignal(false);
  const [focusSounds, setFocusSounds] = createSignal(false);
  const [ambienceSounds, setAmbienceSounds] = createSignal(false);
  const [soundscapesEnabled, setSoundscapesEnabled] = createSignal(false);
  const [stopwatchTime, setStopwatchTime] = createSignal(0);
  const [stopwatchRunning, setStopwatchRunning] = createSignal(false);
  const [counter, setCounter] = createStoredSignal("counter", 0);

  function formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${Math.floor(
      Number(seconds.toString())
    )
      .toString()
      .padStart(2, "0")}`;
  }

  onMount(() => {
    if (chrome.bookmarks !== undefined) {
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
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

    setInterval(() => {
      if (stopwatchContained() && stopwatchRunning()) {
        setStopwatchTime(stopwatchTime() + 1);
      }
    }, 1000);

    setInterval(() => {
      if (pomodoro().playing) {
        if (pomodoro().time - 1 == 0) {
          let config =
            typeof pomodoroConfig() === "object"
              ? pomodoroConfig()
              : JSON.parse(pomodoroConfig() as string);
          setPomodoro({
            ...pomodoro(),
            session: pomodoro().session == "Work" ? "Break" : "Work",
            time:
              pomodoro().session == "Work"
                ? config.breakMinutes * 60
                : config.workMinutes * 60,
          });
        }
        setPomodoro({
          ...pomodoro(),
          time: pomodoro().time - 1,
        });
      }
    }, 1000);
  });
  createEffect(() => {
    if (pageTitle()) {
      document.title = pageTitle();
    }
  }, [pageTitle]);

  createEffect(() => {
    if (pomodoro().playing) {
      document.title = `${formatTime(pomodoro().time)} - ${
        pomodoro().session == "Work"
          ? chrome.i18n.getMessage("work")
          : chrome.i18n.getMessage("break")
      } - Flowtide`;
    } else {
      document.title = "New Tab";
    }
  }, [pomodoro]);

  createEffect(() => {
    if (Number(wallpaperBlur()) > 0) {
      if (document.getElementById("wallpaper") !== null) {
        document.getElementById("wallpaper")!.style.filter =
          `blur(${Number(wallpaperBlur()) / 10}px)`;
      }
    }
  }, [wallpaperBlur]);

  createEffect(() => {
    if (Number(opacity()) > 0) {
      if (document.getElementById("wallpaper") !== null) {
        document.getElementById("wallpaper")!.style.opacity = opacity();
      }
    }
  }, [opacity]);

  function updateContainsValues(order?: any) {
    const entries = Object.entries(order ? order : widgetOrder());
    setDateContained(entries.some(([key, value]) => value === "date"));
    setBookmarksContained(
      entries.some(([key, value]) => value === "bookmarks")
    );
    setNotepadContained(entries.some(([key, value]) => value === "notepad"));
    setPomodoroContained(!entries.some(([key, value]) => value === "pomodoro"));
    setMantrasContained(entries.some(([key, value]) => value === "mantras"));
    setStopwatchContained(
      entries.some(([key, value]) => value === "stopwatch")
    );
    setTodosContained(entries.some(([key, value]) => value === "todo"));
    setSoundscapesEnabled(
      entries.some(([key, value]) => value === "nature") ||
        entries.some(([key, value]) => value === "focus") ||
        entries.some(([key, value]) => value === "ambience")
    );
    setNatureSounds(entries.some(([key, value]) => value === "nature"));
    setFocusSounds(entries.some(([key, value]) => value === "focus"));
    setAmbienceSounds(entries.some(([key, value]) => value === "ambience"));
    setCounterContained(entries.some(([key, value]) => value === "counter"));
  }

  updateContainsValues();

  createEffect(() => {
    (document.getElementById("icon") as any).href = pageIconURL();
  }, [pageIconURL]);

  const OnboardingScreen1: Component = () => {
    return (
      <div class="fixed inset-0 flex flex-col items-center justify-center gap-6">
        <h1 class="text-7xl font-[600]">
          {chrome.i18n.getMessage("welcome_message")}
        </h1>
        <Button class="group" onmousedown={() => setOnboardingScreen(2)}>
          {chrome.i18n.getMessage("get_started")}
          <ArrowRight
            class="transition-transform group-hover:translate-x-1"
            height={16}
          />
        </Button>
      </div>
    );
  };
  const OnboardingScreen2: Component = () => {
    return (
      <div class="fixed inset-0 flex flex-col items-center justify-center gap-6">
        <div>
          <h1 class="mb-4 text-5xl font-[600]">
            {chrome.i18n.getMessage("greeting")}
          </h1>
          <TextFieldRoot class="flex-1">
            <TextField
              class="not-focus:border-zinc-400"
              placeholder={chrome.i18n.getMessage("enter_name")}
              value={greetingNameValue()}
              onInput={(e) => setGreetingNameValue(e.currentTarget.value)}
              onKeyDown={(e: KeyboardEvent) => {
                if (e.key === "Enter") {
                  setOnboardingScreen(3);
                  setName(greetingNameValue());
                }
              }}
            />
          </TextFieldRoot>
          <br />
          <Button
            class="group"
            onmousedown={() => {
              setOnboardingScreen(3);
              setName(greetingNameValue());
            }}
          >
            {greetingNameValue()
              ? chrome.i18n.getMessage("set_greeting")
              : chrome.i18n.getMessage("skip")}
            <ArrowRight
              class="transition-transform group-hover:translate-x-1"
              height={16}
            />
          </Button>
        </div>
      </div>
    );
  };
  const OnboardingScreen3: Component = () => {
    return (
      <div class="fixed inset-0 flex flex-col items-center justify-center gap-6">
        <div>
          <h1 class="mb-4 text-5xl font-[600]">
            {chrome.i18n.getMessage("choose_mode")}
          </h1>
          <div class="**:data-selected:!ring-primary grid w-[450px] grid-cols-2 grid-rows-2 gap-2">
            <button
              class="card not-prose group relative my-2 flex h-[78px] w-full cursor-pointer
                items-center gap-2 overflow-hidden rounded-xl bg-black/20 pl-8 text-left
                font-normal shadow-inner shadow-white/20 ring-2 ring-transparent
                backdrop-blur-3xl"
              {...(mode() === "widgets" ? { "data-selected": true } : {})}
              onmousedown={() => {
                setMode("widgets");
              }}
            >
              <Home class="size-[32px]" />
              <br />
              <span class="text-xl">{chrome.i18n.getMessage("default")}</span>
            </button>
            <button
              class="card not-prose group relative my-2 flex h-[78px] w-full cursor-pointer
                items-center gap-2 overflow-hidden rounded-xl bg-black/20 pl-8 text-left
                font-normal shadow-inner shadow-white/20 ring-2 ring-transparent
                backdrop-blur-3xl"
              {...(mode() === "dashboard" ? { "data-selected": true } : {})}
              onmousedown={() => {
                setMode("dashboard");
              }}
            >
              <Grid class="size-[32px]" />
              <br />
              <span class="text-xl">{chrome.i18n.getMessage("dashboard")}</span>
            </button>
            <button
              class="card not-prose group relative my-2 flex h-[78px] w-full cursor-pointer
                items-center gap-2 overflow-hidden rounded-xl bg-black/20 pl-8 text-left
                font-normal shadow-inner shadow-white/20 ring-2 ring-transparent
                backdrop-blur-3xl"
              {...(mode() === "nightstand" ? { "data-selected": true } : {})}
              onmousedown={() => {
                setMode("nightstand");
              }}
            >
              <Clock class="size-[32px]" />
              <br />
              <span class="text-xl">
                {chrome.i18n.getMessage("nightstand")}
              </span>
            </button>
            <button
              class="card not-prose group relative my-2 flex h-[78px] w-full cursor-pointer
                items-center gap-2 overflow-hidden rounded-xl bg-black/20 pl-8 text-left
                font-normal shadow-inner shadow-white/20 ring-2 ring-transparent
                backdrop-blur-3xl"
              {...(mode() === "speeddial" ? { "data-selected": true } : {})}
              onmousedown={() => {
                setMode("speeddial");
              }}
            >
              <Bookmark class="size-[32px]" />
              <br />
              <span class="text-xl">
                {chrome.i18n.getMessage("speed_dial")}
              </span>
            </button>
          </div>
          <br />
          <Button
            class="group"
            onmousedown={() => {
              setNeedsOnboarding(true);
              setName(greetingNameValue());
              if (mode() === "dashboard") {
                initSwapy();

                if (localStorage.getItem("widgetPlacement") === null) {
                  localStorage.setItem("widgetPlacement", JSON.stringify({}));
                }
              }
            }}
          >
            {chrome.i18n.getMessage("complete")}
            <ArrowRight
              class="transition-transform group-hover:translate-x-1"
              height={16}
            />
          </Button>
        </div>
      </div>
    );
  };

  const OnboardingFlow: Component = () => {
    return (
      <div
        class="absolute inset-0 z-50 bg-black/30 backdrop-blur-3xl"
        id="onboarding"
      >
        {onboardingScreen() === 1 && <OnboardingScreen1 />}
        {onboardingScreen() === 2 && <OnboardingScreen2 />}
        {onboardingScreen() === 3 && <OnboardingScreen3 />}
      </div>
    );
  };

  const widgets: Widget[] = [
    "clock",
    "date",
    "todo",
    "stopwatch",
    "bookmarks",
    "nature",
    "pomodoro",
    "focus",
    "ambience",
    "notepad",
    "counter",
    "mantras",
  ];

  function updateFilteredWidgets() {
    const currentWidgets = widgets.filter(
      (item: any) =>
        widgetOrder()[item] !== "" && widgetOrder()[item] !== undefined
    );
    setFilteredWidgets(currentWidgets);
  }

  createEffect(() => updateFilteredWidgets());

  onMount(() => {
    if (mode() === "dashboard") {
      initSwapy();

      if (localStorage.getItem("widgetPlacement") === null) {
        localStorage.setItem("widgetPlacement", JSON.stringify({}));
      }
    }

    if (backgroundPaused() == "false") {
      if (
        Number(
          typeof selectedImage() === "object"
            ? selectedImage().expiry
            : JSON.parse(selectedImage()).expiry
        ) < Date.now()
      ) {
        let selectedImage = images[Math.floor(Math.random() * images.length)];
        let newImage = {
          url: selectedImage.url,
          author: selectedImage.author,
          expiry: Date.now() + Number(wallpaperChangeTime()),
        };
        fetch(newImage.url, {
          mode: "no-cors",
          headers: {
            "Cache-Control": "public, max-age=315360000, immutable",
          },
        }).then((response) => {
          localStorage.setItem("selectedImage", JSON.stringify(newImage));
        });
      } else {
      }
    }

    if (mode() === "nightstand") {
      const intervalId = setInterval(() => {
        if (document.getElementById("nightstandClock") !== null) {
          document.getElementById("nightstandClock")!.textContent =
            clock().time;
        }

        if (document.getElementById("nightstandDay") !== null) {
          document.getElementById("nightstandDay")!.textContent = String(
            dateFormat() == "normal"
              ? `${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()]}, ${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][new Date().getMonth()]} ${new Date().getDate()}`
              : new Date().toISOString().split("T")[0]
          );
        }
      }, 1000);

      onCleanup(() => {
        clearInterval(intervalId);
      });
    }
  });

  function getKeyForValue(obj: any, value: any) {
    return Object.keys(obj).find((key) => obj[key] === value);
  }

  function getKeyByValue<T extends Record<string, any>>(
    obj: T,
    value: T[keyof T]
  ): string | undefined {
    return Object.keys(obj).find((key) => obj[key] === value);
  }

  function Block(props: { title: string; description: string; key: Widget }) {
    return (
      <div class="flex items-center justify-between">
        <div class="info">
          <h1 class="text-sm font-medium">{props.title}</h1>
          <p class="dark:text-muted-foreground text-sm text-gray-600">
            {props.description}
          </p>
        </div>
        <div class="add">
          <Button
            class="group w-[100px]"
            onmousedown={() => {
              const newWidgetOrder: any = widgetOrder();
              if (
                newWidgetOrder[`${getKeyByValue(widgetOrder(), props.key)}`]
              ) {
                newWidgetOrder[`${getKeyByValue(widgetOrder(), props.key)}`] =
                  undefined;
              } else {
                if (newWidgetOrder[props.key]) {
                  for (const key in widgets) {
                    if (newWidgetOrder[key] == undefined) {
                      newWidgetOrder[key] = widgets[key];
                    }
                  }
                } else {
                  newWidgetOrder[props.key] = props.key;
                }
              }
              setWidgetOrder(newWidgetOrder);
              localStorage.setItem(
                "widgetPlacement",
                JSON.stringify(newWidgetOrder)
              );
              updateFilteredWidgets();
              updateContainsValues(newWidgetOrder);
              setDialogOpen(false);
            }}
          >
            {getKeyForValue(widgetOrder(), props.key) != undefined ? (
              <Check />
            ) : (
              <Plus />
            )}
            {getKeyForValue(widgetOrder(), props.key) != undefined
              ? chrome.i18n.getMessage("added")
              : chrome.i18n.getMessage("add")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main
      class={cn(
        "font-mono",
        "font-serif",
        "font-sans",
        "font-comic-sans",
        "transition-all",
        `font-${currentFont()}`,
        imageLoaded() ? "bg-black dark:bg-none" : "",
        textStyle() == "uppercase" ? "**:!uppercase" : "",
        textStyle() == "lowercase" ? "**:lowercase" : ""
      )}
      id="main-container"
    >
      {!needsOnboarding() && <OnboardingFlow />}
      {(background() === "image" ||
        background() === "custom-url" ||
        background() === "local-file") && (
        <>
          <img
            src={
              background() === "image"
                ? typeof selectedImage() === "object"
                  ? selectedImage().url
                  : JSON.parse(selectedImage()).url
                : background() === "local-file"
                  ? localFileImage()
                  : customUrl()
            }
            alt=""
            id="wallpaper"
            class="absolute inset-0 h-full w-full object-cover transition-all"
            data-author={JSON.stringify(selectedImage().author)}
            style={{ opacity: 0 }}
            onLoad={(e: any) => {
              if (document.documentElement.style.colorScheme === "dark") {
                e.target.style.opacity = opacity();
              } else {
                e.target.style.opacity = 1;
                e.target.style.filter = `brightness(${opacity()})`;
              }
              if (wallpaperBlur() > 0) {
                e.target.style.filter = `blur(${Number(wallpaperBlur()) / 10}px)`;
              }
              setImageLoaded(true);
            }}
          />
        </>
      )}
      <div
        class={cn(
          "fixed inset-0 overflow-hidden p-4",
          imageLoaded() ? "" : "bg-white dark:bg-[#1f1f1f]"
        )}
        id="background-container"
        style={{
          background:
            background() === "solid-color"
              ? color() != "unset"
                ? color()
                : colorPalette[Math.floor(Math.random() * colorPalette.length)]
              : background() == "gradient"
                ? gradients[Math.floor(Math.random() * gradients.length)]
                : "",
        }}
      >
        <div
          class="absolute inset-0 z-30 h-screen flex-wrap items-center justify-center gap-3 p-4"
          style={{
            "align-content": layout() == "center" ? "center" : "flex-start",
            "padding-top": layout() == "top" ? "2.5rem" : "0",
          }}
          id="content-container"
        >
          <Show when={mode() == "widgets"}>
            <div
              id="top-widgets-container"
              class="fixed left-0 right-0 top-0 z-20 flex justify-between gap-4 p-2"
              style={{
                display: itemsHidden() == "true" ? "none" : "",
              }}
            >
              <div id="top-left-widgets-container">
                <Show when={bookmarksContained()}>
                  <DropdownMenu placement="bottom">
                    <DropdownMenuTrigger
                      as={(props: DropdownMenuSubTriggerProps) => (
                        <Button
                          variant="outline"
                          class="!bg-transparent text-sm !shadow-none hover:!bg-zinc-700"
                          {...props}
                        >
                          <Star class="h-4 w-4 text-gray-300" />
                          <span>{chrome.i18n.getMessage("bookmarks")}</span>
                        </Button>
                      )}
                    />
                    <DropdownMenuContent class="max-h-96 w-56 overflow-y-auto">
                      {bookmarks().length > 0 ? (
                        <>
                          {bookmarks().map(
                            (bookmark: Bookmark, index: number) => (
                              <DropdownMenuItem
                                onSelect={() => {
                                  window.location.href = bookmark.url;
                                }}
                              >
                                {bookmark.name}
                              </DropdownMenuItem>
                            )
                          )}
                        </>
                      ) : (
                        <span class="p-4 text-sm font-medium">
                          {chrome.i18n.getMessage("no_bookmarks")}
                        </span>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Show>
                <Show when={soundscapesEnabled()}>
                  <DropdownMenu placement="bottom">
                    <DropdownMenuTrigger
                      as={(props: DropdownMenuSubTriggerProps) => (
                        <Button
                          variant="outline"
                          class="!bg-transparent text-sm !shadow-none hover:!bg-zinc-700"
                          {...props}
                        >
                          <Volume2 class="h-4 w-4 text-gray-300" />
                          <span>{chrome.i18n.getMessage("soundscapes")}</span>
                        </Button>
                      )}
                    />
                    <DropdownMenuContent class="max-h-96 w-56 overflow-y-auto">
                      {soundscapes.length > 0 ? (
                        <>
                          <DropdownMenuItem
                            onSelect={() => {
                              window.open(
                                "https://noisefill.com/credits",
                                "_blank"
                              );
                            }}
                          >
                            View sound credits
                          </DropdownMenuItem>
                          <br />
                          <Show when={natureSounds()}>
                            <span class="select-none p-2 pb-5 pt-5 text-sm font-semibold">
                              {chrome.i18n.getMessage("nature_sounds")}
                            </span>
                            {soundscapes
                              .filter((soundscape) =>
                                soundscape.categories.includes("nature")
                              )
                              .map((soundscape, index: number) => (
                                <DropdownMenuItem
                                  onSelect={() => {
                                    if (
                                      currentlyPlaying() == `nature-${index}`
                                    ) {
                                      setCurrentlyPlaying(null);
                                      (
                                        document.getElementById(
                                          "audio"
                                        ) as HTMLAudioElement
                                      )?.load();
                                    } else {
                                      setCurrentlyPlaying(`nature-${index}`);
                                      (
                                        document.getElementById(
                                          "audio"
                                        ) as HTMLAudioElement
                                      )?.load();
                                    }
                                  }}
                                >
                                  {soundscape.name}
                                </DropdownMenuItem>
                              ))}
                          </Show>
                          <Show when={focusSounds()}>
                            {natureSounds() && <br />}
                            <span class="select-none p-2 pb-5 pt-5 text-sm font-semibold">
                              {chrome.i18n.getMessage("focus_sounds")}
                            </span>
                            {soundscapes
                              .filter((soundscape) => {
                                if (
                                  natureSounds() &&
                                  soundscape.categories.includes("nature")
                                ) {
                                  return false;
                                }
                                return soundscape.categories.includes("focus");
                              })
                              .map((soundscape, index: number) => (
                                <DropdownMenuItem
                                  onSelect={() => {
                                    if (
                                      currentlyPlaying() == `focus-${index}`
                                    ) {
                                      setCurrentlyPlaying(null);
                                      (
                                        document.getElementById(
                                          "audio"
                                        ) as HTMLAudioElement
                                      )?.load();
                                    } else {
                                      setCurrentlyPlaying(`focus-${index}`);
                                      (
                                        document.getElementById(
                                          "audio"
                                        ) as HTMLAudioElement
                                      )?.load();
                                    }
                                  }}
                                >
                                  {soundscape.name}
                                </DropdownMenuItem>
                              ))}
                          </Show>
                          <Show when={ambienceSounds()}>
                            {(focusSounds() || natureSounds()) && <br />}
                            <span class="select-none p-2 pb-5 pt-5 text-sm font-medium">
                              {chrome.i18n.getMessage("ambience_sounds")}
                            </span>
                            {soundscapes
                              .filter((soundscape) => {
                                if (
                                  natureSounds() &&
                                  soundscape.categories.includes("nature")
                                ) {
                                  return false;
                                }
                                if (
                                  focusSounds() &&
                                  soundscape.categories.includes("focus")
                                ) {
                                  return false;
                                }
                                return soundscape.categories.includes(
                                  "ambience"
                                );
                              })
                              .map((soundscape, index: number) => (
                                <DropdownMenuItem
                                  onSelect={() => {
                                    if (
                                      currentlyPlaying() == `ambience-${index}`
                                    ) {
                                      setCurrentlyPlaying(null);
                                      (
                                        document.getElementById(
                                          "audio"
                                        ) as HTMLAudioElement
                                      )?.load();
                                    } else {
                                      setCurrentlyPlaying(`ambience-${index}`);
                                      (
                                        document.getElementById(
                                          "audio"
                                        ) as HTMLAudioElement
                                      )?.load();
                                    }
                                  }}
                                >
                                  {soundscape.name}
                                </DropdownMenuItem>
                              ))}
                          </Show>
                        </>
                      ) : (
                        <span class="p-4 text-sm font-medium">
                          {chrome.i18n.getMessage("no_bookmarks")}
                        </span>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Show>
              </div>
              <div id="top-right-widgets-container" class="flex">
                <Show when={counterContained()}>
                  <div
                    id="counter-widget"
                    class="flex items-center gap-2 px-4 py-2"
                  >
                    <button
                      onmousedown={() => setCounter(Number(counter()) - 1)}
                      class="text-sm font-semibold"
                    >
                      <Minus class="h-5 w-5" fill="currentColor" />
                    </button>
                    <p class="select-none text-sm font-semibold">{counter()}</p>
                    <button
                      onmousedown={() => setCounter(Number(counter()) + 1)}
                      class="text-sm font-semibold"
                    >
                      <Plus class="h-5 w-5" fill="currentColor" />
                    </button>
                  </div>
                </Show>
                <Show when={stopwatchContained()}>
                  <div
                    id="stopwatch-widget"
                    class="flex items-center gap-2 px-4 py-2"
                  >
                    <p class="select-none text-sm font-semibold">
                      {formatTime(stopwatchTime())}
                    </p>
                    <button
                      onmousedown={() =>
                        setStopwatchRunning(!stopwatchRunning())
                      }
                    >
                      {stopwatchRunning() ? (
                        <Pause class="h-5 w-5" fill="currentColor" />
                      ) : (
                        <Play class="h-5 w-5" fill="currentColor" />
                      )}
                    </button>
                  </div>
                </Show>
              </div>
            </div>
          </Show>
          <div
            id="bottom-widgets-container"
            class="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between gap-3 p-2.5"
          >
            <div
              id="bottom-left-widgets-container"
              class="relative flex items-center gap-4"
            >
              <div
                class={cn(
                  `group absolute bottom-0 flex flex-col-reverse gap-1 rounded-full p-1.5
                  *:text-white focus-within:bg-white/20 focus-within:backdrop-blur-3xl
                  hover:bg-white/20 hover:backdrop-blur-3xl dark:focus-within:bg-black/20
                  dark:hover:bg-black/20`,
                  {
                    "opacity-0 hover:opacity-100": hideSettings(),
                  }
                )}
              >
                <SettingsTrigger triggerClass="text-gray-300 hover:rotate-45 group-hover:rotate-45 transition-transform" />
                <Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
                  <DialogTrigger
                    aria-label={chrome.i18n.getMessage("add_widget")}
                    class="hidden group-focus-within:block group-hover:block"
                  >
                    <Plus class="transition-transform" />
                  </DialogTrigger>
                  <DialogContent
                    class={cn(
                      textStyle() == "uppercase" ? "**:!uppercase" : "",
                      textStyle() == "lowercase" ? "**:lowercase" : ""
                    )}
                  >
                    <DialogHeader>
                      <DialogTitle>
                        {chrome.i18n.getMessage("blocks")}
                      </DialogTitle>
                      <DialogDescription>
                        {chrome.i18n.getMessage("blocks_description")}
                      </DialogDescription>
                      <br />
                      <Block
                        title={chrome.i18n.getMessage("bookmarks")}
                        description={chrome.i18n.getMessage(
                          "bookmarks_description"
                        )}
                        key="bookmarks"
                      />
                      <Block
                        title={chrome.i18n.getMessage("pomodoro")}
                        description={chrome.i18n.getMessage(
                          "pomodoro_description"
                        )}
                        key="pomodoro"
                      />
                      <Block
                        title={chrome.i18n.getMessage("nature_sounds")}
                        description={chrome.i18n.getMessage(
                          "nature_description"
                        )}
                        key="nature"
                      />
                      <Block
                        title={chrome.i18n.getMessage("mantras")}
                        description={chrome.i18n.getMessage(
                          "mantras_description"
                        )}
                        key="mantras"
                      />
                      <Block
                        title={chrome.i18n.getMessage("focus_sounds")}
                        description={chrome.i18n.getMessage(
                          "focus_sounds_description"
                        )}
                        key="focus"
                      />
                      <Block
                        title={chrome.i18n.getMessage("ambience_sounds")}
                        description={chrome.i18n.getMessage(
                          "ambience_sounds_description"
                        )}
                        key="ambience"
                      />
                      <Block
                        title={chrome.i18n.getMessage("todo_list")}
                        description={chrome.i18n.getMessage(
                          "todo_list_description"
                        )}
                        key="todo"
                      />
                      <Block
                        title={chrome.i18n.getMessage("stopwatch")}
                        description={chrome.i18n.getMessage(
                          "stopwatch_description"
                        )}
                        key="stopwatch"
                      />
                      <Show when={mode() === "dashboard"}>
                        <Block
                          title={chrome.i18n.getMessage("clock")}
                          description={chrome.i18n.getMessage(
                            "clock_description"
                          )}
                          key="clock"
                        />
                      </Show>
                      <Block
                        title={chrome.i18n.getMessage("date")}
                        description={chrome.i18n.getMessage("date_description")}
                        key="date"
                      />
                      <Block
                        title={chrome.i18n.getMessage("todo_list")}
                        description={chrome.i18n.getMessage(
                          "todo_list_description"
                        )}
                        key="todo"
                      />
                      <Block
                        title={chrome.i18n.getMessage("notepad")}
                        description={chrome.i18n.getMessage(
                          "notepad_description"
                        )}
                        key="notepad"
                      />
                      <Block
                        title={chrome.i18n.getMessage("counter")}
                        description={chrome.i18n.getMessage(
                          "counter_description"
                        )}
                        key="counter"
                      />
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <button
                  class="hidden group-focus-within:flex group-hover:flex peer-hover:!flex"
                  title={
                    itemsHidden() == "true"
                      ? chrome.i18n.getMessage("show_items")
                      : chrome.i18n.getMessage("hide_items")
                  }
                  onmousedown={() => {
                    setItemsHidden(itemsHidden() == "true" ? "false" : "true");
                  }}
                >
                  {itemsHidden() == "true" ? <EyeOff /> : <Eye />}
                </button>
                <Show when={background() == "image"}>
                  <button
                    class="hidden group-focus-within:flex group-hover:flex peer-hover:!flex
                      peer-focus:!flex"
                    title={
                      backgroundPaused() == "true"
                        ? chrome.i18n.getMessage("start_background_changes")
                        : chrome.i18n.getMessage("pause_background_changes")
                    }
                    onmousedown={() => {
                      if (backgroundPaused() == "true") {
                        setBackgroundPaused("false");
                      } else {
                        setSelectedImage(
                          JSON.stringify({
                            url: (
                              document.getElementById(
                                "wallpaper"
                              ) as HTMLImageElement
                            ).src,
                            expiry: Infinity,
                            author: document
                              .getElementById("wallpaper")!
                              .getAttribute("data-author")
                              ? JSON.parse(
                                  document
                                    .getElementById("wallpaper")!
                                    .getAttribute("data-author") as
                                    | string
                                    | "{}"
                                )
                              : undefined,
                          })
                        );
                        setBackgroundPaused("true");
                      }
                    }}
                  >
                    {backgroundPaused() == "true" ? (
                      <Play fill="currentColor" />
                    ) : (
                      <Pause fill="currentColor" />
                    )}
                  </button>
                </Show>
              </div>
              {selectedImage().author && background() == "image" ? (
                <span
                  class="ml-10 flex h-9 select-none items-center gap-1 p-1.5 text-sm font-medium
                    text-white"
                >
                  <a href={selectedImage().author.url}>
                    {selectedImage().author.name}
                  </a>{" "}
                  /{" "}
                  <a href="https://unsplash.com/" class="text-white">
                    Unsplash
                  </a>
                </span>
              ) : (
                <span
                  class="ml-10 flex h-9 select-none items-center gap-1 p-1.5 text-sm font-medium
                    text-white"
                ></span>
              )}
            </div>
            <Show when={mode() == "widgets" && itemsHidden() == "false"}>
              <div
                id="bottom-center-widgets-container"
                class="text-md fixed bottom-0 left-0 right-0 -z-50 m-2.5 flex !h-[36px] items-center
                  justify-center gap-2 text-center font-medium"
              >
                <Show when={mantrasContained()}>
                  <p>
                    {chrome.i18n.getMessage(
                      mantras[Math.floor(Math.random() * mantras.length)]
                    )}
                  </p>
                </Show>
              </div>
            </Show>
            <div
              id="bottom-right-widgets-container"
              style={{
                display: itemsHidden() == "true" ? "none" : "",
              }}
            >
              <Show when={todosContained()}>
                <Popover placement="top-end">
                  <PopoverTrigger
                    as={(props: PopoverTriggerProps) => (
                      <Button
                        variant="outline"
                        class="!bg-transparent text-sm !shadow-none hover:!bg-zinc-700"
                        {...props}
                      >
                        <Check class="h-4 w-4 text-gray-300" />
                        <span>{chrome.i18n.getMessage("tasks")}</span>
                      </Button>
                    )}
                  />
                  <PopoverContent class="max-h-96 w-56 overflow-y-auto">
                    <TodoPopover />
                  </PopoverContent>
                </Popover>
              </Show>
            </div>
          </div>
          <div
            class="flex items-center justify-center"
            id="center-widgets-container"
          >
            <Show when={mode() == "widgets"}>
              <div
                class="w-fit max-w-lg select-none text-center"
                style={{
                  display: itemsHidden() == "true" ? "none" : "",
                }}
              >
                <Show
                  when={pomodoroContained()}
                  fallback={
                    <div class="flex flex-col items-center justify-center">
                      <h1
                        class="m-0 p-0 text-[170px] font-semibold text-white [line-height:1.2]"
                        id="pomodoroClock"
                      >
                        {formatTime(pomodoro().time)}
                      </h1>
                      <p class="m-0 flex items-center gap-2 p-0 text-3xl font-medium text-white">
                        {pomodoro().session == "Work"
                          ? chrome.i18n.getMessage("work")
                          : chrome.i18n.getMessage("break")}
                      </p>
                      <div class="flex items-center gap-3">
                        <Button
                          class="mt-2 rounded-full border-4 border-black/30 bg-black/30 p-6 text-xl
                            backdrop-blur-3xl"
                          onmousedown={() =>
                            setPomodoro({
                              ...pomodoro(),
                              playing: !pomodoro().playing,
                            })
                          }
                        >
                          {pomodoro().playing
                            ? chrome.i18n.getMessage("stop")
                            : chrome.i18n.getMessage("start")}
                        </Button>
                        <Dialog
                          open={pomodoroDialogOpen()}
                          onOpenChange={setPomodoroDialogOpen}
                        >
                          <DialogTrigger
                            aria-label={chrome.i18n.getMessage("add_widget")}
                          >
                            <Button
                              class="mt-2 rounded-full border-4 border-black/30 bg-black/5 p-6 text-xl
                                backdrop-blur-lg"
                            >
                              {chrome.i18n.getMessage("settings")}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                {chrome.i18n.getMessage("pomodoro_settings")}
                              </DialogTitle>
                              <DialogDescription>
                                {chrome.i18n.getMessage(
                                  "edit_the_pomodoro_settings"
                                )}
                              </DialogDescription>
                            </DialogHeader>
                            <TextFieldRoot class="mt-1 flex-1">
                              <TextField
                                placeholder={chrome.i18n.getMessage(
                                  "work_minutes"
                                )}
                                value={
                                  (typeof pomodoroConfig() === "object"
                                    ? (pomodoroConfig as Function)().workMinutes
                                    : pomodoroConfig()) as string
                                }
                                onInput={(e) => {
                                  let newPomodoroConfig =
                                    typeof pomodoroConfig() === "object"
                                      ? JSON.parse(
                                          JSON.stringify(pomodoroConfig())
                                        )
                                      : {};
                                  newPomodoroConfig.workMinutes = Number(
                                    e.currentTarget.value
                                  );
                                  setPomodoroConfig(newPomodoroConfig);
                                }}
                              />
                            </TextFieldRoot>
                            <TextFieldRoot class="mt-2 flex-1">
                              <TextField
                                placeholder={chrome.i18n.getMessage(
                                  "break_minutes"
                                )}
                                value={
                                  typeof pomodoroConfig() === "object"
                                    ? (pomodoroConfig as Function)()
                                        .breakMinutes
                                    : pomodoroConfig()
                                }
                                onInput={(e) => {
                                  let newPomodoroConfig =
                                    typeof pomodoroConfig() === "object"
                                      ? JSON.parse(
                                          JSON.stringify(pomodoroConfig())
                                        )
                                      : {};
                                  newPomodoroConfig.breakMinutes = Number(
                                    e.currentTarget.value
                                  );
                                  setPomodoroConfig(newPomodoroConfig);
                                }}
                              />
                            </TextFieldRoot>
                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                              {chrome.i18n.getMessage(
                                "you_may_need_to_refresh"
                              )}
                            </span>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <Show when={name() == ""}>
                        <Show when={dateContained()}>
                          <div class="h-1.25 mt-4 w-full rounded-full bg-black/30 backdrop-blur-3xl"></div>
                        </Show>
                      </Show>
                    </div>
                  }
                >
                  <h1
                    class="m-0 p-0 text-[170px] font-semibold text-white [line-height:1.2]"
                    id="nightstandClock"
                  >
                    {clock().time}
                  </h1>
                </Show>
                <p class="mt-3 text-3xl font-medium text-white">
                  <Show when={name() == ""}>
                    <Show when={dateContained()}>
                      {dateFormat() == "normal" ? (
                        <span id="nightstandDay">
                          {
                            [
                              "Sunday",
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                            ][new Date().getDay()]
                          }
                          ,{" "}
                          {
                            [
                              "January",
                              "February",
                              "March",
                              "April",
                              "May",
                              "June",
                              "July",
                              "August",
                              "September",
                              "October",
                              "November",
                              "December",
                            ][new Date().getMonth()]
                          }{" "}
                          {new Date().getDate()}
                        </span>
                      ) : (
                        <span id="nightstandDay">
                          {new Date().toISOString().split("T")[0]}
                        </span>
                      )}
                    </Show>
                  </Show>
                  <Show when={name() != ""}>
                    {new Date().getHours() < 12
                      ? new Date().getHours() >= 5
                        ? chrome.i18n.getMessage("good_morning")
                        : chrome.i18n.getMessage("good_night")
                      : new Date().getHours() < 18
                        ? chrome.i18n.getMessage("good_afternoon")
                        : chrome.i18n.getMessage("good_evening")}
                    , {name()}.
                  </Show>
                </p>
                <br />
                <Show when={notepadContained()}>
                  <textarea
                    class="mt-2 h-[150px] w-full resize-none rounded-xl bg-black/10 p-3 text-sm text-white
                      shadow-inner shadow-white/10 outline-none backdrop-blur-2xl
                      placeholder:text-zinc-300 focus:ring-2"
                    value={notepad()}
                    placeholder={chrome.i18n.getMessage("notepad_disclaimer")}
                    onInput={(e) => setNotepad(e.currentTarget.value)}
                  ></textarea>
                </Show>
              </div>
            </Show>
          </div>
          {mode() === "dashboard" && (
            <div id="widgets-container">
              <h1
                id="greeting"
                class="inset-shadow-2xl mb-6 text-5xl font-bold text-white
                  [text-shadow:_0_10px_0_var(--tw-shadow-color)]"
                style={{
                  "text-align": layout() == "center" ? "center" : "left",
                  "padding-left": layout() == "top" ? "2.5rem" : "0",
                  display: name() == "" ? "none" : "block",
                  color:
                    background() == "image" &&
                    !imageLoaded() &&
                    document.documentElement.style.colorScheme != "dark"
                      ? ""
                      : "#fff",
                }}
              >
                {new Date().getHours() < 12
                  ? new Date().getHours() >= 5
                    ? chrome.i18n.getMessage("good_morning")
                    : chrome.i18n.getMessage("good_night")
                  : new Date().getHours() < 18
                    ? chrome.i18n.getMessage("good_afternoon")
                    : chrome.i18n.getMessage("good_evening")}
                , {name()}.
              </h1>
              <div
                class={cn(
                  "widgets m-0 flex flex-wrap gap-3 p-4",
                  layout() == "center" && "justify-center",
                  layout() == "top" && "!pl-8"
                )}
                id="widgets"
              >
                {filteredWidgets().length > 0 ? (
                  filteredWidgets().map((item: any, index: number) => {
                    return (
                      <div
                        class={`${uuidv4()} slot group h-fit`}
                        data-swapy-slot={item}
                      >
                        <div
                          class={cn(
                            "widget group",
                            actuallyBoolean(squareWidgets())
                              ? widgetOrder()[item] === "clock" ||
                                widgetOrder()[item] === "date"
                                ? "widget-square"
                                : ""
                              : ""
                          )}
                          data-swapy-item={widgetOrder()[item]}
                        >
                          {widgetOrder()[item] === "clock" && <ClockWidget />}
                          {widgetOrder()[item] === "date" && <DateWidget />}
                          {widgetOrder()[item] === "todo" && <TodoWidget />}
                          {widgetOrder()[item] === "mantras" && <Mantras />}
                          {widgetOrder()[item] === "focus" && (
                            <FocusSoundscapes />
                          )}
                          {widgetOrder()[item] === "counter" && (
                            <CounterWidget />
                          )}
                          {widgetOrder()[item] === "ambience" && (
                            <AmbienceSoundscapes />
                          )}
                          {widgetOrder()[item] === "stopwatch" && (
                            <StopwatchWidget />
                          )}
                          {widgetOrder()[item] === "bookmarks" && (
                            <BookmarksWidget />
                          )}
                          {widgetOrder()[item] === "nature" && <NatureWidget />}
                          {widgetOrder()[item] === "pomodoro" && (
                            <PomodoroWidget />
                          )}
                          {widgetOrder()[item] === "notepad" && (
                            <NotepadWidget />
                          )}
                          {widgetOrder()[item] == "todo" && (
                            <GripVertical
                              data-swapy-handle
                              height={16}
                              class="absolute -top-2 right-5 hidden size-[24px] !cursor-move items-center
                                justify-center !rounded-full bg-white p-0.5 text-black shadow-sm
                                hover:bg-white/90 group-hover:block"
                            />
                          )}
                          {widgetOrder()[item] == "notepad" && (
                            <GripVertical
                              data-swapy-handle
                              height={16}
                              class="absolute -top-2 right-5 hidden size-[24px] !cursor-move items-center
                                justify-center !rounded-full bg-white p-0.5 text-black shadow-sm
                                hover:bg-white/90 group-hover:block"
                            />
                          )}
                          {widgetOrder()[item] == "counter" && (
                            <GripVertical
                              data-swapy-handle
                              height={16}
                              class="absolute -top-2 right-5 hidden size-[24px] !cursor-move items-center
                                justify-center !rounded-full bg-white p-0.5 text-black shadow-sm
                                hover:bg-white/90 group-hover:block"
                            />
                          )}
                          <button
                            class="absolute -right-2 -top-2 hidden size-[24px] items-center justify-center
                              !rounded-full bg-white shadow-sm hover:bg-white/90 group-focus-within:block
                              group-hover:block"
                            onmousedown={(e) => {
                              const newWidgetOrder = widgetOrder();
                              delete newWidgetOrder[item];
                              setWidgetOrder(newWidgetOrder);
                              updateContainsValues();
                              e.target.parentElement?.parentElement?.remove();
                              localStorage.setItem(
                                "widgetPlacement",
                                JSON.stringify(newWidgetOrder)
                              );
                              updateFilteredWidgets();
                            }}
                          >
                            <X height={16} class="text-black" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <section></section>
                )}
              </div>
            </div>
          )}
          {mode() === "nightstand" && (
            <div
              class="flex items-center justify-center"
              id="nightstand-container"
            >
              <div class="w-fit max-w-lg select-none">
                <h1
                  class="m-0 p-0 text-[200px] font-bold [line-height:1.2]"
                  id="nightstandClock"
                >
                  {clock().time}
                </h1>
                <p class="mt-3 pl-2 text-3xl font-medium">
                  {dateFormat() == "normal" ? (
                    <span id="nightstandDay">
                      {
                        [
                          "Sunday",
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                        ][new Date().getDay()]
                      }
                      ,{" "}
                      {
                        [
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ][new Date().getMonth()]
                      }{" "}
                      {new Date().getDate()}
                    </span>
                  ) : (
                    <span id="nightstandDay">
                      {new Date().toISOString().split("T")[0]}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
          {mode() === "speeddial" && (
            <div
              class="flex flex-col items-center justify-center gap-2"
              id="speeddial-container"
            >
              <div
                id="bookmarks"
                class={cn(
                  "mt-2 grid gap-6 px-3.5",
                  "grid-cols-4",
                  bookmarks().length % 2 == 0 && "grid-cols-2",
                  bookmarks().length % 3 == 0 && "grid-cols-3",
                  bookmarks().length % 4 == 0 && "grid-cols-4"
                )}
              >
                {bookmarks()
                  .slice(0, 12)
                  .map((bookmark: Bookmark, index: number) => (
                    <div class="bookmark flex items-center gap-2">
                      <a
                        href={bookmark.url}
                        target="_blank"
                        class="overflow-hidden text-ellipsis whitespace-nowrap text-[28px] font-medium
                          text-white"
                      >
                        {bookmark.name}
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Show when={mode() == "widgets"}>
        <audio
          src={
            currentlyPlaying()
              ? (soundscapes as Soundscape[]).filter((item: Soundscape) =>
                  item.categories.includes(currentlyPlaying().split("-")[0])
                )[currentlyPlaying().split("-")[1]]?.url
              : ""
          }
          id="audio"
          autoplay
          loop
        ></audio>
      </Show>
      <CommandPalette />
    </main>
  );
};

export default App;
