import { createEffect, createSignal, createUniqueId, onMount } from "solid-js";
import type { Component } from "solid-js";
import { Button } from "./components/ui/button";
import { ArrowRight, Check, GripVertical, Key, Plus, X } from "lucide-solid";
import { createSwapy } from "swapy";
import { v4 as uuidv4 } from "uuid";
import {
  ClockWidget,
  DateWidget,
  StopwatchWidget,
  TodoWidget,
} from "./Widgets";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import data from "../public/_locales/en/messages.json";

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
  const [count, setCount] = createSignal(0);
  const [filteredWidgets, setFilteredWidgets] = createSignal<any[]>([]);
  const [dialogOpen, setDialogOpen] = createSignal<boolean>(false);

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
            {chrome.i18n.getMessage("resources")}
          </h1>
          <p class="w-[280px] text-left mb-4">
            If you need any help setting up Flowtide, check out our{" "}
            <a href="https://docs.flowtide.app" class="hover:underline">
              documentation
            </a>{" "}
            or ask me for help on{" "}
            <a
              class="hover:underline"
              href="https://github.com/thingbomb/flowtide/discussions"
            >
              GitHub discussions
            </a>
            .
          </p>
          <Button
            class="group"
            onclick={() => {
              localStorage.setItem("onboarding", "true");
              setNeedsOnboarding(false);
            }}
          >
            {chrome.i18n.getMessage("start_using")}
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

  const widgets = ["clock", "date", "todo", "stopwatch"];

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

  function Block(props: any) {
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
              const newWidgetOrder = widgetOrder();
              if (newWidgetOrder[props.key]) {
                newWidgetOrder[props.key] = undefined;
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
    <main>
      {needsOnboarding() && <OnboardingFlow />}
      <div class="fixed overflow-hidden p-4 inset-0 bg-white dark:bg-[#1f1f1f]">
        <div class="absolute top-0 w-full h-full blob-gradient opacity-50 dark:opacity-20 blob-gradient z-20 dark:hidden"></div>
        <div class="widgets m-0 grid [grid-template-columns:repeat(auto-fill,400px)] [grid-template-rows:repeat(auto-fill,150px)] gap-3 flex-wrap z-30 absolute inset-0 p-4">
          {filteredWidgets().length > 0 ? (
            filteredWidgets().map((item: any) => (
              <div class={`${uuidv4()} slot h-fit`} data-swapy-slot={item}>
                <div class="widget group" data-swapy-item={widgetOrder()[item]}>
                  {widgetOrder()[item] === "clock" && <ClockWidget />}
                  {widgetOrder()[item] === "date" && <DateWidget />}
                  {widgetOrder()[item] === "todo" && <TodoWidget />}
                  {widgetOrder()[item] === "stopwatch" && <StopwatchWidget />}
                  <button
                    class="absolute -top-2 -right-2 hidden group-hover:block bg-white shadow-sm size-[24px] justify-center items-center !rounded-full"
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
            <section>
              <div class="fallback">
                You don't have any widgets. Add one to get started.
              </div>
            </section>
          )}
        </div>
      </div>
      <Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
        <DialogTrigger class="!cursor-default fixed top-2 right-2">
          <button aria-label="Add a new widget">
            <Plus />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{chrome.i18n.getMessage("blocks")}</DialogTitle>
            <DialogDescription>
              {chrome.i18n.getMessage("blocks_description")}
            </DialogDescription>
            <br />
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
    </main>
  );
};

export default App;
