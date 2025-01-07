import { createSignal, onMount } from "solid-js";
import { createStoredSignal } from "./localStorage";
import { onCleanup } from "solid-js";

function formattedClock() {
  const [clockFormat, setClockFormat] = createStoredSignal("clockFormat", "");
  const [currentClock, setCurrentClock] = createSignal(createClock(new Date()));
  function createClock(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedHours = hours % 12 || 12;
    if (clockFormat() == "12h") {
      return {
        time: `${formattedHours}:${formattedMinutes}`,
        amPm: "",
      };
    } else if (clockFormat() == "24h") {
      return {
        time: `${hours}:${formattedMinutes}`,
        amPm: "",
      };
    } else {
      return {
        time: `${formattedHours}:${formattedMinutes}`,
        amPm: hours >= 12 ? "PM" : "AM",
      };
    }
  }
  onMount(() => {
    const intervalId = setInterval(() => {
      setCurrentClock(createClock(new Date()));
    }, 1000);
    onCleanup(() => clearInterval(intervalId));
  });

  return currentClock;
}

export { formattedClock };
