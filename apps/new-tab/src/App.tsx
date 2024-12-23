import { createEffect, createSignal, createUniqueId, onMount } from "solid-js";
import type { Component } from "solid-js";
import { Button } from "./components/ui/button";
import {
  ArrowRight,
  Check,
  GripVertical,
  Key,
  Plus,
  Settings,
  X,
} from "lucide-solid";
import { createSwapy } from "swapy";
import { v4 as uuidv4 } from "uuid";
import {
  BookmarksWidget,
  ClockWidget,
  DateWidget,
  NatureWidget,
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

type MessageKeys = any;

interface data {
  [key: string]: { message: string };
}

try {
  chrome.i18n.getMessage("work");
} catch (error) {
  let jsonData: data = data;
  window.chrome = {} as any;
  chrome.i18n = {
    getMessage: (message: MessageKeys) => {
      return (jsonData[message] as { message: string }).message;
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

type Widget = "clock" | "date" | "stopwatch" | "todo" | "bookmarks" | "nature";

const App: Component = () => {
  const [needsOnboarding, setNeedsOnboarding] = createSignal(
    localStorage.getItem("onboarding") !== "true",
  );
  const [onboardingScreen, setOnboardingScreen] = createSignal<number>(1);
  const [widgetOrder, setWidgetOrder] = createSignal<any[]>(
    localStorage.getItem("widgetPlacement")
      ? JSON.parse(localStorage.getItem("widgetPlacement") as string)
      : {},
  );
  const [greetingNameValue, setGreetingNameValue] = createSignal("");
  const [imageLoaded, setImageLoaded] = createSignal(false);
  const [count, setCount] = createSignal(0);
  const [filteredWidgets, setFilteredWidgets] = createSignal<any[]>([]);
  const [dialogOpen, setDialogOpen] = createSignal<boolean>(false);
  const [selectedImage, setSelectedImage] = createSignal<string>(
    images[Math.floor(Math.random() * images.length)],
  );
  const [layout, setLayout] = createStoredSignal("layout", "center");
  const [currentFont, setCurrentFont] = createStoredSignal("font", "sans");
  const [background, setBackground] = createStoredSignal("background", "image");
  const [name, setName] = createStoredSignal("name", "");

  const OnboardingScreen1: Component = () => {
    return (
      <div class="fixed inset-0 flex flex-col items-center justify-center gap-6">
        <h1 class="text-7xl font-[600]">
          {chrome.i18n.getMessage("welcome_message")}
        </h1>
        <Button class="group" onclick={() => setOnboardingScreen(2)}>
          {chrome.i18n.getMessage("get_started")}
          <ArrowRight
            class="group-hover:translate-x-1 transition-transform"
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
          <h1 class="text-5xl font-[600] mb-4">
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
              localStorage.setItem("onboarding", "true");
              setNeedsOnboarding(false);
              setName(greetingNameValue());
            }}
          >
            {greetingNameValue()
              ? "Set greeting"
              : chrome.i18n.getMessage("skip")}
            <ArrowRight
              class="group-hover:translate-x-1 transition-transform"
              height={16}
            />
          </Button>
        </div>
      </div>
    );
  };

  const OnboardingFlow: Component = () => {
    return (
      <div class="absolute inset-0 bg-white dark:bg-[#2f2f2f] z-50">
        {onboardingScreen() === 1 && <OnboardingScreen1 />}
        {onboardingScreen() === 2 && <OnboardingScreen2 />}
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
  ];

  function updateFilteredWidgets() {
    const currentWidgets = widgets.filter(
      (item: any) =>
        widgetOrder()[item] !== "" && widgetOrder()[item] !== undefined,
    );
    setFilteredWidgets(currentWidgets);
  }

  createEffect(() => updateFilteredWidgets());

  onMount(() => {
    const container = document.querySelector(".widgets") as HTMLDivElement;

    const swapy = createSwapy(container, {
      animation: "dynamic",
    });

    swapy.onSwap((event) => {
      localStorage.setItem(
        "widgetPlacement",
        JSON.stringify(event.newSlotItemMap.asObject),
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
  });

  function getKeyForValue(obj: any, value: any) {
    return Object.keys(obj).find((key) => obj[key] === value);
  }

  function getKeyByValue<T extends Record<string, any>>(
    obj: T,
    value: T[keyof T],
  ): string | undefined {
    return Object.keys(obj).find((key) => obj[key] === value);
  }

  function Block(props: { title: string; description: string; key: Widget }) {
    return (
      <div class="flex justify-between items-center">
        <div class="info">
          <h1>{props.title}</h1>
          <p class="text-sm text-muted-foreground">{props.description}</p>
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
                newWidgetOrder[props.key] = props.key;
              }
              setWidgetOrder(newWidgetOrder);
              localStorage.setItem(
                "widgetPlacement",
                JSON.stringify(newWidgetOrder),
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
      )}
    >
      {needsOnboarding() && <OnboardingFlow />}
      {background() === "image" && (
        <img
          src={selectedImage()}
          alt=""
          class="absolute inset-0 w-full h-full object-cover transition-all"
          style={{ opacity: 0 }}
          onLoad={(e: any) => {
            if (document.documentElement.style.colorScheme === "dark") {
              e.target.style.opacity = 0.8;
            } else {
              e.target.style.opacity = 1;
              e.target.style.filter = "brightness(0.8)";
            }
            setImageLoaded(true);
          }}
        />
      )}
      <div
        class={cn(
          "fixed overflow-hidden p-4 inset-0",
          imageLoaded() ? "" : "bg-white dark:bg-[#1f1f1f]",
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
            "absolute top-0 w-full h-full blob-gradient opacity-50 dark:opacity-20 blob-gradient z-20 dark:hidden",
            imageLoaded() ? "hidden" : "",
          )}
          style={{
            display: background() != "image" ? "none" : "",
          }}
        ></div>
        <div
          class="h-screen gap-3 flex-wrap justify-center items-center z-30 absolute inset-0 p-4"
          style={{
            "align-content": layout() == "center" ? "center" : "flex-start",
            "padding-top": layout() == "top" ? "2.5rem" : "0",
          }}
        >
          <h1
            id="greeting"
            class="mb-6 text-5xl font-bold inset-shadow-2xl [text-shadow:_0_10px_0_var(--tw-shadow-color)]"
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
            Good{" "}
            {new Date().getHours() < 12
              ? new Date().getHours() >= 5
                ? "morning"
                : "night"
              : new Date().getHours() < 18
                ? "afternoon"
                : "evening"}
            , {name()}.
          </h1>
          <div
            class={cn(
              "widgets m-0 grid [grid-template-columns:repeat(auto-fill,400px)] [grid-template-rows:repeat(auto-fill,150px)] gap-3 p-4",
              layout() == "center" &&
                "xl:[grid-template-columns:repeat(3,400px)]",
              layout() == "center" && "justify-center",
              layout() == "top" && "!pl-8",
            )}
          >
            {filteredWidgets().length > 0 ? (
              filteredWidgets().map((item: any) => (
                <div class={`${uuidv4()} slot h-fit`} data-swapy-slot={item}>
                  <div
                    class="widget group"
                    data-swapy-item={widgetOrder()[item]}
                  >
                    {widgetOrder()[item] === "clock" && <ClockWidget />}
                    {widgetOrder()[item] === "date" && <DateWidget />}
                    {widgetOrder()[item] === "todo" && <TodoWidget />}
                    {widgetOrder()[item] === "stopwatch" && <StopwatchWidget />}
                    {widgetOrder()[item] === "bookmarks" && <BookmarksWidget />}
                    {widgetOrder()[item] === "nature" && <NatureWidget />}
                    <button
                      class="absolute -top-2 -right-2 hidden group-hover:block bg-white hover:bg-white/90 shadow-sm size-[24px] justify-center items-center !rounded-full"
                      onclick={(e) => {
                        const newWidgetOrder = widgetOrder();
                        delete newWidgetOrder[item];
                        setWidgetOrder(newWidgetOrder);
                        e.target.parentElement?.parentElement?.remove();
                        localStorage.setItem(
                          "widgetPlacement",
                          JSON.stringify(newWidgetOrder),
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
      </div>
      <div class="fixed top-2 right-2 text-white flex justify-center items-center rounded-full gap-2">
        <SettingsTrigger />
        <Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
          <DialogTrigger class="group" aria-label="Add widget">
            <Plus class="group-hover:rotate-45 transition-transform" />
          </DialogTrigger>
          <DialogContent>
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
                title="Nature"
                description="Listen to nature soundscapees with this widget."
                key="nature"
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
      </div>
    </main>
  );
};

export default App;
