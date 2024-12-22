import { createSignal, onCleanup, Signal } from "solid-js";

const subscribers: Record<string, Array<(value: any) => void>> = {};

function createStoredSignal<T>(
  key: string,
  defaultValue: T,
  storage = localStorage,
): Signal<T> {
  const initialValue =
    storage.getItem(key) != null
      ? (() => {
          const storedValue = storage.getItem(key) as string;
          return typeof storedValue !== "object"
            ? String(storedValue)
            : JSON.parse(storedValue as string);
        })()
      : defaultValue;

  const [value, setValue] = createSignal<T>(initialValue);

  if (!storage.getItem(key)) {
    storage.setItem(
      key,
      typeof defaultValue !== "string"
        ? JSON.stringify(defaultValue)
        : defaultValue,
    );
  }

  const setValueAndStore = ((arg: any) => {
    const newValue = setValue(arg);
    storage.setItem(
      key,
      typeof newValue !== "string" ? JSON.stringify(newValue) : newValue,
    );

    if (subscribers[key]) {
      subscribers[key].forEach((callback) => callback(newValue));
    }

    return newValue;
  }) as typeof setValue;

  if (!subscribers[key]) {
    subscribers[key] = [];
  }
  subscribers[key].push(setValue);

  onCleanup(() => {
    subscribers[key] = subscribers[key].filter(
      (callback) => callback !== setValue,
    );
  });

  return [value, setValueAndStore];
}

export { createStoredSignal };
