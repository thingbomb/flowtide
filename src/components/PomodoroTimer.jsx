import { useState, useEffect, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MenuIcon, Settings } from "lucide-react";

export default function PomodoroTimer() {
  const [mode, setMode] = useState("clock");
  const [time, setTime] = useState(new Date());
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [currentTimer, setCurrentTimer] = useState(pomodoroTime);
  const [settings, setSettings] = useState({
    pomodoroMinutes: 25,
    breakMinutes: 5,
  });

  useEffect(() => {
    if (mode === "clock") {
      const timer = setInterval(() => {
        setTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode]);

  useEffect(() => {
    let interval;
    if (mode === "pomodoro" && isRunning && currentTimer > 0) {
      interval = setInterval(() => {
        setCurrentTimer((prev) => prev - 1);
      }, 1000);
    } else if (currentTimer === 0) {
      setIsRunning(false);
      setCurrentTimer(currentTimer === pomodoroTime ? breakTime : pomodoroTime);
    }
    return () => clearInterval(interval);
  }, [mode, isRunning, currentTimer, pomodoroTime, breakTime]);

  const formatTime = useCallback((timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    setPomodoroTime(newSettings.pomodoroMinutes * 60);
    setBreakTime(newSettings.breakMinutes * 60);
    if (!isRunning) {
      setCurrentTimer(newSettings.pomodoroMinutes * 60);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentTimer(pomodoroTime);
  };

  return (
    <div className="relative group">
      <div className="flex items-center space-x-2">
        {mode === "clock" ? (
          <div className="text-xl font-mono">
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        ) : (
          <div className="text-xl font-mono">{formatTime(currentTimer)}</div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MenuIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setMode("clock")}>
              Clock Mode
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMode("pomodoro")}>
              Pomodoro Mode
            </DropdownMenuItem>
            {mode === "pomodoro" && (
              <>
                <DropdownMenuItem onClick={toggleTimer}>
                  {isRunning ? "Pause" : "Start"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={resetTimer}>Reset</DropdownMenuItem>
              </>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Timer Settings</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="pomodoro">Pomodoro (min)</label>
                    <Input
                      id="pomodoro"
                      type="number"
                      className="col-span-3"
                      value={settings.pomodoroMinutes}
                      onChange={(e) =>
                        handleSettingsChange({
                          ...settings,
                          pomodoroMinutes: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="break">Break (min)</label>
                    <Input
                      id="break"
                      type="number"
                      className="col-span-3"
                      value={settings.breakMinutes}
                      onChange={(e) =>
                        handleSettingsChange({
                          ...settings,
                          breakMinutes: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
