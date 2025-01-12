import { createEffect, createSignal, onCleanup } from "solid-js";
import { evaluate } from "mathjs";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command";

interface Bookmark {
  name: string;
  url: string;
  title?: string;
}

interface BookmarkFolder {
  name: string;
  children: Bookmark[];
}

interface MathResult {
  result: number | string | null;
  expression: string | null;
  copied: boolean;
}

export function CommandPalette(props: any) {
  const [open, setOpen] = createSignal(false);
  const [inputValue, setInputValue] = createSignal("");
  const [result, setResult] = createSignal<MathResult>({
    result: null,
    expression: null,
    copied: false,
  });

  const initialActions = [
    {
      name: chrome.i18n.getMessage("create_google_document"),
      url: "https://docs.new",
    },
    {
      name: chrome.i18n.getMessage("create_word_document"),
      url: "https://word.new",
    },
    {
      name: chrome.i18n.getMessage("create_notion_page"),
      url: "https://notion.new",
    },
    {
      name: chrome.i18n.getMessage("create_google_sheet"),
      url: "https://sheets.new",
    },
    {
      name: chrome.i18n.getMessage("compose_gmail_message"),
      url: "https://mail.google.com/mail/u/0/#inbox?compose=new",
    },
    {
      name: chrome.i18n.getMessage("create_google_slide"),
      url: "https://slides.new",
    },
    {
      name: chrome.i18n.getMessage("create_google_calendar_event"),
      url: "https://cal.new",
    },
    {
      name: chrome.i18n.getMessage("create_excel_workbook"),
      url: "https://excel.new",
    },
    {
      name: chrome.i18n.getMessage("create_powerpoint_presentation"),
      url: "https://powerpoint.new",
    },
    {
      name: chrome.i18n.getMessage("create_paper_document"),
      url: "https://paper.dropbox.com/new",
    },
    {
      name: chrome.i18n.getMessage("create_todoist_task"),
      url: "https://todoist.new",
    },
    {
      name: chrome.i18n.getMessage("create_github_repository"),
      url: "https://github.com/new",
    },
    {
      name: chrome.i18n.getMessage("create_github_gist"),
      url: "https://gist.github.com/new",
    },
    {
      name: chrome.i18n.getMessage("create_figma_file"),
      url: "https://www.figma.com/file/new",
    },
    {
      name: chrome.i18n.getMessage("create_zoom_meeting"),
      url: "https://zoom.us/start/videomeeting",
    },
    {
      name: chrome.i18n.getMessage("create_bitly_link"),
      url: "https://bitly.new",
    },
    {
      name: chrome.i18n.getMessage("create_canva_design"),
      url: "https://canva.new",
    },
    {
      name: chrome.i18n.getMessage("create_canva_video"),
      url: "https://canva.new/video",
    },
  ];

  const [actions, setActions] = createSignal(initialActions);
  const [bookmarks, setBookmarks] = createSignal<Bookmark[]>([]);
  const [loadedBookmarks, setLoadedBookmarks] = createSignal(false);
  const [bookmarkFolders, setBookmarkFolders] = createSignal<BookmarkFolder[]>(
    []
  );

  const down = (e: KeyboardEvent) => {
    if (
      ((e.ctrlKey || e.metaKey) && e.key === "k") ||
      (e.key === "/" && (e.target as HTMLElement).tagName !== "INPUT")
    ) {
      e.preventDefault();
      setOpen(!open());
    }
  };

  onCleanup(() => {
    document.removeEventListener("keydown", down);
  });

  createEffect(() => {
    document.addEventListener("keydown", down);
  });

  createEffect(() => {
    const fetchBookmarks = () => {
      if (!chrome.bookmarks) return;
      chrome.bookmarks.getTree((bookmarks) => {
        const newBookmarks: Bookmark[] = [];
        const newFolders: BookmarkFolder[] = [];
        const displayBookmarks = (bookmarks: any[]) => {
          bookmarks.forEach((bookmark) => {
            if (bookmark.children) {
              newFolders.push({
                name: bookmark.title,
                children: bookmark.children,
              });
              displayBookmarks(bookmark.children);
            } else {
              if (
                !initialActions.some((action) => action.name === bookmark.title)
              ) {
                newBookmarks.push({
                  name: bookmark.title,
                  url: bookmark.url,
                });
              }
            }
          });
        };
        displayBookmarks(bookmarks);
        setBookmarks(newBookmarks);
        setLoadedBookmarks(true);
        setBookmarkFolders(newFolders);
      });
    };
    fetchBookmarks();
  });

  const handleCommand = (action: Bookmark) => {
    setOpen(false);
    window.location.href = action.url;
  };

  const handleFolderOpen = (folder: BookmarkFolder) => {
    setOpen(false);
    folder.children.forEach((child) => {
      if (child.url && !child.url.startsWith("javascript")) {
        window.open(child.url);
      }
    });
  };

  const settingsHandler = (setting: string) => {
    setOpen(false);
    document.getElementById("settingsButton")!.click();
    setInputValue("");
    if (setting === "general") {
      document.getElementById("generalButton")!.click();
    } else if (setting === "appearance") {
      document.getElementById("appearanceButton")!.click();
    } else if (setting === "background") {
      document.getElementById("backgroundButton")!.click();
    }
  };

  const handleMathInput = (value: string) => {
    setInputValue(value);
    try {
      const mathResult = evaluate(value);
      if (typeof mathResult === "number") {
        setResult({
          expression: value,
          result: mathResult,
          copied: false,
        });
      } else {
        setResult({
          result: null,
          expression: value,
          copied: false,
        });
      }
    } catch (error) {
      setResult({
        result: null,
        expression: value,
        copied: false,
      });
    }
  };

  return (
    <CommandDialog open={open()} onOpenChange={setOpen}>
      <CommandInput
        placeholder={chrome.i18n.getMessage("type_command")}
        value={inputValue()}
        onValueChange={(value) => handleMathInput(value)}
      />
      <CommandList class="scrollbar">
        {result().result != null && (
          <div
            class="m-3 cursor-pointer select-none rounded-lg bg-neutral-800 p-6 text-center hover:bg-neutral-900"
            onClick={() => {
              const copiedResult = result().result;
              setResult({
                result: chrome.i18n.getMessage("copied_to_clipboard"),
                copied: true,
                expression: result().expression,
              });
              navigator.clipboard.writeText(String(copiedResult));
              setTimeout(() => {
                setResult({
                  result: copiedResult,
                  copied: false,
                  expression: result().expression,
                });
              }, 2000);
            }}
          >
            <span class="text-2xl font-bold">{result().result}</span>
          </div>
        )}
        <CommandEmpty class="hidden" aria-hidden="false">
          {result().result == null ? chrome.i18n.getMessage("no_results") : ""}
        </CommandEmpty>
        <CommandGroup heading={chrome.i18n.getMessage("bookmarks")}>
          {loadedBookmarks() ? (
            <div>
              {bookmarks().map((bookmark) => (
                <CommandItem
                  onSelect={() => handleCommand(bookmark)}
                  class="flex items-center"
                >
                  <span class="text-primary">{bookmark.name}</span>
                </CommandItem>
              ))}
            </div>
          ) : null}
        </CommandGroup>
        <CommandGroup heading={chrome.i18n.getMessage("actions")}>
          {actions().map((action, index) => (
            <CommandItem
              onSelect={() => handleCommand(action)}
              class="flex items-center"
            >
              <span class="text-primary">{action.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading={chrome.i18n.getMessage("bookmark_folders")}>
          {bookmarkFolders().map((folder) => (
            <CommandItem
              onSelect={() => handleFolderOpen(folder)}
              class="flex items-center"
            >
              <span class="text-primary">{folder.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading={chrome.i18n.getMessage("settings")}>
          <CommandItem
            onSelect={() => settingsHandler("general")}
            class="flex items-center"
          >
            <span class="text-primary">
              {chrome.i18n.getMessage("general")}
            </span>
          </CommandItem>
          <CommandItem
            onSelect={() => settingsHandler("appearance")}
            class="flex items-center"
          >
            <span class="text-primary">
              {chrome.i18n.getMessage("appearance")}
            </span>
          </CommandItem>
          <CommandItem
            onSelect={() => settingsHandler("background")}
            class="flex items-center"
          >
            <span class="text-primary">
              {chrome.i18n.getMessage("background")}
            </span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setOpen(false);
              setInputValue("");
              let currentTheme =
                document.documentElement.getAttribute("data-kb-theme");
              if (currentTheme === "dark") {
                document.documentElement.setAttribute("data-kb-theme", "light");
              } else if (currentTheme === "light") {
                document.documentElement.setAttribute("data-kb-theme", "dark");
              } else if (currentTheme === "system") {
                document.documentElement.setAttribute(
                  "data-kb-theme",
                  "system"
                );
              }
            }}
            class="flex items-center"
          >
            <span class="text-primary">
              {chrome.i18n.getMessage("toggle_theme")}
            </span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
