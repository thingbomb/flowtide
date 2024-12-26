import { createSignal, onMount } from "solid-js";
import { Checkbox, CheckboxControl } from "./components/ui/checkbox";
import { Button } from "./components/ui/button";
import { TextField, TextFieldRoot } from "./components/ui/textfield";
import soundscapes, { Category } from "./soundscapes";
import { Pause, Play } from "lucide-solid";
import { createStoredSignal } from "./hooks/localStorage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

function ClockWidget() {
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
  onMount(() => {
    let interval: any;
    interval = setInterval(() => {
      try {
        document.getElementById("currentTime")!.textContent = createTime(
          new Date(),
        ).time;
      } catch (e) {
        clearInterval(interval);
      }
    }, 1000);
  });
  return (
    <div class="absolute inset-0 p-[10px] bg-black rounded-[20px] !select-none">
      <div class="bg-zinc-900 rounded-[10px] w-full h-full flex justify-center items-center relative">
        <div class="self-start absolute w-full text-gray-400 flex justify-between px-3.5 py-2.5 text-xs font-semibold">
          <div id="amPm">{createTime(new Date()).amPm}</div>
        </div>
        <div class="text-center text-5xl text-white font-bold" id="currentTime">
          {createTime(new Date()).time}
        </div>
      </div>
    </div>
  );
}

function DateWidget() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
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
  ];
  onMount(() => {
    let interval: any;
    interval = setInterval(() => {
      try {
        document.getElementById("day")!.textContent = String(
          new Date().getDate(),
        );
        document.getElementById("month")!.textContent =
          months[new Date().getMonth()];
        document.getElementById("year")!.textContent = String(
          new Date().getFullYear(),
        );
      } catch (e) {
        clearInterval(interval);
      }
    }, 1000);
  });
  return (
    <div class="absolute inset-0 p-[10px] bg-white rounded-[20px] !select-none">
      <div class="bg-gray-200 rounded-[10px] w-full h-full">
        <div class="relative h-full w-full bg-gray-200 rounded-[10px] flex items-center justify-center">
          <div class="self-start absolute w-full text-gray-400 flex justify-between px-3.5 py-2.5 text-xs font-semibold">
            <div id="month">{months[new Date().getMonth()]}</div>
            <div id="year">{new Date().getFullYear()}</div>
          </div>
          <div class="text-center text-5xl text-black font-bold" id="day">
            {new Date().getDate()}
          </div>
        </div>
      </div>
    </div>
  );
}

function TodoWidget() {
  interface Task {
    completed: boolean;
    title: string;
  }
  const [tasks, setTasks] = createSignal<Task[]>(
    localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks") as string)
      : [
          { completed: false, title: "Task 1" },
          { completed: false, title: "Task 2" },
        ],
  );
  const [taskInputValue, setTaskInputValue] = createSignal("");
  return (
    <div class="absolute inset-0 p-[10px] pb-0 bg-white rounded-[20px] overflow-hidden">
      <div class="rounded-[10px] w-full h-full">
        <div class="relative h-full w-full bg-white rounded-[10px] pt-2">
          <div class="overflow-auto max-h-[84px] scrollbar-hidden">
            <div
              class="text-left text-xl text-teal-700 font-bold px-3.5 select-none"
              id="title"
            >
              To-do list
            </div>
            <div id="tasks" class="px-3.5 mt-2">
              {tasks()
                .filter((task: Task) => !task.completed)
                .map((task: Task, index: number) => (
                  <div class="flex gap-2 items-center task">
                    <Checkbox
                      id={String(index)}
                      onChange={(checked: boolean) => {
                        setTasks(
                          tasks().map((t: Task, i: number) =>
                            i === tasks().indexOf(task)
                              ? { ...t, completed: checked }
                              : t,
                          ),
                        );
                        setTasks(tasks().filter((t: Task) => !t.completed));
                        localStorage.setItem("tasks", JSON.stringify(tasks()));
                      }}
                    >
                      <CheckboxControl />
                    </Checkbox>
                    <label
                      for={`${String(index)}-input`}
                      class="text-sm text-black"
                    >
                      {task.title}
                    </label>
                  </div>
                ))}
            </div>
          </div>
          <div class="absolute bottom-0 right-0 left-0 pr-3.5 flex gap-4 pb-[10px] bg-white">
            <TextFieldRoot class="flex-1">
              <TextField
                class="!border-none !outline-none !ring-0 !text-black shadow-none"
                placeholder="New task"
                value={taskInputValue()}
                onInput={(e) => setTaskInputValue(e.currentTarget.value)}
                onKeyDown={(e: KeyboardEvent) => {
                  if (e.key === "Enter") {
                    setTasks([
                      ...tasks(),
                      { completed: false, title: taskInputValue() },
                    ]);
                    setTaskInputValue("");
                    localStorage.setItem("tasks", JSON.stringify(tasks()));
                  }
                }}
              />
            </TextFieldRoot>
            <Button
              onclick={() => {
                setTasks([
                  ...tasks(),
                  { completed: false, title: taskInputValue() },
                ]);
                setTaskInputValue("");
                localStorage.setItem("tasks", JSON.stringify(tasks()));
              }}
              class="!text-white !bg-teal-600 hover:!bg-teal-700/90"
            >
              Add task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StopwatchWidget() {
  const [playing, setPlaying] = createSignal(false);
  const [time, setTime] = createSignal(0);

  function formatTime(time: number) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(
        2,
        "0",
      )}:${Math.floor(Number(seconds.toString())).toString().padStart(2, "0")}`;
  }

  onMount(() => {
    let interval: any;
    interval = setInterval(() => {
      if (playing()) {
        setTime(time() + 1);
      }
    }, 1000);
  });

  return (
    <div class="absolute inset-0 p-[10px] pb-0 bg-background text-foreground rounded-[20px] overflow-hidden">
      <div class="rounded-[10px] w-full h-full flex justify-center items-center flex-col gap-2 select-none">
        {formatTime(time())}
        <div class="text-sm text-gray-400 flex gap-2">
          <Button
            variant={"outline"}
            onclick={() => {
              setPlaying(false);
              setTime(0);
            }}
          >
            Reset
          </Button>
          <Button onclick={() => setPlaying(!playing())}>
            {playing() ? "Stop" : "Start"}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface Bookmark {
  name: string;
  url: string;
}

function BookmarksWidget() {
  const [bookmarks, setBookmarks] = createSignal<any[]>([]);
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
  return (
    <div class="absolute inset-0 p-[10px] pb-0 bg-white rounded-[20px] overflow-hidden">
      <div class="rounded-[10px] w-full h-full">
        <div class="relative h-full w-full bg-white rounded-[10px] pt-2">
          <div class="overflow-auto scrollbar-hidden">
            <div
              class="text-left text-xl text-cyan-700 font-bold px-3.5 select-none"
              id="title"
            >
              Bookmarks
            </div>
            <div
              id="bookmarks"
              class="px-3.5 mt-2 grid grid-cols-3 grid-rows-3 gap-2"
            >
              {bookmarks()
                .slice(0, 9)
                .map((bookmark: Bookmark, index: number) => (
                  <div class="flex gap-2 items-center bookmark">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      class="text-[17px] text-black whitespace-nowrap overflow-hidden text-ellipsis font-medium"
                    >
                      {bookmark.name}
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NatureWidget() {
  const [currentlyPlaying, setCurrentlyPlaying] = createSignal<any>(null);
  function PlayButton({ key, index }: { key: string; index: number }) {
    return (
      <button
        class="text-black font-bold !rounded-full size-[30px] flex justify-center items-center"
        onclick={() => {
          if (currentlyPlaying() == index) {
            setCurrentlyPlaying(null);
            (document.getElementById("audio") as HTMLAudioElement)?.load();
          } else {
            setCurrentlyPlaying(index);
            (document.getElementById("audio") as HTMLAudioElement)?.load();
          }
        }}
      >
        {currentlyPlaying() == index ? (
          <Pause height={20} fill="black" />
        ) : (
          <Play height={20} fill="black" />
        )}
      </button>
    );
  }

  return (
    <div class="absolute inset-0 p-[10px] pb-0 bg-white rounded-[20px] overflow-hidden">
      <div class="rounded-[10px] w-full h-full">
        <div class="relative h-full w-full bg-white rounded-[10px] pt-2">
          <div class="overflow-auto scrollbar-hidden">
            <div
              class="text-left text-xl text-green-700 font-bold px-3.5 select-none"
              id="title"
            >
              Nature
            </div>
            <div
              id="soundscapes"
              class="grid grid-cols-3 grid-rows-2 gap-2 p-3.5"
            >
              {soundscapes
                .filter((soundscape) =>
                  soundscape.categories.includes("nature"),
                )
                .map((soundscape, index: number) => (
                  <div class="flex gap-2 items-center soundscape">
                    <div class="flex gap-2 items-center">
                      <div class="flex gap-2 items-center">
                        <div class="flex items-center gap-2">
                          <PlayButton
                            key={soundscape.name}
                            index={soundscape.index}
                          />
                          <div class="text-[17px] text-black whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                            {soundscape.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <audio
              src={soundscapes[currentlyPlaying()]?.url}
              id="audio"
              autoplay
              loop
            ></audio>
          </div>
        </div>
      </div>
    </div>
  );
}

function PomodoroWidget() {
  const [workMinutes, setWorkMinutes] = createStoredSignal("workMinutes", 30);
  const [breakMinutes, setBreakMinutes] = createStoredSignal("breakMinutes", 5);
  const [pomodoro, setPomodoro] = createSignal(workMinutes() * 60);
  const [pomodoroSession, setPomodoroSession] = createSignal("work");
  const [isRunning, setIsRunning] = createSignal(false);
  const [dialogOpen, setDialogOpen] = createSignal(false);

  function formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${Math.floor(
      Number(seconds.toString()),
    )
      .toString()
      .padStart(2, "0")}`;
  }

  onMount(() => {
    let interval: any;
    interval = setInterval(() => {
      if (isRunning()) {
        setPomodoro(pomodoro() - 1);
        document.title = `${pomodoroSession() == "work" ? "Work" : "Break"} - ${formatTime(
          pomodoro(),
        )}`;
        if (pomodoro() <= 0) {
          if (pomodoroSession() == "work") {
            setPomodoroSession("break");
            setPomodoro(breakMinutes() * 60);
          } else {
            setPomodoroSession("work");
            setPomodoro(workMinutes() * 60);
          }
        }
      } else {
        document.title = "New Tab";
      }
    }, 1000);
  });

  return (
    <div class="absolute inset-0 p-[10px] bg-white dark:bg-[#2f2f2f] rounded-[20px] overflow-hidden">
      <div class="rounded-[10px] w-full h-full">
        <div class="relative h-full w-full bg-white dark:bg-[#2f2f2f] rounded-[10px] pt-2">
          <div class="overflow-auto scrollbar-hidden">
            <div
              class="text-left text-xl text-teal-700 dark:text-blues-400 font-bold px-3.5 select-none"
              id="title"
            >
              {isRunning()
                ? pomodoroSession() == "work"
                  ? "Work"
                  : "Break"
                : "Pomodoro"}
            </div>
            <div class="px-3.5 mt-2">
              <h1 class="text-xl text-black dark:text-white font-bold">
                {formatTime(pomodoro())}
              </h1>
              <div class="flex gap-4 items-center mt-3">
                <Button
                  onclick={() => {
                    setIsRunning(!isRunning());
                  }}
                >
                  {isRunning() ? "Stop" : "Start"}
                </Button>
                <Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
                  <DialogTrigger
                    class="group text-sm flex justify-center items-center h-[36px] font-medium select-none"
                    aria-label="Add widget"
                  >
                    Settings
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Pomodoro Settings</DialogTitle>
                      <DialogDescription>
                        Edit the pomodoro settings.
                      </DialogDescription>
                    </DialogHeader>
                    <TextFieldRoot class="flex-1">
                      <TextField
                        placeholder="Work minutes"
                        value={workMinutes()}
                        onInput={(e) =>
                          setWorkMinutes(Number(e.currentTarget.value))
                        }
                      />
                    </TextFieldRoot>
                    <TextFieldRoot class="flex-1">
                      <TextField
                        placeholder="Break minutes"
                        value={breakMinutes()}
                        onInput={(e) =>
                          setBreakMinutes(Number(e.currentTarget.value))
                        }
                      />
                    </TextFieldRoot>
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                      You may need to refresh the page to see the changes.
                    </span>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export {
  ClockWidget,
  DateWidget,
  TodoWidget,
  StopwatchWidget,
  BookmarksWidget,
  NatureWidget,
  PomodoroWidget,
};
