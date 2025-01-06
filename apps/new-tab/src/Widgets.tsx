import { createSignal, onMount } from "solid-js";
import { Checkbox, CheckboxControl } from "./components/ui/checkbox";
import { Button } from "./components/ui/button";
import { TextField, TextFieldRoot } from "./components/ui/textfield";
import soundscapes from "./soundscapes";
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
import { formattedClock } from "./hooks/clockFormatter";

function ClockWidget() {
  const clock = formattedClock();
  return (
    <div class="absolute inset-0 !select-none rounded-[20px] bg-black/30 p-[10px] shadow-inner shadow-white/10 backdrop-blur-3xl">
      <div class="relative flex h-full w-full items-center justify-center rounded-[10px]">
        <div class="absolute flex w-full justify-between self-start px-3.5 py-2.5 text-xs font-semibold text-gray-400">
          <div id="amPm">{clock().amPm}</div>
        </div>
        <div class="text-center text-5xl font-bold text-white" id="currentTime">
          {clock().time}
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
          new Date().getDate()
        );
        document.getElementById("month")!.textContent =
          months[new Date().getMonth()];
        document.getElementById("year")!.textContent = String(
          new Date().getFullYear()
        );
      } catch (e) {
        clearInterval(interval);
      }
    }, 1000);
  });
  return (
    <div class="absolute inset-0 !select-none rounded-[20px] bg-black/30 p-[10px] shadow-inner shadow-white/10 backdrop-blur-3xl">
      <div class="h-full w-full rounded-[10px]">
        <div class="relative flex h-full w-full items-center justify-center rounded-[10px]">
          <div class="absolute flex w-full justify-between self-start px-3.5 py-2.5 text-xs font-semibold text-gray-400">
            <div id="month">{months[new Date().getMonth()]}</div>
            <div id="year">{new Date().getFullYear()}</div>
          </div>
          <div class="text-center text-5xl font-bold text-white" id="day">
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
    <div class="absolute inset-0 overflow-hidden rounded-[20px] bg-black/30 p-[10px] shadow-inner shadow-white/10 backdrop-blur-3xl">
      <div class="**:text-white h-full w-full rounded-lg">
        <div class="text-foreground relative h-full w-full rounded-[20px] pt-2">
          <div class="scrollbar-hidden max-h-[76px] overflow-auto">
            <div id="tasks" class="mt-2 px-4">
              {tasks()
                .filter((task: Task) => !task.completed)
                .map((task: Task, index: number) => (
                  <div
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, task.id)}
                    class="task flex cursor-move items-center gap-2 rounded transition-colors"
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
                                  : t
                              )
                              .filter((t: Task) => !t.completed)
                          );
                          localStorage.setItem(
                            "tasks",
                            JSON.stringify(tasks())
                          );
                        } catch (error) {
                          console.error("Error updating task:", error);
                        }
                      }}
                    >
                      <CheckboxControl class="!border-white" />
                    </Checkbox>
                    <label for={task.id} class="select-none text-sm">
                      {task.title}
                    </label>
                  </div>
                ))}
              <br />
            </div>
          </div>
          <div class="absolute bottom-0 left-0 right-0 flex gap-2 bg-transparent pb-[10px] pl-2 pr-4">
            <TextFieldRoot class="flex-1">
              <TextField
                placeholder={chrome.i18n.getMessage("new_task")}
                value={taskInputValue()}
                onInput={(e) => setTaskInputValue(e.currentTarget.value)}
                onKeyDown={(e: KeyboardEvent) => {
                  if (e.key === "Enter") {
                    addTask();
                  }
                }}
                class="!outline-white"
              />
            </TextFieldRoot>
            <Button onClick={addTask}>
              {chrome.i18n.getMessage("add_task")}
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
        "0"
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
    <div class="text-foreground absolute inset-0 overflow-hidden rounded-[20px] bg-black/30 p-[10px] pb-0 shadow-inner shadow-white/10 backdrop-blur-3xl">
      <div class="flex h-full w-full select-none flex-col items-center justify-center gap-2 rounded-[10px] text-white">
        {formatTime(time())}
        <div class="flex gap-2 text-sm text-gray-400">
          <Button
            variant={"outline"}
            onclick={() => {
              setPlaying(false);
              setTime(0);
            }}
          >
            {chrome.i18n.getMessage("reset")}
          </Button>
          <Button onclick={() => setPlaying(!playing())}>
            {playing()
              ? chrome.i18n.getMessage("stop")
              : chrome.i18n.getMessage("start")}
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
    <div class="absolute inset-0 overflow-hidden rounded-[20px] bg-black/30 p-[10px] pb-0 shadow-inner shadow-white/10 backdrop-blur-3xl">
      <div class="h-full w-full rounded-[10px]">
        <div class="relative h-full w-full rounded-[10px] pt-2">
          <div class="scrollbar-hidden **:text-white overflow-auto">
            <div
              class="select-none px-3.5 text-left text-xl font-bold text-white"
              id="title"
            >
              {chrome.i18n.getMessage("bookmarks")}
            </div>
            <div
              id="bookmarks"
              class="mt-2 grid grid-cols-3 grid-rows-3 gap-2 px-3.5"
            >
              {bookmarks()
                .slice(0, 9)
                .map((bookmark: Bookmark, index: number) => (
                  <div class="bookmark flex items-center gap-2">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      class="text-foreground overflow-hidden text-ellipsis whitespace-nowrap text-[17px] font-medium"
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
        class="flex size-[24px] items-center justify-center !rounded-full font-bold text-black"
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
          <Pause height={16} fill="currentColor" class="text-foreground" />
        ) : (
          <Play height={16} fill="currentColor" class="text-foreground" />
        )}
      </button>
    );
  }

  return (
    <div class="**:text-white absolute inset-0 overflow-hidden rounded-[20px] bg-black/30 p-[10px] shadow-inner shadow-white/10 backdrop-blur-3xl">
      <div class="h-full w-full rounded-[10px]">
        <div class="relative h-full w-full rounded-[10px] pt-2">
          <div class="scrollbar-hidden overflow-auto">
            <div
              class="select-none px-3.5 text-left text-xl font-bold text-white"
              id="title"
            >
              {chrome.i18n.getMessage("nature")}
            </div>
            <div
              id="soundscapes"
              class="grid grid-cols-3 grid-rows-2 gap-2 p-1.5 pb-0"
            >
              {soundscapes
                .filter((soundscape) =>
                  soundscape.categories.includes("nature")
                )
                .map((soundscape, index: number) => (
                  <div class="soundscape flex items-center gap-2">
                    <div class="flex items-center gap-2">
                      <div class="flex items-center gap-2">
                        <div class="flex items-center gap-2">
                          <PlayButton
                            key={soundscape.name}
                            index={soundscape.index}
                          />
                          <div class="text-foreground overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
                            {soundscape.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <a
              href="https://noisefill.com/credits"
              class="m-0 -mt-2 pl-3.5 text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {chrome.i18n.getMessage("sound_attribution")}
            </a>
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
      Number(seconds.toString())
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
          pomodoro()
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
    <div class="absolute inset-0 overflow-hidden rounded-[20px] bg-transparent">
      <div class="h-full w-full rounded-[10px]">
        <div class="relative h-full w-full rounded-[10px] bg-black/30 p-[10px] pt-4 shadow-inner shadow-white/10 backdrop-blur-3xl">
          <div class="scrollbar-hidden overflow-auto">
            <div
              class="select-none px-3.5 text-left text-xl font-bold text-white"
              id="title"
            >
              {isRunning()
                ? pomodoroSession() == "work"
                  ? "Work"
                  : "Break"
                : "Pomodoro"}
            </div>
            <div class="mt-2 px-3.5">
              <h1 class="text-xl font-bold text-white">
                {formatTime(pomodoro())}
              </h1>
              <div class="mt-3 flex items-center gap-2">
                <Button
                  onclick={() => {
                    setIsRunning(!isRunning());
                  }}
                >
                  {isRunning()
                    ? chrome.i18n.getMessage("stop")
                    : chrome.i18n.getMessage("start")}
                </Button>
                <Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
                  <DialogTrigger
                    class="inline-flex items-center gap-2 rounded-md bg-gray-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 hover:bg-gray-600 focus:outline-none focus:outline-1 focus:outline-white dark:bg-gray-800"
                    aria-label="Add widget"
                  >
                    {chrome.i18n.getMessage("settings")}
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {chrome.i18n.getMessage("pomodoro_settings")}
                      </DialogTitle>
                      <DialogDescription>
                        {chrome.i18n.getMessage("edit_the_pomodoro_settings")}
                      </DialogDescription>
                    </DialogHeader>
                    <TextFieldRoot class="mt-1 flex-1">
                      <TextField
                        placeholder={chrome.i18n.getMessage("work_minutes")}
                        value={workMinutes()}
                        onInput={(e) =>
                          setWorkMinutes(Number(e.currentTarget.value))
                        }
                      />
                    </TextFieldRoot>
                    <TextFieldRoot class="mt-2 flex-1">
                      <TextField
                        placeholder={chrome.i18n.getMessage("break_minutes")}
                        value={breakMinutes()}
                        onInput={(e) =>
                          setBreakMinutes(Number(e.currentTarget.value))
                        }
                      />
                    </TextFieldRoot>
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {chrome.i18n.getMessage("you_may_need_to_refresh")}
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

function FocusSoundscapes() {
  const [currentlyPlaying, setCurrentlyPlaying] = createSignal<any>(null);
  function PlayButton({ key, index }: { key: string; index: number }) {
    return (
      <button
        class="flex size-[24px] items-center justify-center !rounded-full font-bold text-black"
        onclick={() => {
          if (currentlyPlaying() == index) {
            setCurrentlyPlaying(null);
            (document.getElementById("audio-1") as HTMLAudioElement)?.load();
          } else {
            setCurrentlyPlaying(index);
            (document.getElementById("audio-1") as HTMLAudioElement)?.load();
          }
        }}
      >
        {currentlyPlaying() == index ? (
          <Pause height={16} fill="currentColor" class="text-foreground" />
        ) : (
          <Play height={16} fill="currentColor" class="text-foreground" />
        )}
      </button>
    );
  }

  return (
    <div class="absolute inset-0 overflow-hidden rounded-[20px] bg-black/30 p-[10px] shadow-inner shadow-white/10 backdrop-blur-3xl">
      <div class="**:text-white h-full w-full rounded-[10px]">
        <div class="relative h-full w-full rounded-[10px] pt-2">
          <div class="scrollbar-hidden overflow-auto">
            <div
              class="select-none px-3.5 text-left text-xl font-bold text-white"
              id="title"
            >
              {chrome.i18n.getMessage("focus")}
            </div>
            <div
              id="soundscapes"
              class="grid grid-cols-3 grid-rows-2 gap-2 p-1.5 pb-0"
            >
              {soundscapes
                .filter((soundscape) => soundscape.categories.includes("focus"))
                .map((soundscape, index: number) => (
                  <div class="soundscape flex items-center gap-2">
                    <div class="flex items-center gap-2">
                      <div class="flex items-center gap-2">
                        <div class="flex items-center gap-2">
                          <PlayButton
                            key={soundscape.name}
                            index={soundscape.index}
                          />
                          <div class="text-foreground overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
                            {soundscape.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <a
              href="https://noisefill.com/credits"
              class="m-0 -mt-2 pl-3.5 text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {chrome.i18n.getMessage("sound_attribution")}
            </a>
            <audio
              src={soundscapes[currentlyPlaying()]?.url}
              id="audio-1"
              autoplay
              loop
            ></audio>
          </div>
        </div>
      </div>
    </div>
  );
}

function AmbienceSoundscapes() {
  const [currentlyPlaying, setCurrentlyPlaying] = createSignal<any>(null);
  function PlayButton({ key, index }: { key: string; index: number }) {
    return (
      <button
        class="flex size-[24px] items-center justify-center !rounded-full font-bold text-white"
        onclick={() => {
          if (currentlyPlaying() == index) {
            setCurrentlyPlaying(null);
            (document.getElementById("audio-2") as HTMLAudioElement)?.load();
          } else {
            setCurrentlyPlaying(index);
            (document.getElementById("audio-2") as HTMLAudioElement)?.load();
          }
        }}
      >
        {currentlyPlaying() == index ? (
          <Pause height={16} fill="currentColor" class="text-white" />
        ) : (
          <Play height={16} fill="currentColor" class="text-white" />
        )}
      </button>
    );
  }

  return (
    <div class="absolute inset-0 overflow-hidden rounded-[20px] bg-black/30 p-[10px] shadow-inner shadow-white/10 backdrop-blur-3xl">
      <div class="h-full w-full rounded-[10px]">
        <div class="**:text-white relative h-full w-full rounded-[10px] pt-2">
          <div class="scrollbar-hidden overflow-auto">
            <div
              class="select-none px-3.5 text-left text-xl font-bold text-white"
              id="title"
            >
              {chrome.i18n.getMessage("ambience")}
            </div>
            <div
              id="soundscapes"
              class="grid grid-cols-3 grid-rows-2 gap-2 p-1.5 pb-0"
            >
              {soundscapes
                .filter((soundscape) => soundscape.categories.includes("focus"))
                .map((soundscape, index: number) => (
                  <div class="soundscape flex items-center gap-2">
                    <div class="flex items-center gap-2">
                      <div class="flex items-center gap-2">
                        <div class="flex items-center gap-2">
                          <PlayButton
                            key={soundscape.name}
                            index={soundscape.index}
                          />
                          <div class="text-foreground overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
                            {soundscape.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <a
              href="https://noisefill.com/credits"
              class="m-0 -mt-2 pl-3.5 text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {chrome.i18n.getMessage("sound_attribution")}
            </a>
            <audio
              src={soundscapes[currentlyPlaying()]?.url}
              id="audio-2"
              autoplay
              loop
            ></audio>
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
  FocusSoundscapes,
  AmbienceSoundscapes,
};
