import { createEffect, createSignal, createUniqueId, onMount } from "solid-js";
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
  Key,
  Menu,
  Pause,
  Play,
  Plus,
  Settings,
  X,
} from "lucide-solid";
import { createSwapy } from "swapy";
import { v4 as uuidv4 } from "uuid";
import {
  AmbienceSoundscapes,
  BookmarksWidget,
  ClockWidget,
  CounterWidget,
  DateWidget,
  FocusSoundscapes,
  NatureWidget,
  NotepadWidget,
  PomodoroWidget,
  StopwatchWidget,
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
import { number } from "mathjs";
import { formattedClock } from "./hooks/clockFormatter";

type MessageKeys = keyof typeof data;

interface Data {
  [key: string]: { message: string };
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
  | "counter";

type Bookmark = {
  name: string;
  url: string;
};

const App: Component = () => {
  const [needsOnboarding, setNeedsOnboarding] = createSignal(
    localStorage.getItem("onboarding") !== "true"
  );
  const [onboardingScreen, setOnboardingScreen] = createSignal<number>(1);
  const [widgetOrder, setWidgetOrder] = createSignal<any[]>(
    localStorage.getItem("widgetPlacement")
      ? JSON.parse(localStorage.getItem("widgetPlacement") as string)
      : {}
  );
  const [greetingNameValue, setGreetingNameValue] = createSignal("");
  const [imageLoaded, setImageLoaded] = createSignal(false);
  const [count, setCount] = createSignal(0);
  const [filteredWidgets, setFilteredWidgets] = createSignal<any[]>([]);
  const [dialogOpen, setDialogOpen] = createSignal<boolean>(false);
  const [pageIcon, setPageIcon] = createStoredSignal("pageIcon", "");
  const [pageIconURL, setPageIconURL] = createStoredSignal(
    "iconUrl",
    "assets/logo.png"
  );
  const [dateFormat, setDateFormat] = createStoredSignal(
    "dateFormat",
    "normal"
  );
  const [layout, setLayout] = createStoredSignal("layout", "center");
  const [currentFont, setCurrentFont] = createStoredSignal("font", "sans");
  const [background, setBackground] = createStoredSignal("background", "image");
  const [name, setName] = createStoredSignal("name", "");
  const [mode, setMode] = createStoredSignal("mode", "widgets");
  const [bookmarks, setBookmarks] = createSignal<any[]>([]);
  const [pageTitle, setPageTitle] = createStoredSignal("pageTitle", "");
  const [textStyle, setTextStyle] = createStoredSignal("textStyle", "normal");
  const [opacity, setOpacity] = createStoredSignal("opacity", "0.8");
  const [wallpaperBlur, setWallpaperBlur] = createStoredSignal<number>(
    "wallpaperBlur",
    0
  );
  const [wallpaperChangeTime, setWallpaperChangeTime] =
    createStoredSignal<number>("wallpaperChangeTime", 1000 * 60 * 60 * 24 * 7);
  const clock = formattedClock();
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
      return JSON.stringify({
        url: images[Math.floor(Math.random() * images.length)],
        expiry: Date.now() + Number(wallpaperChangeTime()),
      });
    }

    // fallback value
    return {
      url: images[Math.floor(Math.random() * images.length)],
      expiry: Date.now() + Number(wallpaperChangeTime()),
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
  });
  createEffect(() => {
    if (pageTitle()) {
      document.title = pageTitle();
    }
  }, [pageTitle]);

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
      <div class="fixed inset-0 flex flex-col items-center justify-center gap-6">
        <h1 class="text-7xl font-[600]">
          {chrome.i18n.getMessage("welcome_message")}
        </h1>
        <Button class="group" onclick={() => setOnboardingScreen(2)}>
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
            />
          </TextFieldRoot>
          <br />
          <Button
            class="group"
            onclick={() => {
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
          <div class="**:data-selected:!ring-primary grid w-full grid-cols-1 grid-rows-3 gap-2">
            <button
              class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 flex h-[78px] w-full cursor-pointer items-center gap-2 overflow-hidden rounded-xl border-gray-950/10 pl-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
              {...(mode() === "widgets" ? { "data-selected": true } : {})}
              onClick={() => {
                setMode("widgets");
              }}
            >
              <Grid class="size-[32px]" />
              <br />
              <span class="text-xl">{chrome.i18n.getMessage("widgets")}</span>
            </button>
            <button
              class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 flex h-[78px] w-full cursor-pointer items-center gap-2 overflow-hidden rounded-xl border-gray-950/10 pl-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
              {...(mode() === "nightstand" ? { "data-selected": true } : {})}
              onClick={() => {
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
              class="card not-prose dark:bg-background-dark border-1 hover:!border-primary dark:hover:!border-primary-light group relative my-2 flex h-[78px] w-full cursor-pointer items-center gap-2 overflow-hidden rounded-xl border-gray-950/10 pl-8 text-left font-normal ring-2 ring-transparent dark:border-white/10"
              {...(mode() === "speeddial" ? { "data-selected": true } : {})}
              onClick={() => {
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
            onclick={() => {
              localStorage.setItem("onboarding", "true");
              setNeedsOnboarding(false);
              setName(greetingNameValue());
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
      <div class="absolute inset-0 z-50 bg-white dark:bg-[#2f2f2f]">
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
    if (mode() === "widgets") {
      const container = document.querySelector(".widgets") as HTMLDivElement;

      const swapy = createSwapy(container, {
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
        let newImage = {
          url: images[Math.floor(Math.random() * images.length)],
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
        localStorage.setItem(
          "selectedImage",
          JSON.stringify({
            url: images[Math.floor(Math.random() * images.length)],
            expiry: Date.now() + Number(wallpaperChangeTime()),
          })
        );
      }
    }

    if (mode() === "nightstand") {
      setInterval(() => {
        if (document.getElementById("twelve-clock") !== null) {
          document.getElementById("twelve-clock")!.textContent =
            dateFormat() == "normal"
              ? [
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ][new Date().getDay()]
              : [
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
                  .concat(" ")
                  .concat(new Date().getDate().toString().padStart(2, "0"));
        }

        if (document.getElementById("day") !== null) {
          document.getElementById("day")!.textContent = String(
            dateFormat() == "normal"
              ? new Date().getDate()
              : new Date().toISOString().split("T")[0]
          );
        }
      }, 1000);
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
          <h1>{props.title}</h1>
          <p class="text-muted-foreground text-sm">{props.description}</p>
        </div>
        <div class="add">
          <Button
            class="group w-[100px]"
            onclick={() => {
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
        `font-mono`,
        `font-serif`,
        `font-sans`,
        `font-comic-sans`,
        `transition-all`,
        `font-${currentFont()}`,
        imageLoaded() ? "bg-black dark:bg-none" : "",
        textStyle() == "uppercase" ? "**:!uppercase" : "",
        textStyle() == "lowercase" ? "**:lowercase" : ""
      )}
    >
      {needsOnboarding() && <OnboardingFlow />}
      {background() === "image" && (
        <img
          src={
            typeof selectedImage() === "object"
              ? selectedImage().url
              : JSON.parse(selectedImage()).url
          }
          alt=""
          id="wallpaper"
          class="absolute inset-0 h-full w-full object-cover transition-all"
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
      )}
      <div
        class={cn(
          "fixed inset-0 overflow-hidden p-4",
          imageLoaded() ? "" : "bg-white dark:bg-[#1f1f1f]"
        )}
        style={{
          background:
            background() === "solid-color"
              ? colorPalette[Math.floor(Math.random() * colorPalette.length)]
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
            display: itemsHidden() == "true" ? "none" : "",
          }}
        >
          {mode() === "widgets" && (
            <div>
              <h1
                id="greeting"
                class="inset-shadow-2xl mb-6 text-5xl font-bold [text-shadow:_0_10px_0_var(--tw-shadow-color)]"
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
                  "widgets m-0 grid gap-3 p-4 [grid-template-columns:repeat(auto-fill,400px)] [grid-template-rows:repeat(auto-fill,150px)]",
                  layout() == "center" &&
                    "xl:[grid-template-columns:repeat(3,400px)]",
                  layout() == "center" && "justify-center",
                  layout() == "top" && "!pl-8"
                )}
              >
                {filteredWidgets().length > 0 ? (
                  filteredWidgets().map((item: any) => {
                    console.log(item);
                    return (
                      <div
                        class={`${uuidv4()} slot group h-fit`}
                        data-swapy-slot={item}
                      >
                        <div
                          class="widget group"
                          data-swapy-item={widgetOrder()[item]}
                        >
                          {widgetOrder()[item] === "clock" && <ClockWidget />}
                          {widgetOrder()[item] === "date" && <DateWidget />}
                          {widgetOrder()[item] === "todo" && <TodoWidget />}
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
                              class="absolute -top-2 right-5 hidden size-[24px] !cursor-move items-center justify-center !rounded-full bg-white p-0.5 text-black shadow-sm hover:bg-white/90 group-hover:block"
                            />
                          )}
                          {widgetOrder()[item] == "notepad" && (
                            <GripVertical
                              data-swapy-handle
                              height={16}
                              class="absolute -top-2 right-5 hidden size-[24px] !cursor-move items-center justify-center !rounded-full bg-white p-0.5 text-black shadow-sm hover:bg-white/90 group-hover:block"
                            />
                          )}
                          {widgetOrder()[item] == "counter" && (
                            <GripVertical
                              data-swapy-handle
                              height={16}
                              class="absolute -top-2 right-5 hidden size-[24px] !cursor-move items-center justify-center !rounded-full bg-white p-0.5 text-black shadow-sm hover:bg-white/90 group-hover:block"
                            />
                          )}
                          <button
                            class="absolute -right-2 -top-2 hidden size-[24px] items-center justify-center !rounded-full bg-white shadow-sm hover:bg-white/90 group-focus-within:block group-hover:block"
                            onclick={(e) => {
                              const newWidgetOrder = widgetOrder();
                              delete newWidgetOrder[item];
                              setWidgetOrder(newWidgetOrder);
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
            <div class="flex items-center justify-center">
              <div class="w-full max-w-lg select-none">
                <h1 class="m-0 p-0 text-[200px] font-bold [line-height:1.2]">
                  {clock().time + clock().amPm}
                </h1>
                <p class="mt-3 pl-2 text-3xl font-medium">
                  {dateFormat() == "normal" ? (
                    <span id="twelve-clock">
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
                    <span id="day">
                      {new Date().toISOString().split("T")[0]}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
          {mode() === "speeddial" && (
            <div class="flex flex-col items-center justify-center gap-2">
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
                        class="overflow-hidden text-ellipsis whitespace-nowrap text-[28px] font-medium text-white"
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
      <div class="group fixed right-2 top-2 flex flex-row-reverse items-center justify-center rounded-full bg-white p-1 px-2 text-black shadow-inner shadow-black/20 focus-within:gap-2 hover:gap-2 dark:bg-black/95 dark:text-white dark:shadow-white/10">
        <button
          class="peer group-hover:hidden"
          title={chrome.i18n.getMessage("settings")}
        >
          <Menu />
        </button>
        <div
          class="hidden group-focus-within:flex group-hover:flex peer-hover:!flex peer-focus:!flex"
          title={chrome.i18n.getMessage("add_widget")}
        >
          {mode() === "widgets" && (
            <Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
              <DialogTrigger aria-label={chrome.i18n.getMessage("add_widget")}>
                <Plus class="transition-transform" />
              </DialogTrigger>
              <DialogContent
                class={cn(
                  textStyle() == "uppercase" ? "**:!uppercase" : "",
                  textStyle() == "lowercase" ? "**:lowercase" : ""
                )}
              >
                <DialogHeader>
                  <DialogTitle>{chrome.i18n.getMessage("blocks")}</DialogTitle>
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
                    description={chrome.i18n.getMessage("pomodoro_description")}
                    key="pomodoro"
                  />
                  <Block
                    title={chrome.i18n.getMessage("nature_sounds")}
                    description={chrome.i18n.getMessage("nature_description")}
                    key="nature"
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
                  <Block
                    title={chrome.i18n.getMessage("clock")}
                    description={chrome.i18n.getMessage("clock_description")}
                    key="clock"
                  />
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
                    description={chrome.i18n.getMessage("notepad_description")}
                    key="notepad"
                  />
                  <Block
                    title={chrome.i18n.getMessage("counter")}
                    description={chrome.i18n.getMessage("counter_description")}
                    key="counter"
                  />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div title={chrome.i18n.getMessage("settings")}>
          <SettingsTrigger triggerClass="hidden group-hover:flex peer-hover:!flex peer-focus:!flex group-focus-within:flex" />
        </div>
        <button
          class="hidden group-hover:flex peer-hover:!flex"
          title={
            itemsHidden() == "true"
              ? chrome.i18n.getMessage("show_items")
              : chrome.i18n.getMessage("hide_items")
          }
          onclick={() => {
            setItemsHidden(itemsHidden() == "true" ? "false" : "true");
          }}
        >
          {itemsHidden() == "true" ? <EyeOff /> : <Eye />}
        </button>
        <button
          class="hidden group-focus-within:flex group-hover:flex peer-hover:!flex peer-focus:!flex"
          title={
            backgroundPaused() == "true"
              ? chrome.i18n.getMessage("start_background_changes")
              : chrome.i18n.getMessage("pause_background_changes")
          }
          onclick={() => {
            if (backgroundPaused() == "true") {
              setBackgroundPaused("false");
            } else {
              localStorage.setItem(
                "selectedImage",
                JSON.stringify({
                  url: (
                    document.getElementById("wallpaper") as HTMLImageElement
                  ).src,
                  expiry: Infinity,
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
        <CommandPalette />
      </div>
    </main>
  );
};

export default App;
