import jsonData from "../public/_locales/en/messages.json";

type MessageKeys = keyof typeof jsonData;

declare global {
  interface Window {
    chrome: {
      i18n: {
        getMessage: (
          message: MessageKeys,
          substitutions?: string | string[]
        ) => string;
      };
    };
    bookmarks: any | undefined;
    storage: any | undefined;
  }

  const chrome: {
    i18n: {
      getMessage: (
        message: MessageKeys,
        substitutions?: string | string[]
      ) => string;
    };
    bookmarks: any | undefined;
    storage: any | undefined;
  };
}

export {};
