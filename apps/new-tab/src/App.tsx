import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import type { Component } from "solid-js";
import { Button } from "./components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Clock,
  CloudFog,
  CloudSun,
  Cloudy,
  Eye,
  EyeOff,
  Grid,
  GripVertical,
  Home,
  LucideCloud,
  Minus,
  Pause,
  Play,
  Plus,
  Star,
  Sun,
  Volume2,
  X,
} from "lucide-solid";
import { v4 as uuidv4 } from "uuid";
import { TodoPopover } from "./Widgets";
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
import { useWeather } from "./hooks/weather";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { SelectItemProps } from "@kobalte/core/select";

type MessageKeys = keyof typeof data;

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

type Mantra =
  | "mantra_1"
  | "mantra_2"
  | "mantra_3"
  | "mantra_4"
  | "mantra_5"
  | "mantra_6"
  | "mantra_7"
  | "mantra_8"
  | "mantra_9"
  | "mantra_10"
  | "mantra_11"
  | "mantra_12"
  | "mantra_13"
  | "mantra_14"
  | "mantra_15";

const mantras: Mantra[] = [
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

try {
  chrome.i18n.getMessage("work");
} catch (error) {
  window.chrome = {} as any;
  chrome.i18n = {
    getMessage: (
      message: MessageKeys | string,
      substitutions?: string | string[]
    ) => {
      let msg = data[message as MessageKeys]?.message || message;
      if (substitutions) {
        if (!Array.isArray(substitutions)) substitutions = [substitutions];
        substitutions.forEach((sub, index) => {
          msg = msg.replace(new RegExp(`\\$${index + 1}`, "g"), sub);
        });
      }
      return msg;
    },
  };
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

function safeParse<T>(data: any, fallback: T): T {
  try {
    const parsed = JSON.parse(data);
    console.log(parsed);
    return parsed;
  } catch {
    return fallback;
  }
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

const App: Component = () => {
  const [needsOnboarding, setNeedsOnboarding] = createStoredSignal(
    "onboarding",
    false
  );
  const [onboardingScreen, setOnboardingScreen] = createSignal<number>(1);
  const [greetingNameValue, setGreetingNameValue] = createSignal("");
  const [imageLoaded, setImageLoaded] = createSignal(false);
  const [filteredWidgets, setFilteredWidgets] = createSignal<any[]>([]);
  const [dialogOpen, setDialogOpen] = createSignal<boolean>(false);
  const [weatherContained, setWeatherContained] = createStoredSignal(
    "weatherEnabled",
    false
  );
  const [customUrl, setCustomUrl] = createStoredSignal("customUrl", "");
  const [hideSettings, setHideSettings] = createStoredSignal(
    "hideSettings",
    false
  );
  const [squareWidgets, setSquareWidgets] = createStoredSignal(
    "squareWidgets",
    false
  );
  const [userCSS] = createStoredSignal("userCSS", "");
  const [currentlyPlaying, setCurrentlyPlaying] = createSignal<any>(null);
  const [pageIconURL] = createStoredSignal("iconUrl", "assets/logo.png");
  const [dateFormat] = createStoredSignal("dateFormat", "normal");
  const [selectedColor] = createSignal(
    colorPalette[Math.floor(Math.random() * colorPalette.length)]
  );
  const [clockFormat, setClockFormat] = createStoredSignal("clockFormat", "");
  const [notepad, setNotepad] = createStoredSignal<string>("notepad", "");
  const [layout] = createStoredSignal("layout", "center");
  const [currentFont, setFont] = createStoredSignal("font", "sans");
  const [background, setBackground] = createStoredSignal("background", "image");
  const [name, setName] = createStoredSignal("name", "");
  const [bookmarks, setBookmarks] = createSignal<any[]>([]);
  const [pageTitle, setPageTitle] = createStoredSignal("pageTitle", "");
  const [textStyle] = createStoredSignal("textStyle", "normal");
  const [color] = createStoredSignal("color", "unset");
  const [opacity] = createStoredSignal("opacity", "0.8");
  const [wallpaperBlur] = createStoredSignal<number>("wallpaperBlur", 0);
  const [pomodoroContained, setPomodoroContained] = createStoredSignal(
    "pomodoroContained",
    false
  );
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
  const [dateContained, setDateContained] = createStoredSignal(
    "dateContained",
    true
  );
  const [counterContained, setCounterContained] = createStoredSignal(
    "counterContained",
    false
  );
  const [bookmarksShown, setBookmarksShown] = createStoredSignal(
    "bookmarksShown",
    []
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
  const [wallpaperChangeTime] = createStoredSignal<number>(
    "wallpaperChangeTime",
    1000 * 60 * 60 * 24 * 7
  );
  const clock = formattedClock();
  const [localFileImage] = createStoredSignal("localFile", "");
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
      const selectedImage = images[Math.floor(Math.random() * images.length)];
      return JSON.stringify({
        url: selectedImage.url,
        author: selectedImage.author,
        expiry: Date.now() + Number(wallpaperChangeTime()),
        location: selectedImage.location,
        directLink: selectedImage.directLink,
      });
    }

    const selectedImage = images[Math.floor(Math.random() * images.length)];

    return {
      url: selectedImage.url,
      author: selectedImage.author,
      expiry: Date.now() + Number(wallpaperChangeTime()),
      directLink: selectedImage.directLink,
    };
  }

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
  const [formattedWeather, setFormattedWeather] = createSignal("--");
  const [imperial] = createStoredSignal("imperial", false);
  const [location] = createStoredSignal<Array<any>>("location", [null, null]);
  const [weather] = useWeather(
    safeParse(location(), location())[0],
    safeParse(location(), location())[1]
  );
  const [todosContained, setTodosContained] = createStoredSignal(
    "todosContained",
    true
  );
  const [natureSounds, setNatureSounds] = createStoredSignal(
    "natureSounds",
    false
  );
  const [focusSounds, setFocusSounds] = createStoredSignal(
    "focusSounds",
    false
  );
  const [ambienceSounds, setAmbienceSounds] = createStoredSignal(
    "ambienceSounds",
    false
  );
  const [stopwatchTime, setStopwatchTime] = createSignal(0);
  const [stopwatchRunning, setStopwatchRunning] = createSignal(false);
  const [counter, setCounter] = createStoredSignal("counter", 0);
  const [city] = createStoredSignal("locationCity", "");

  function formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${Math.floor(
      Number(seconds.toString())
    )
      .toString()
      .padStart(2, "0")}`;
  }

  createEffect(() => {
    if (weather) {
      setFormattedWeather(
        Number(weather()?.temperature)
          ? `${imperial() ? Math.round((Number(weather()?.temperature) * 9) / 5 + 32) : Math.round(Number(weather()?.temperature))}°`
          : "--"
      );
    }
  });

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

    injectUserCSS(userCSS());

    setInterval(() => {
      if (stopwatchContained() && stopwatchRunning()) {
        setStopwatchTime(stopwatchTime() + 1);
      }
    }, 1000);

    setInterval(() => {
      if (pomodoro().playing) {
        if (pomodoro().time - 1 == 0) {
          const config =
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
  });

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

  createEffect(() => {
    (document.getElementById("icon") as any).href = pageIconURL();
  }, [pageIconURL]);

  const OnboardingScreen1: Component = () => {
    return (
      <div>
        <h1 class="text-[26px] font-semibold m-0 p-0">
          {chrome.i18n.getMessage("welcome_message")}
        </h1>
        <p class="text-[#4D4842] dark:text-[#B2B7BD] text-[15px]">
          {chrome.i18n.getMessage("greeting_description")}
        </p>
        <br />
        <TextFieldRoot class="flex-1">
          <TextField
            placeholder={chrome.i18n.getMessage("display_name")}
            value={greetingNameValue()}
            onInput={(e: InputEvent) =>
              setGreetingNameValue((e.currentTarget as HTMLInputElement)?.value)
            }
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key == "Enter") {
                setOnboardingScreen(2);
              }
            }}
            autofocus={true}
          />
        </TextFieldRoot>
        <br />
        <div class="flex items-center gap-2 p-7.5 absolute bottom-0 left-0 right-0 bg-transparent">
          <Button
            variant={"outline"}
            class="px-2.5"
            disabled
            title={chrome.i18n.getMessage("go_back")}
          >
            <ArrowLeft class="transition-transform group-hover:translate-x-1 size-[13.3px]" />
          </Button>
          <Button
            class="group flex items-center gap-1"
            onmousedown={() => {
              setOnboardingScreen(2);
              setName(greetingNameValue());
            }}
          >
            {greetingNameValue() == ""
              ? chrome.i18n.getMessage("skip")
              : chrome.i18n.getMessage("next")}
            <ArrowRight class="transition-transform group-hover:translate-x-1 size-[13.3px]" />
          </Button>
        </div>
      </div>
    );
  };
  const OnboardingScreen2: Component = () => {
    return (
      <div class="overflow-y-auto max-h-[70%]">
        <h1 class="text-[26px] font-semibold m-0 p-0">
          {chrome.i18n.getMessage("customize")}
        </h1>
        <p class="text-[#4D4842] dark:text-[#B2B7BD] text-[15px]">
          {chrome.i18n.getMessage("customize_desc")}
        </p>
        <br />
        <span class="text-sm">{chrome.i18n.getMessage("background")}</span>
        <Select
          options={["image", "solid_color", "gradient", "blank"]}
          placeholder={chrome.i18n.getMessage("background")}
          defaultValue={background().replaceAll("-", "_")}
          onChange={(value: string | null) => {
            if (value == "image") {
              setBackground("image");
              return;
            }
            if (value == "solid_color") {
              setBackground("solid-color");
              return;
            }
            if (value == "gradient") {
              setBackground("gradient");
              return;
            }
            if (value == "blank") {
              setBackground("blank");
              return;
            }
          }}
          itemComponent={(props: SelectItemProps) => (
            <SelectItem
              item={props.item}
              class={cn({
                "!font-sans": props.item.rawValue == "sans",
                "!font-serif": props.item.rawValue == "serif",
                "!font-mono": props.item.rawValue == "mono",
                "!font-comic-sans": props.item.rawValue == "comic_sans",
              })}
            >
              {chrome.i18n.getMessage(
                props.item.rawValue as "sans" | "serif" | "mono" | "comic_sans"
              )}
            </SelectItem>
          )}
        >
          <SelectTrigger class="w-[180px] bg-[#DFDEDC] dark:bg-[#111113]">
            <SelectValue<string>>
              {(state: any) =>
                chrome.i18n.getMessage(
                  state.selectedOption() as
                    | "sans"
                    | "serif"
                    | "mono"
                    | "comic_sans"
                )
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent class="bg-[#DFDEDC] dark:bg-[#111113]" />
        </Select>
        <br />
        <span class="text-sm">{chrome.i18n.getMessage("font")}</span>
        <Select
          options={["sans", "serif", "mono", "comic_sans"]}
          placeholder={chrome.i18n.getMessage("select_font")}
          defaultValue={currentFont()}
          onChange={(value: string | null) => {
            if (value == "sans") {
              setFont("sans");
              return;
            }
            if (value == "serif") {
              setFont("serif");
              return;
            }
            if (value == "mono") {
              setFont("mono");
              return;
            }
            if (value == "comic_sans") {
              setFont("comic-sans");
              return;
            }
          }}
          itemComponent={(props: SelectItemProps) => (
            <SelectItem
              item={props.item}
              class={cn({
                "!font-sans": props.item.rawValue == "sans",
                "!font-serif": props.item.rawValue == "serif",
                "!font-mono": props.item.rawValue == "mono",
                "!font-comic-sans": props.item.rawValue == "comic_sans",
              })}
            >
              {chrome.i18n.getMessage(
                props.item.rawValue as "sans" | "serif" | "mono" | "comic_sans"
              )}
            </SelectItem>
          )}
        >
          <SelectTrigger class="w-[180px] bg-[#DFDEDC] dark:bg-[#111113]">
            <SelectValue<string>>
              {(state: any) =>
                chrome.i18n.getMessage(
                  state.selectedOption() as
                    | "sans"
                    | "serif"
                    | "mono"
                    | "comic_sans"
                )
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent class="bg-[#DFDEDC] dark:bg-[#111113]" />
        </Select>
        <br />
        <span class="text-sm">{chrome.i18n.getMessage("clock_format")}</span>
        <Select
          options={["12h", "24h"]}
          placeholder={chrome.i18n.getMessage("clock_format")}
          defaultValue={clockFormat()}
          onChange={(value: string | null) => {
            if (value == "12h") {
              setClockFormat("12h");
              return;
            }
            if (value == "24h") {
              setClockFormat("24h");
              return;
            }
          }}
          itemComponent={(props: SelectItemProps) => (
            <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
          )}
        >
          <SelectTrigger class="w-[180px] bg-[#DFDEDC] dark:bg-[#111113]">
            <SelectValue<string>>
              {(state: any) => state.selectedOption()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent class="bg-[#DFDEDC] dark:bg-[#111113]" />
        </Select>
        <div class="flex items-center gap-2 p-7.5 absolute bottom-0 left-0 right-0 bg-transparent">
          <Button
            variant={"outline"}
            class="px-2.5"
            onMouseDown={() => setOnboardingScreen(1)}
            title={chrome.i18n.getMessage("go_back")}
          >
            <ArrowLeft class="transition-transform group-hover:translate-x-1 size-[13.3px]" />
          </Button>
          <Button
            class="group flex items-center gap-1"
            onmousedown={() => {
              setOnboardingScreen(3);
            }}
          >
            {chrome.i18n.getMessage("next")}
            <ArrowRight class="transition-transform group-hover:translate-x-1 size-[13.3px]" />
          </Button>
        </div>
      </div>
    );
  };
  const OnboardingScreen3: Component = () => {
    return (
      <div>
        <h1 class="text-[26px] font-semibold m-0 p-0">
          {chrome.i18n.getMessage("join_the_community")}
        </h1>
        <p class="text-[#4D4842] dark:text-[#B2B7BD] text-[15px]">
          {chrome.i18n.getMessage("community_desc")}
        </p>
        <br />
        <a
          href="https://discord.gg/hhPuurkvua"
          target="_blank"
          class="text-white"
        >
          <Button
            variant={"outline"}
            class="px-2.5"
            title={chrome.i18n.getMessage("discord")}
          >
            {chrome.i18n.getMessage("discord")}
          </Button>
        </a>
        <br />
        <div class="flex items-center gap-2 p-7.5 absolute bottom-0 left-0 right-0 bg-transparent">
          <Button
            variant={"outline"}
            class="px-2.5"
            onMouseDown={() => setOnboardingScreen(2)}
            title={chrome.i18n.getMessage("go_back")}
          >
            <ArrowLeft class="transition-transform group-hover:translate-x-1 size-[13.3px]" />
          </Button>
          <Button
            class="group flex items-center gap-1"
            onmousedown={() => {
              setNeedsOnboarding(true);
            }}
          >
            {chrome.i18n.getMessage("finish")}
            <ArrowRight class="transition-transform group-hover:translate-x-1 size-[13.3px]" />
          </Button>
        </div>
      </div>
    );
  };

  const OnboardingFlow: Component = () => {
    return (
      <Dialog open={true}>
        <DialogContent
          class={cn("max-h-[550px] max-w-[800px]")}
          overlayClass="!backdrop-blur-xl"
        >
          <div
            class={cn(
              `absolute inset-0 z-50 bg-white dark:bg-[#18191B] backdrop-blur-3xl p-7.5
              overflow-y-auto`,
              {
                "font-sans": currentFont() == "sans",
                "font-serif": currentFont() == "serif",
                "font-mono": currentFont() == "mono",
                "font-comic-sans": currentFont() == "comic-sans",
              }
            )}
            id="onboarding"
          >
            {onboardingScreen() === 1 && <OnboardingScreen1 />}
            {onboardingScreen() === 2 && <OnboardingScreen2 />}
            {onboardingScreen() === 3 && <OnboardingScreen3 />}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  onMount(() => {
    if (pageTitle()) {
      document.title = pageTitle();
    }
    if (backgroundPaused() == "false") {
      if (
        Number(
          typeof selectedImage() === "object"
            ? selectedImage().expiry
            : JSON.parse(selectedImage()).expiry
        ) < Date.now()
      ) {
        const selectedImage = images[Math.floor(Math.random() * images.length)];
        const newImage = {
          url: selectedImage.url,
          author: selectedImage.author,
          expiry: Date.now() + Number(wallpaperChangeTime()),
          location: selectedImage.location,
          directLink: selectedImage.directLink,
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
        localStorage.setItem(
          "selectedImage",
          JSON.stringify(getInitialSelectedImage())
        );
      }
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

  return (
    <main
      class={cn(
        {
          "font-mono": currentFont() == "mono",
          "font-serif": currentFont() == "serif",
          "font-sans": currentFont() == "sans",
          "font-comic-sans": currentFont() == "comic-sans",
        },
        "transition-all",
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
            data-location={selectedImage().location}
            data-direct-link={selectedImage().directLink}
            style={{ opacity: 0, filter: "brightness(0)" }}
            onLoad={(e: any) => {
              if (document.documentElement.style.colorScheme === "dark") {
                e.target.style.opacity = opacity();
                e.target.style.filter = `brightness(100%)`;
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
                : selectedColor()
              : background() == "gradient"
                ? gradients[Math.floor(Math.random() * gradients.length)]
                : "",
        }}
      >
        <div
          class="absolute inset-0 z-30 h-screen flex flex-wrap items-center gap-3 p-4"
          style={{
            "align-content":
              layout() == "center"
                ? "center"
                : layout().startsWith("top-")
                  ? "flex-start"
                  : layout() == "top"
                    ? "flex-start"
                    : "flex-end",
            "padding-top": layout().startsWith("top") ? "4.5rem" : "0",
            "padding-bottom": layout().startsWith("bottom-") ? "4.5rem" : "0",
            "padding-left": layout().endsWith("-left") ? "4.5rem" : "0",
            "padding-right": layout().endsWith("-right") ? "4.5rem" : "0",
            "justify-content": layout().endsWith("-left")
              ? "flex-start"
              : layout().endsWith("-right")
                ? "flex-end"
                : "center",
          }}
          id="content-container"
        >
          <div
            id="top-widgets-container"
            class="fixed left-0 right-0 top-0 z-20 flex justify-between gap-4 p-2"
            style={{
              display: itemsHidden() == "true" ? "none" : "",
            }}
          >
            <div id="top-left-widgets-container">
              <Show when={actuallyBoolean(bookmarksContained())}>
                <DropdownMenu placement="bottom">
                  <DropdownMenuTrigger
                    as={(props: DropdownMenuSubTriggerProps) => (
                      <Button
                        variant="outline"
                        class="!bg-transparent text-sm !shadow-none hover:!bg-zinc-700 !border-none !text-white"
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
              <Show when={natureSounds() || focusSounds() || ambienceSounds()}>
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
                                  if (currentlyPlaying() == `nature-${index}`) {
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
                                  if (currentlyPlaying() == `focus-${index}`) {
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
                              return soundscape.categories.includes("ambience");
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
              <Show when={actuallyBoolean(counterContained())}>
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
              <Show when={actuallyBoolean(stopwatchContained())}>
                <div
                  id="stopwatch-widget"
                  class="flex items-center gap-2 px-4 py-2"
                >
                  <p class="select-none text-sm font-semibold">
                    {formatTime(stopwatchTime())}
                  </p>
                  <button
                    onmousedown={() => setStopwatchRunning(!stopwatchRunning())}
                  >
                    {stopwatchRunning() ? (
                      <Pause class="h-5 w-5" fill="currentColor" />
                    ) : (
                      <Play class="h-5 w-5" fill="currentColor" />
                    )}
                  </button>
                </div>
              </Show>
              <Show when={actuallyBoolean(weatherContained())}>
                <div
                  id="weather-widget"
                  class="flex items-center gap-2 px-3 py-1 w-full select-none"
                >
                  <span>
                    {city() != "" && `${city()} • `}
                    {formattedWeather()}
                  </span>
                </div>
              </Show>
            </div>
          </div>
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
                  `group absolute flex flex-col-reverse gap-1 rounded-full p-1.5 *:text-white
                  focus-within:bg-white/20 focus-within:backdrop-blur-3xl hover:bg-white/20
                  hover:backdrop-blur-3xl dark:focus-within:bg-black/20 dark:hover:bg-black/20`,
                  {
                    "opacity-0 hover:opacity-100": hideSettings(),
                    "bottom-0": !selectedImage().location,
                    "bottom-[8px]": selectedImage().location,
                  }
                )}
              >
                <SettingsTrigger triggerClass="text-gray-300 hover:rotate-45 group-hover:rotate-45 transition-transform" />
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
                        setSelectedImage({
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
                                  .getAttribute("data-author") as string | "{}"
                              )
                            : undefined,
                          location: document
                            .getElementById("wallpaper")!
                            .getAttribute("data-location")
                            ? document
                                .getElementById("wallpaper")!
                                .getAttribute("data-location")
                            : undefined,
                          directLink: document
                            .getElementById("wallpaper")!
                            .getAttribute("data-direct-link")
                            ? document
                                .getElementById("wallpaper")!
                                .getAttribute("data-direct-link")
                            : undefined,
                        });
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
                  class={cn(
                    `ml-10 flex h-fit select-none items-start p-1.5 text-sm font-medium flex-col
                      text-white justify-center`,
                    {
                      "h-[36px]": !selectedImage().location,
                      "h-[52px]": selectedImage().location,
                    }
                  )}
                >
                  {selectedImage().location ? (
                    <span class="text-white">{selectedImage().location}</span>
                  ) : (
                    <span></span>
                  )}
                  <span
                    class={cn(
                      selectedImage().location ? "text-gray-300" : "text-white"
                    )}
                  >
                    <a href={selectedImage().author.url}>
                      {selectedImage().author.name}
                    </a>{" "}
                    /{" "}
                    <a
                      href={
                        selectedImage().directLink
                          ? selectedImage().directLink
                          : "https://unsplash.com/"
                      }
                    >
                      Unsplash
                    </a>
                  </span>
                </span>
              ) : (
                <span
                  class="ml-10 flex h-9 select-none items-center gap-1 p-1.5 text-sm font-medium
                    text-white"
                ></span>
              )}
            </div>
            <Show when={itemsHidden() == "false"}>
              <div
                id="bottom-center-widgets-container"
                class="text-md fixed bottom-0 left-0 right-0 -z-50 m-2.5 flex !h-[36px] items-center
                  justify-center gap-2 text-center font-medium"
              >
                <Show when={actuallyBoolean(mantrasContained())}>
                  <p class="text-white">
                    {chrome.i18n.getMessage(
                      mantras[
                        Math.floor(Math.random() * mantras.length)
                      ] as Mantra
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
              <Show when={actuallyBoolean(todosContained())}>
                <Popover placement="top-end">
                  <PopoverTrigger
                    as={(props: PopoverTriggerProps) => (
                      <Button
                        variant="outline"
                        class="!bg-transparent text-sm !shadow-none hover:!bg-zinc-700 !border-none !text-white"
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
            style={{
              "justify-content": !layout().includes("-")
                ? "center"
                : layout().endsWith("-left")
                  ? "flex-start"
                  : "flex-end",
            }}
          >
            <div
              class="w-fit max-w-lg select-none text-center"
              style={{
                display: itemsHidden() == "true" ? "none" : "",
                "text-align": layout().startsWith("bottom") ? "left" : "center",
              }}
            >
              <Show
                when={actuallyBoolean(pomodoroContained())}
                fallback={
                  <h1
                    class="m-0 p-0 text-[170px] font-semibold text-white [line-height:1.2]
                      tracking-[-0.06em]"
                    id="nightstandClock"
                  >
                    {clock().time}
                  </h1>
                }
              >
                <div class="flex flex-col items-center justify-center">
                  <h1
                    class="m-0 p-0 text-[170px] font-semibold text-white [line-height:1.2]
                      tracking-[-0.06em]"
                    id="pomodoroClock"
                  >
                    {formatTime(pomodoro().time)}
                  </h1>
                  <p class="m-0 flex items-center gap-2 p-0 text-3xl font-medium text-white tracking-tight">
                    <span>
                      {pomodoro().session == "Work"
                        ? chrome.i18n.getMessage("work")
                        : chrome.i18n.getMessage("break")}
                    </span>
                    <button
                      onmousedown={() =>
                        setPomodoro({
                          ...pomodoro(),
                          playing: !pomodoro().playing,
                        })
                      }
                      title={
                        pomodoro().playing
                          ? chrome.i18n.getMessage("stop")
                          : chrome.i18n.getMessage("start")
                      }
                    >
                      {pomodoro().playing ? (
                        <Pause class="h-6 w-6" fill="currentColor" />
                      ) : (
                        <Play class="h-6 w-6" fill="currentColor" />
                      )}
                    </button>
                  </p>
                  <Show when={name() == ""}>
                    <Show when={actuallyBoolean(dateContained())}>
                      <div class="h-1.25 mt-4 w-full rounded-full bg-black/30 backdrop-blur-3xl"></div>
                    </Show>
                  </Show>
                </div>
              </Show>
              <p class="mt-3 text-3xl font-medium text-white">
                <Show when={name() == ""}>
                  <Show when={actuallyBoolean(dateContained())}>
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
              <Show when={bookmarksContained()}>
                <Show when={safeParse(bookmarksShown(), bookmarksShown())[0]}>
                  <br />
                  <div class="flex gap-2 flex-wrap justify-center">
                    {(
                      safeParse(
                        bookmarksShown(),
                        bookmarksShown()
                      ) as Array<Bookmark>
                    ).map((bookmark, index) => (
                      <a
                        href={bookmark.url}
                        onmousedown={(e) => {
                          e.preventDefault();
                          if (!(e.ctrlKey || e.metaKey)) {
                            window.location.href = bookmark.url;
                          } else {
                            window.open(bookmark.url);
                          }
                        }}
                        class="font-medium text-xl h-[45px] p-4 text-white bg-black/40 backdrop-blur-3xl flex
                          items-center justify-center gap-2 rounded-lg hover:bg-black/60"
                      >
                        <span>{bookmark.name}</span>
                      </a>
                    ))}
                  </div>
                </Show>
              </Show>
              <br />
              <Show when={actuallyBoolean(notepadContained())}>
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
          </div>
        </div>
      </div>
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
      <CommandPalette />
    </main>
  );
};

export default App;
