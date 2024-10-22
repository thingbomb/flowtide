import { useState, useEffect } from "react";
import { CommandPalette } from "./components/ui/cmd";
import CharacterCounter from "./CharacterCounter";
import WordCounter from "./WordCounter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { SettingsIcon } from "lucide-react";
import { Button } from "./components/ui/button";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { useTheme } from "./components/ui/theme-provider";
import { Computer } from "lucide-react";
import { cn } from "./lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { List } from "lucide-react";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";
import { Plus } from "lucide-react";
import { Trash } from "lucide-react";
import { Edit } from "lucide-react";

const images = [
  { url: "assets/photos/1.jpg", color: "#FFFFFF" },
  { url: "assets/photos/2.jpg", color: "#FFFFFF" },
  { url: "assets/photos/3.jpg", color: "#FFFFFF" },
  { url: "assets/photos/4.jpg", color: "#FFFFFF" },
  { url: "assets/photos/5.jpg", color: "#FFFFFF" },
  { url: "assets/photos/6.jpg", color: "#FFFFFF" },
  { url: "assets/photos/7.jpg", color: "#FFFFFF" },
  { url: "assets/photos/8.jpg", color: "#FFFFFF" },
  { url: "assets/photos/9.jpg", color: "#FFFFFF" },
  { url: "assets/photos/10.jpg", color: "#FFFFFF" },
  { url: "assets/photos/11.jpg", color: "#FFFFFF" },
  { url: "assets/photos/12.jpg", color: "#FFFFFF" },
  { url: "assets/photos/13.jpg", color: "#FFFFFF" },
  { url: "assets/photos/14.jpg", color: "#FFFFFF" },
  { url: "assets/photos/15.jpg", color: "#FFFFFF" },
  { url: "assets/photos/16.jpg", color: "#FFFFFF" },
  { url: "assets/photos/17.jpg", color: "#FFFFFF" },
  { url: "assets/photos/18.jpg", color: "#FFFFFF" },
  { url: "assets/photos/19.jpg", color: "#FFFFFF" },
  { url: "assets/photos/20.jpg", color: "#FFFFFF" },
  { url: "assets/photos/21.jpg", color: "#000000" },
  { url: "assets/photos/22.jpg", color: "#FFFFFF" },
  { url: "assets/photos/23.jpg", color: "#FFFFFF" },
  { url: "assets/photos/24.jpg", color: "#FFFFFF" },
  { url: "assets/photos/25.jpg", color: "#FFFFFF" },
  { url: "assets/photos/26.jpg", color: "#FFFFFF" },
];

function App() {
  const [time, setTime] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState({});
  const [selectedPage, setSelectedPage] = useState("none");
  const { setTheme } = useTheme();
  const [font, setFont] = useState(localStorage.getItem("font") || "sans");
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [taskInput, setTaskInput] = useState("");

  localStorage.setItem("tasks", JSON.stringify(tasks));

  useEffect(() => {
    const intervalId = setInterval(() => setTime(new Date()), 1000);
    setSelectedImage(images[Math.floor(Math.random() * images.length)]);
    return () => {
      clearInterval(intervalId);
      setSelectedImage({});
    };
  }, []);

  const options = { hour: "2-digit", minute: "2-digit", hour12: true };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-screen bg-white dark:bg-black text-black dark:text-white bg-cover font-sans",
        font === "serif" && "font-serif",
        font === "monospace" && "font-mono"
      )}
      style={{ backgroundImage: `url(${selectedImage.url})` }}
      id="app"
    >
      <CommandPalette setSelectedPage={setSelectedPage} />
      <h1
        className="text-7xl font-bold clock select-none"
        style={{ color: selectedImage.color }}
      >
        {time.toLocaleTimeString(undefined, options)}
      </h1>
      {selectedPage === "character-counter" && (
        <CharacterCounter setSelectedPage={setSelectedPage} />
      )}
      {selectedPage === "word-counter" && (
        <WordCounter setSelectedPage={setSelectedPage} />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="fixed bottom-0 left-0 z-50 m-4">
          <Button variant="outline" aria-label="Settings" size="icon">
            <SettingsIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn(
            "w-56 ml-4",
            font === "serif" && "font-serif",
            font === "monospace" && "font-mono"
          )}
        >
          <DropdownMenuLabel>Themes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon />
            <span>Dark theme</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun />
            <span>Light theme</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Computer />
            <span>System default</span>
          </DropdownMenuItem>
          <br />
          <DropdownMenuLabel>Font</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setFont("sans");
              localStorage.setItem("font", "sans");
            }}
          >
            Sans
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setFont("monospace");
              localStorage.setItem("font", "monospace");
            }}
          >
            Monospace
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setFont("serif");
              localStorage.setItem("font", "serif");
            }}
          >
            Serif
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Popover>
        <PopoverTrigger asChild className="fixed bottom-0 right-0 z-50 m-4">
          <Button variant="outline" aria-label="Settings" size="icon">
            <List className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-80 mr-4",
            font === "serif" && "font-serif",
            font === "monospace" && "font-mono"
          )}
        >
          <div className="grid gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold leading-none">To-do list</h1>
              <p className="text-sm text-muted-foreground">
                Manage your tasks here.
              </p>
            </div>
            <div id="tasks">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) => {
                        setTasks((tasks) =>
                          tasks.map((t) =>
                            t.id === task.id ? { ...t, completed: checked } : t
                          )
                        );
                      }}
                    />
                    <span
                      className="text-sm font-medium leading-none select-none focus-within:select-all outline-none"
                      onDoubleClick={(e) => {
                        e.target.contentEditable = "true";
                        e.target.focus();
                      }}
                      onBlur={(e) => {
                        e.target.contentEditable = "false";
                        setTasks((tasks) =>
                          tasks.map((t) =>
                            t.id === task.id
                              ? { ...t, title: e.target.innerText }
                              : t
                          )
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.target.blur();
                        } else if (e.key === "Escape") {
                          e.target.blur();
                        }
                      }}
                    >
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7"
                      onClick={(e) => {
                        let span =
                          e.target.parentElement.parentElement.querySelector(
                            "span"
                          );
                        span.contentEditable = "true";
                        span.focus();
                      }}
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7"
                      onClick={() => {
                        let newTasks = [...tasks];
                        newTasks.splice(index, 1);
                        setTasks(newTasks);
                      }}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <br />
            <div className="flex items-center justify-between gap-4">
              <Input
                value={taskInput}
                placeholder="Task name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    let taskName = taskInput;
                    setTaskInput("");
                    setTasks((tasks) => [
                      ...tasks,
                      {
                        id: Math.floor(Math.random() * 100000000),
                        title: taskName,
                        completed: false,
                      },
                    ]);
                  }
                }}
                onInput={(e) => setTaskInput(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  let taskName = taskInput;
                  setTaskInput("");
                  setTasks((tasks) => [
                    ...tasks,
                    {
                      id: Math.floor(Math.random() * 100000000),
                      title: taskName,
                      completed: false,
                    },
                  ]);
                }}
              >
                <Plus aria-label="Add task to your list" className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default App;
