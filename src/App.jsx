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
import {
  SettingsIcon,
  Sun,
  Moon,
  Computer,
  List,
  Plus,
  Trash,
  Edit,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { useTheme } from "./components/ui/theme-provider";
import { cn } from "./lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";

const dbName = "flowtide";
const dbVersion = 1;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) =>
      reject("IndexedDB error: " + event.target.error);

    request.onsuccess = (event) => resolve(event.target.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("todos")) {
        db.createObjectStore("todos", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("imageCache")) {
        db.createObjectStore("imageCache", { keyPath: "id" });
      }
    };
  });
};

const images = [
  "https://utfs.io/f/BtV2EpuEtuKGYYpvGmHrnFDlqxBRa3uX1TpZ2mtINW9SH8g6",
  "https://utfs.io/f/BtV2EpuEtuKGHWPDnnvmKxbav7q9EyU21QgWFBS6NMf4iZ03",
  "https://utfs.io/f/BtV2EpuEtuKGNrh8niP4Cqwcm3D1r7su8jWtEaKlxRf2YnyN",
  "https://utfs.io/f/BtV2EpuEtuKGqpqqGhLD2XgfYxSezymMilAnUhLpcuRZVo75",
  "https://utfs.io/f/BtV2EpuEtuKGEuv9Uylitm8eDflcPVTIWZhpaKgv730LYEwR",
  "https://utfs.io/f/BtV2EpuEtuKGmvFFV8kY4cFX9DxvZUqOPtoHRLGTl1jr8hyf",
  "https://utfs.io/f/BtV2EpuEtuKGXbFMqev7QrDFRZStGMsN46Ypkdjwc19EbKhA",
  "https://utfs.io/f/BtV2EpuEtuKGHCRMXMvmKxbav7q9EyU21QgWFBS6NMf4iZ03",
  "https://utfs.io/f/BtV2EpuEtuKGBcvl3M7uEtuKGaW39lwm7q0IbpdXy1ZPJk4f",
  "https://utfs.io/f/BtV2EpuEtuKG6FG3qt5WcDpK49O7adqmIRns3XUyulvLQBTj",
  "https://utfs.io/f/BtV2EpuEtuKGnh1RTNf434kVEXU5ie7TDaHFhA1lbGNzYcqZ",
  "https://utfs.io/f/BtV2EpuEtuKG5bOFemQjmWB4l1fZbu9RvySPapO7ILN2HoFx",
  "https://utfs.io/f/BtV2EpuEtuKG1o9AYYIU9r32gRiv6MWPo7zsXtDHyd1exmNq",
  "https://utfs.io/f/BtV2EpuEtuKGVQbri1GWawFshX4d7HjkSoZRiDVt08U5OzmB",
  "https://utfs.io/f/BtV2EpuEtuKG9wUuCe0o3RtYWQFSxhw6rzBVJMCGPfE8Z5XN",
  "https://utfs.io/f/BtV2EpuEtuKGAuflSs9MEizApkbr0v75YD1yZohGC4fSatTU",
  "https://utfs.io/f/BtV2EpuEtuKGR3MwjzKMAF8EP1eqwHBZlSk6XTfmJtKnh2Qd",
  "https://utfs.io/f/BtV2EpuEtuKGXvygYJ7QrDFRZStGMsN46Ypkdjwc19EbKhAW",
  "https://utfs.io/f/BtV2EpuEtuKGMLgV5PNITp8XolSNcsVhnrg25UZHWjE3tDPB",
  "https://utfs.io/f/BtV2EpuEtuKGTM0oD3aiSaGoVUDIQ75ts0REKgA8NXvl4fMC",
  "https://utfs.io/f/BtV2EpuEtuKGa0X1aCCAn0S6HjX7fsNzERhTdiD3ogyVbP8F",
  "https://utfs.io/f/BtV2EpuEtuKGKzagh3sesda4vHQyRPXor3k5NTwW7OFtu6nE",
  "https://utfs.io/f/BtV2EpuEtuKG84OsxuqoD1nGrOdkiHqMzuRlLa9w02yT47c5",
  "https://utfs.io/f/BtV2EpuEtuKGTvID04aiSaGoVUDIQ75ts0REKgA8NXvl4fMC",
  "https://utfs.io/f/BtV2EpuEtuKGq8qrPoLD2XgfYxSezymMilAnUhLpcuRZVo75",
  "https://utfs.io/f/BtV2EpuEtuKGXEOrLN7QrDFRZStGMsN46Ypkdjwc19EbKhAW",
  "https://utfs.io/f/BtV2EpuEtuKG0m5yrgXTlm2zFRNZPyXO4SCQk7goMjuesdaV",
  "https://utfs.io/f/BtV2EpuEtuKGfBRHNwJGTNktrF1lXJ3hAZ90vP8HducsLfxi",
  "https://utfs.io/f/BtV2EpuEtuKGNx6U5wP4Cqwcm3D1r7su8jWtEaKlxRf2YnyN",
  "https://utfs.io/f/BtV2EpuEtuKG3IzkUTCbXDIUmz4eWKoG6h8pusjTySRlr9Yd",
  "https://utfs.io/f/BtV2EpuEtuKGK41G3zJsesda4vHQyRPXor3k5NTwW7OFtu6n",
  "https://utfs.io/f/BtV2EpuEtuKGBzrZ8EuEtuKGaW39lwm7q0IbpdXy1ZPJk4fD",
  "https://utfs.io/f/BtV2EpuEtuKGB7BxBKuEtuKGaW39lwm7q0IbpdXy1ZPJk4fD",
  "https://utfs.io/f/BtV2EpuEtuKGvMitjedaWI3vwnURJMdZlrtCq2kDN6ji7y4X",
  "https://utfs.io/f/BtV2EpuEtuKG6hg8r85WcDpK49O7adqmIRns3XUyulvLQBTj",
  "https://utfs.io/f/BtV2EpuEtuKG0bfrrcXTlm2zFRNZPyXO4SCQk7goMjuesdaV",
  "https://utfs.io/f/BtV2EpuEtuKGnh18myA434kVEXU5ie7TDaHFhA1lbGNzYcqZ",
  "https://utfs.io/f/BtV2EpuEtuKGGh9xEbYZkrbNnzqdU310h5Q2JYK7uT4yvjiE",
  "https://utfs.io/f/BtV2EpuEtuKGkFHjvMfQYpuH8DScEmT5OwArIaN16Rxzqv9y",
  "https://utfs.io/f/BtV2EpuEtuKGIY9gLeBVfO1L4TXBKMR23gdiFzDy8t0YvQGw",
  "https://utfs.io/f/BtV2EpuEtuKGyzDe6ErzWTQDjkGBcvXwOIr70unf5bVlqRA8",
  "https://utfs.io/f/BtV2EpuEtuKG80DFYIqoD1nGrOdkiHqMzuRlLa9w02yT47c5",
  "https://utfs.io/f/BtV2EpuEtuKGYesyOmHrnFDlqxBRa3uX1TpZ2mtINW9SH8g6",
  "https://utfs.io/f/BtV2EpuEtuKGm7rWTskY4cFX9DxvZUqOPtoHRLGTl1jr8hyf",
  "https://utfs.io/f/BtV2EpuEtuKG3yjSDwfCbXDIUmz4eWKoG6h8pusjTySRlr9Y",
  "https://utfs.io/f/BtV2EpuEtuKGH0bxV1vmKxbav7q9EyU21QgWFBS6NMf4iZ03",
  "https://utfs.io/f/BtV2EpuEtuKG4Eh4Wb2og7W5hwHPe2sIR0mKoxAbruSJD6ZC",
  "https://utfs.io/f/BtV2EpuEtuKGH27qqavmKxbav7q9EyU21QgWFBS6NMf4iZ03",
  "https://utfs.io/f/BtV2EpuEtuKGop1V8Ehc5Bg6rJGzeuPC7UFTwhix1HyjoZ2L",
  "https://utfs.io/f/BtV2EpuEtuKGPqkAwQZFKxuOiQZ1nPrDM4gmsk9hvXHUdwIG",
  "https://utfs.io/f/BtV2EpuEtuKG3EcGzoCbXDIUmz4eWKoG6h8pusjTySRlr9Yd",
  "https://utfs.io/f/BtV2EpuEtuKGeIW5XdxlqjTUD1EZGp2xuIhrBSHYfCvbN5FR",
  "https://utfs.io/f/BtV2EpuEtuKGlXrMim1Qea7Fw0PuGUkd6jK52LtImzbociWT",
  "https://utfs.io/f/BtV2EpuEtuKGJUKfl73OYeaztjMNsl8uJZGrvkgxRCW71yBA",
  "https://utfs.io/f/BtV2EpuEtuKGAX7iBsv9MEizApkbr0v75YD1yZohGC4fSatT",
];

const colors = [
  "#61a5c2",
  "#c8b6ff",
  "#d1495b",
  "#70a288",
  "#3ab795",
  "#ff9770",
];

function App() {
  const [time, setTime] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState({});
  const [selectedPage, setSelectedPage] = useState("none");
  const { setTheme } = useTheme();
  const [font, setFont] = useState(localStorage.getItem("font") || "sans");
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [rendered, setRendered] = useState(false);
  const [background, setBackground] = useState(
    localStorage.getItem("background") || "wallpaper"
  );

  useEffect(() => {
    const loadTasks = async () => {
      const db = await openDB();
      const transaction = db.transaction(["todos"], "readonly");
      const store = transaction.objectStore("todos");
      const request = store.getAll();

      request.onsuccess = (event) => {
        setTasks(event.target.result);
      };
    };

    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      const db = await openDB();
      const transaction = db.transaction(["todos"], "readwrite");
      const store = transaction.objectStore("todos");

      await store.clear();

      tasks.forEach((task) => {
        store.add(task);
      });
    };

    saveTasks();
  }, [tasks]);

  const toDataURL = (url) => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    });
  };

  const loadNewImage = async () => {
    const newImage = images[Math.floor(Math.random() * images.length)];
    const dataUrl = await toDataURL(newImage);
    const now = new Date().getTime();

    const db = await openDB();
    const transaction = db.transaction(["imageCache"], "readwrite");
    const store = transaction.objectStore("imageCache");

    store.put({
      id: "background",
      url: dataUrl,
      expiry: now + 1000 * 60 * 60,
    });

    setSelectedImage({ url: dataUrl });
  };

  const checkCachedImage = async () => {
    setRendered(true);
    const db = await openDB();
    const transaction = db.transaction(["imageCache"], "readonly");
    const store = transaction.objectStore("imageCache");
    const request = store.get("background");

    request.onsuccess = (event) => {
      const cachedData = event.target.result;
      const now = new Date().getTime();

      if (
        (cachedData && !navigator.onLine) ||
        (cachedData && cachedData.expiry > now)
      ) {
        setSelectedImage({ url: cachedData.url });
      } else if (navigator.onLine) {
        loadNewImage();
      }
    };
  };

  useEffect(() => {
    if (!rendered) {
      if (background === "color") {
        setRendered(true);
      } else {
        checkCachedImage();
      }
      setInterval(() => {
        setTime(new Date());
      }, 1000);
    }
  }, [rendered]);

  const options = { hour: "2-digit", minute: "2-digit", hour12: true };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-screen bg-white dark:bg-black text-black dark:text-white bg-cover font-sans transition-background-image",
        font === "serif" && "font-serif",
        font === "monospace" && "font-mono"
      )}
      style={{
        backgroundImage: `url(${
          selectedImage.url ||
          (background == "wallpaper"
            ? "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQA1wMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQIH/8QAIBABAQEAAQQDAQEAAAAAAAAAAAERMRIhQVECYXEikf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDh0OBAavyvtEABUAUAJc4LbeUAVFAQFAWfKzyyA1ylRQQVAF4EBrqvipyiggoCCwBBQEBQFl+p/iWoC1BewIKAizsIDd+W+GUXQQXlAAUCXPC9TIAKAgKBF1NQGr3GQBZnkQGr0sigguIACzAWZ5LnhkAFAQFwEanSlQFqKAgACzPJgDX84zeeyKCCoAAAKgAAKvTvmIgLmVFMBAAUncwBenJuxEXsCAAAoEm+lvxzzEQAXsAgAKs+O+UALMBAWU5Dj9Ay+qL1VKCAAAApx4Jc4Xd5BKgAAAumX0eFnysBOC03f0BAAFReAMvqi9VTkEAAABagAKgC8osa6vwGQvdAAAU8Is7UEVer8QBAAWIAtFlz0b9QERUAABUXFlwEFt0BBFgIq3p+2QVAAVAFFmeS54BEABUAURr+fsEC541AAAXRFgIuNfz9s36A1AAABRAFEAXEGunQReEvZAVABeRF5BFxentygAgCiAAsmrfjnkENQAVAFxFXp3yDItmAGINcgyLl9GgCALCxFlBBcAMDUBYIAqLpl9AinAAgAqCgguX0cAYgAogAs5AFvyvtkAAAAAWWzhbbeQBkAAABqW+wBLygAAAAA1tk5ZAAAAAH/9k="
            : "")
        })`,
        backgroundColor:
          background === "color"
            ? colors[Math.floor(Math.random() * colors.length)]
            : "#000000",
        transition: "background-image 1s ease-in-out",
      }}
      id="app"
    >
      <CommandPalette setSelectedPage={setSelectedPage} />
      <h1
        className="text-7xl font-bold clock select-none text-shadow-lg"
        style={{ color: "#FFFFFF" }}
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
          <DropdownMenuItem
            onClick={() => {
              setTheme("dark");
              localStorage.setItem("theme", "dark");
            }}
          >
            <Moon />
            <span>Dark theme</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setTheme("light");
              localStorage.setItem("theme", "light");
            }}
          >
            <Sun />
            <span>Light theme</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setTheme("system");
              localStorage.setItem("theme", "system");
            }}
          >
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
          <DropdownMenuLabel>Background</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setBackground("wallpaper");
              localStorage.setItem("background", "wallpaper");
              window.location.reload();
            }}
          >
            Wallpaper
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setBackground("color");
              localStorage.setItem("background", "color");
              window.location.reload();
            }}
          >
            Color Palette
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
              {tasks.map((task) => (
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
                              ? { ...t, text: e.target.innerText }
                              : t
                          )
                        );
                      }}
                    >
                      {task.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setTasks((tasks) =>
                          tasks.filter((t) => t.id !== task.id)
                        );
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setTaskInput(task.text);
                        setTasks((tasks) =>
                          tasks.filter((t) => t.id !== task.id)
                        );
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Add a new task"
              />
              <Button
                onClick={() => {
                  if (taskInput.trim() !== "") {
                    setTasks((tasks) => [
                      ...tasks,
                      { id: Date.now(), text: taskInput, completed: false },
                    ]);
                    setTaskInput("");
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default App;
