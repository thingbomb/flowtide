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
  DateWidget,
  FocusSoundscapes,
  NatureWidget,
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
  | "ambience";

type Bookmark = {
  name: string;
  url: string;
};

const App: Component = () => {
  function createTime(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return {
      time: `${formattedHours}:${formattedMinutes}`,
      amPm: amPm,
    };
  }
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
  const [selectedImage, setSelectedImage] = createSignal<string>(
    localStorage.getItem("selectedImage") ||
      images[Math.floor(Math.random() * images.length)]
  );
  const [layout, setLayout] = createStoredSignal("layout", "center");
  const [currentFont, setCurrentFont] = createStoredSignal("font", "sans");
  const [background, setBackground] = createStoredSignal("background", "image");
  const [name, setName] = createStoredSignal("name", "");
  const [mode, setMode] = createStoredSignal("mode", "widgets");
  const [time, setTime] = createSignal(`${createTime(new Date()).time}`);
  const [bookmarks, setBookmarks] = createSignal<any[]>([]);
  const [pageTitle, setPageTitle] = createStoredSignal("pageTitle", "");
  const [textStyle, setTextStyle] = createStoredSignal("textStyle", "normal");
  const [opacity, setOpacity] = createStoredSignal("opacity", "0.8");
  const [wallpaperBlur, setWallpaperBlur] = createStoredSignal<number>(
    "wallpaperBlur",
    0
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
      document.getElementById("wallpaper")!.style.filter =
        `blur(${Number(wallpaperBlur()) / 10}px)`;
    }
  }, [wallpaperBlur]);

  createEffect(() => {
    if (Number(opacity()) > 0) {
      document.getElementById("wallpaper")!.style.opacity = opacity();
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
          <div class="**:data-selected:!ring-primary grid w-full grid-cols-1 grid-rows-3 gap-4">
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
      let newImage = images[Math.floor(Math.random() * images.length)];
      localStorage.setItem("selectedImage", newImage);
      fetch(newImage, {
        mode: "no-cors",
        headers: {
          "Cache-Control": "public, max-age=315360000, immutable",
        },
      });
    }

    setInterval(() => {
      setTime(createTime(new Date()).time);
    }, 1000);
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
                      newWidgetOrder[key] = key;
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
        `font-${currentFont()}`,
        imageLoaded() ? "bg-black dark:bg-none" : "",
        textStyle() == "uppercase" ? "**:!uppercase" : "",
        textStyle() == "lowercase" ? "**:lowercase" : ""
      )}
    >
      {needsOnboarding() && <OnboardingFlow />}
      {background() === "image" && (
        <img
          src={selectedImage()}
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
          class={cn(
            "blob-gradient blob-gradient absolute top-0 z-20 h-full w-full opacity-50 dark:hidden dark:opacity-20",
            imageLoaded() ? "hidden" : ""
          )}
          style={{
            display: background() != "image" ? "none" : "",
          }}
        ></div>
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
                  filteredWidgets().map((item: any) => (
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
                        {widgetOrder()[item] == "todo" && (
                          <button
                            class="absolute -top-2 right-5 hidden size-[24px] !cursor-move items-center justify-center !rounded-full bg-white shadow-sm hover:bg-white/90 group-hover:block"
                            data-swapy-handle
                          >
                            <GripVertical height={16} class="text-black" />
                          </button>
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
                  ))
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
                  {time()}
                </h1>
                <p class="mt-3 pl-2 text-3xl font-medium">
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
      <div class="dark:bg-red/5 group fixed right-2 top-2 flex flex-row-reverse items-center justify-center rounded-full bg-gray-400 p-1 px-2 text-white shadow-inner shadow-white/10 transition-all focus-within:gap-2 hover:gap-2 dark:bg-gray-600/95">
        <button class="peer group-hover:hidden">
          <Menu />
        </button>
        <div
          class="hidden group-focus-within:flex group-hover:flex peer-hover:!flex peer-focus:!flex"
          title="Add widget"
        >
          {mode() === "widgets" && (
            <Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
              <DialogTrigger aria-label="Add widget">
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
                    title="Bookmarks"
                    description="Easy access to your first 9 bookmarks with this widget."
                    key="bookmarks"
                  />
                  <Block
                    title="Pomodoro"
                    description="Use the pomodoro technique for an interval-based workflow."
                    key="pomodoro"
                  />
                  <Block
                    title="Nature"
                    description="Listen to nature soundscapees with this widget."
                    key="nature"
                  />
                  <Block
                    title="Focus Sounds"
                    description="Soundscapes to help you focus."
                    key="focus"
                  />
                  <Block
                    title="Ambience Sounds"
                    description="Ambient soundscapes to help you relax."
                    key="ambience"
                  />
                  <Block
                    title="To-do list"
                    description="Track your todos with an easy widget."
                    key="todo"
                  />
                  <Block
                    title="Stopwatch"
                    description="Add a stopwatch widget to your start page."
                    key="stopwatch"
                  />
                  <Block
                    title="Clock"
                    description="Adds a clock widget to your start page."
                    key="clock"
                  />
                  <Block
                    title="Date"
                    description="A sleek date widget that shows you the current date."
                    key="date"
                  />
                  <Block
                    title="To-do list"
                    description="Track your todos with an easy widget."
                    key="todo"
                  />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div title="Settings">
          <SettingsTrigger triggerClass="hidden group-hover:flex peer-hover:!flex peer-focus:!flex group-focus-within:flex" />
        </div>
        <button
          class="hidden group-hover:flex peer-hover:!flex"
          title={itemsHidden() == "true" ? "Show items" : "Hide items"}
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
              ? "Start background changes"
              : "Pause background changes"
          }
          onclick={() => {
            if (backgroundPaused() == "true") {
              setBackgroundPaused("false");
            } else {
              localStorage.setItem(
                "selectedImage",
                (document.getElementById("wallpaper") as HTMLImageElement).src
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
