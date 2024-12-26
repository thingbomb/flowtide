import { createSignal, onMount } from "solid-js";
import { Checkbox, CheckboxControl } from "./components/ui/checkbox";
import { Button } from "./components/ui/button";
import { TextField, TextFieldRoot } from "./components/ui/textfield";
import soundscapes, { Category } from "./soundscapes";
import { GripVertical, Pause, Play } from "lucide-solid";
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
    <div class="absolute inset-0 p-[10px] bg-white dark:bg-background rounded-[20px] !select-none">
      <div class="bg-gray-200 dark:bg-zinc-900 rounded-[10px] w-full h-full flex justify-center items-center relative">
        <div class="self-start absolute w-full text-gray-400 flex justify-between px-3.5 py-2.5 text-xs font-semibold">
          <div id="amPm">{createTime(new Date()).amPm}</div>
        </div>
        <div
          class="text-center text-5xl text-black dark:text-white font-bold"
          id="currentTime"
        >
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
    <div class="absolute inset-0 p-[10px] bg-white dark:bg-background rounded-[20px] !select-none">
      <div class="bg-gray-200 dark:bg-zinc-900 rounded-[10px] w-full h-full">
        <div class="relative h-full w-full bg-gray-200 dark:bg-zinc-900 rounded-[10px] flex items-center justify-center">
          <div class="self-start absolute w-full text-gray-400 flex justify-between px-3.5 py-2.5 text-xs font-semibold">
            <div id="month">{months[new Date().getMonth()]}</div>
            <div id="year">{new Date().getFullYear()}</div>
          </div>
          <div
            class="text-center text-5xl text-black dark:text-white font-bold"
            id="day"
          >
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
    id: string;
  }

  const getInitialTasks = () => {
    try {
      const stored = localStorage.getItem("tasks");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((task: Task) => ({
          ...task,
          id: task.id || crypto.randomUUID(),
        }));
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
    }
    return [
      { completed: false, title: "Task 1", id: crypto.randomUUID() },
      { completed: false, title: "Task 2", id: crypto.randomUUID() },
    ];
  };

  const [tasks, setTasks] = createSignal<Task[]>(getInitialTasks());

  const [taskInputValue, setTaskInputValue] = createSignal("");
  const [draggedTaskId, setDraggedTaskId] = createSignal<string | null>(null);

  const handleDragStart = (e: DragEvent, taskId: string) => {
    if (!(e.target instanceof HTMLElement)) return;

    setDraggedTaskId(taskId);
    e.dataTransfer?.setData("text/plain", taskId);

    e.target.classList.add("opacity-50");

    const dragImage = e.target.cloneNode(true) as HTMLElement;
    dragImage.classList.add("fixed", "top-0", "left-0", "pointer-events-none");
    document.body.appendChild(dragImage);
    e.dataTransfer?.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";
  };

  const handleDragEnd = (e: DragEvent) => {
    if (!(e.target instanceof HTMLElement)) return;
    e.target.classList.remove("opacity-50");
    setDraggedTaskId(null);
    localStorage.setItem("tasks", JSON.stringify(tasks()));
  };

  const handleDrop = (e: DragEvent, targetTaskId: string) => {
    e.preventDefault();

    const sourceTaskId = draggedTaskId();
    if (!sourceTaskId || sourceTaskId === targetTaskId) return;

    try {
      const currentTasks = tasks();
      const sourceIndex = currentTasks.findIndex((t) => t.id === sourceTaskId);
      const targetIndex = currentTasks.findIndex((t) => t.id === targetTaskId);

      if (sourceIndex === -1 || targetIndex === -1) return;

      const newTasks = [...currentTasks];
      const [movedTask] = newTasks.splice(sourceIndex, 1);
      newTasks.splice(targetIndex, 0, movedTask);

      setTasks(newTasks);
      localStorage.setItem("tasks", JSON.stringify(newTasks));
    } catch (error) {
      console.error("Error reordering tasks:", error);
    }
  };

  const addTask = () => {
    if (!taskInputValue().trim()) return;

    try {
      const newTask = {
        completed: false,
        title: taskInputValue(),
        id: crypto.randomUUID(),
      };

      const newTasks = [...tasks(), newTask];
      setTasks(newTasks);
      setTaskInputValue("");
      localStorage.setItem("tasks", JSON.stringify(newTasks));
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div class="absolute inset-0 p-[10px] bg-background rounded-[20px] overflow-hidden">
      <div class="rounded-lg w-full h-full">
        <div class="relative h-full w-full bg-background rounded-[20px] pt-2 text-foreground">
          <div class="overflow-auto max-h-[76px] scrollbar-hidden">
            <div id="tasks" class="px-4 mt-2">
              {tasks()
                .filter((task: Task) => !task.completed)
                .map((task: Task, index: number) => (
                  <div
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, task.id)}
                    class="flex gap-2 items-center task rounded cursor-move transition-colors"
                  >
                    <Checkbox
                      id={task.id}
                      onChange={(checked: boolean) => {
                        try {
                          setTasks(
                            tasks()
                              .map((t: Task) =>
                                t.id === task.id
                                  ? { ...t, completed: checked }
                                  : t,
                              )
                              .filter((t: Task) => !t.completed),
                          );
                          localStorage.setItem(
                            "tasks",
                            JSON.stringify(tasks()),
                          );
                        } catch (error) {
                          console.error("Error updating task:", error);
                        }
                      }}
                    >
                      <CheckboxControl class="dark:!border-white" />
                    </Checkbox>
                    <label for={task.id} class="text-sm select-none">
                      {task.title}
                    </label>
                  </div>
                ))}
              <br />
            </div>
          </div>
          <div class="absolute bottom-0 right-0 left-0 pr-4 pl-2 pb-[10px] flex gap-4 bg-background">
            <TextFieldRoot class="flex-1">
              <TextField
                placeholder="New task"
                value={taskInputValue()}
                onInput={(e) => setTaskInputValue(e.currentTarget.value)}
                onKeyDown={(e: KeyboardEvent) => {
                  if (e.key === "Enter") {
                    addTask();
                  }
                }}
              />
            </TextFieldRoot>
            <Button onClick={addTask}>Add task</Button>
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
    <div class="absolute inset-0 p-[10px] pb-0 bg-white dark:bg-background rounded-[20px] overflow-hidden">
      <div class="rounded-[10px] w-full h-full">
        <div class="relative h-full w-full bg-white dark:bg-background rounded-[10px] pt-2">
          <div class="overflow-auto scrollbar-hidden">
            <div
              class="text-left text-xl text-cyan-700 dark:text-white font-bold px-3.5 select-none"
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
          <Pause height={20} fill="currentColor" class="text-foreground" />
        ) : (
          <Play height={20} fill="currentColor" class="text-foreground" />
        )}
      </button>
    );
  }

  return (
    <div class="absolute inset-0 p-[10px] pb-0 bg-background rounded-[20px] overflow-hidden">
      <div class="rounded-[10px] w-full h-full">
        <div class="relative h-full w-full bg-background rounded-[10px] pt-2">
          <div class="overflow-auto scrollbar-hidden">
            <div
              class="text-left text-xl text-green-700 dark:text-white font-bold px-3.5 select-none"
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
                          <div class="text-[17px] text-foreground whitespace-nowrap overflow-hidden text-ellipsis font-medium">
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
    <div class="absolute inset-0 p-[10px] bg-white dark:bg-background rounded-[20px] overflow-hidden">
      <div class="rounded-[10px] w-full h-full">
        <div class="relative h-full w-full bg-white dark:bg-background rounded-[10px] pt-2">
          <div class="overflow-auto scrollbar-hidden">
            <div
              class="text-left text-xl text-teal-700 dark:text-white font-bold px-3.5 select-none"
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
