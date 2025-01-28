/*
    Flowtide
    Copyright (C) 2024-present George Stone

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    https://github.com/thingbomb/flowtide
*/

import { createSignal, onCleanup, Signal } from "solid-js";

const subscribers: Record<string, Array<(value: any) => void>> = {};

function safeParse<T>(data: any, fallback: T): T {
  try {
    return (data && typeof data === "string" && data.startsWith("{")) ||
      data.startsWith("[")
      ? JSON.parse(data)
      : (data ?? fallback);
  } catch {
    return fallback;
  }
}

function createStoredSignal<T>(key: string, defaultValue: T): Signal<T> {
  const useChromeStorage =
    typeof chrome !== "undefined" && chrome.storage?.local;

  const getFromStorage = (): T | null => {
    let storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      return safeParse(storedValue, defaultValue);
    }

    if (useChromeStorage !== undefined) {
      chrome.storage.local.get(key, (result) => {
        storedValue = result[key];
        if (storedValue !== undefined) {
          const stringifiedValue: string =
            typeof storedValue === "object"
              ? JSON.stringify(storedValue)
              : storedValue;
          // @ts-ignore
          setValue(stringifiedValue);
          localStorage.setItem(key, stringifiedValue);
        }
      });
    }

    return null;
  };

  let initialValue = getFromStorage() ?? defaultValue;

  const [value, setValue] = createSignal<T>(initialValue);

  const setToStorage = (newValue: T) => {
    const stringifiedValue: string =
      typeof newValue == "object"
        ? JSON.stringify(newValue)
        : (newValue as string);
    localStorage.setItem(key, stringifiedValue);

    if (useChromeStorage) {
      chrome.storage.local.set({ [key]: newValue });
    }
  };

  const setValueAndStore = (newValue: T) => {
    // @ts-ignore
    setValue(newValue);
    setToStorage(newValue);

    if (subscribers[key]) {
      subscribers[key].forEach((callback) => callback(newValue));
    }

    return newValue;
  };

  if (!subscribers[key]) {
    subscribers[key] = [];
  }
  subscribers[key].push(setValue);

  onCleanup(() => {
    subscribers[key] = subscribers[key].filter(
      (callback) => callback !== setValue
    );
  });

  // @ts-ignore
  return [value, setValueAndStore];
}

export { createStoredSignal };
