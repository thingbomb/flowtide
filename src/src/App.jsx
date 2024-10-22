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
    </div>
  );
}

export default App;
