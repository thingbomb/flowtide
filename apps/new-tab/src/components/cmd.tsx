import { useEffect, useState } from "react";
import { evaluate } from "mathjs";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@flowtide/ui";
import { toast } from "sonner";

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
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<MathResult>({
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
  ];

  const [actions, setActions] = useState(initialActions);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkFolder[]>([]);

  useEffect(() => {
    setActions(initialActions);
    setBookmarks([]);
    const down = (e: KeyboardEvent) => {
      if (
        ((e.ctrlKey || e.metaKey) && e.key === "k") ||
        (e.key === "/" && (e.target as HTMLElement).tagName !== "INPUT")
      ) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, []);

  useEffect(() => {
    const fetchBookmarks = () => {
      if (!chrome.bookmarks) return;
      chrome.bookmarks.getTree(function (bookmarks) {
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
        setBookmarkFolders(newFolders);
      });
    };

    fetchBookmarks();
  }, []);

  const handleCommand = (action: Bookmark) => {
    setOpen(false);
    window.location.href = action.url;
  };

  const handleFolderOpen = (folder: BookmarkFolder) => {
    setOpen(false);
    for (let i = 0; i < folder.children.length; i++) {
      if (
        folder.children[i].url &&
        !folder.children[i].url.startsWith("javascript")
      ) {
        window.open(folder.children[i].url);
        toast(
          chrome.i18n.getMessage("opened") + " " + folder.children[i].title,
        );
      }
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

  function deleteAllTabs() {
    chrome.permissions.request(
      {
        permissions: ["tabs"],
      },
      (granted) => {
        if (granted) {
          console.log("Permission granted for tabs");
          closeOtherTabs();
        } else {
          console.log("Permission denied for tabs");
        }
      },
    );

    function closeOtherTabs() {
      chrome.tabs.query({}, (tabs) => {
        const currentTab = tabs.find((tab) => tab.active) as chrome.tabs.Tab;
        tabs.forEach((tab) => {
          if (tab.id !== currentTab.id) {
            if (tab.id !== undefined) {
              chrome.tabs.remove(tab.id);
            }
          }
        });
      });
    }
  }

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder={chrome.i18n.getMessage("type_command")}
          value={inputValue}
          onValueChange={(value) => handleMathInput(value)}
        />
        <CommandList className="scrollbar">
          {result.result != null && (
            <div
              className="text-center p-6 bg-neutral-800 hover:bg-neutral-900 rounded-lg m-3 select-none cursor-pointer"
              onClick={() => {
                const copiedResult = result.result;
                setResult({
                  result: chrome.i18n.getMessage("copied_to_clipboard"),
                  copied: true,
                  expression: result.expression,
                });
                navigator.clipboard.writeText(String(copiedResult));
                setTimeout(() => {
                  setResult({
                    result: copiedResult,
                    copied: false,
                    expression: result.expression,
                  });
                }, 2000);
              }}
            >
              <span className="text-2xl font-bold">{result.result}</span>
            </div>
          )}
          <CommandEmpty className="hidden" aria-hidden="false">
            {result.result == null ? chrome.i18n.getMessage("no_results") : ""}
          </CommandEmpty>
          <CommandGroup heading={chrome.i18n.getMessage("actions")}>
            {actions.map((action, index) => (
              <CommandItem
                key={index}
                onSelect={() => handleCommand(action)}
                className="flex items-center"
              >
                <span className="text-primary">{action.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading={chrome.i18n.getMessage("bookmarks")}>
            {bookmarks.map((bookmark) => (
              <CommandItem
                key={bookmark.name}
                onSelect={() => handleCommand(bookmark)}
                className="flex items-center"
              >
                <span className="text-primary">{bookmark.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading={chrome.i18n.getMessage("bookmark_folders")}>
            {bookmarkFolders.map((folder) => (
              <CommandItem
                key={folder.name}
                onSelect={() => handleFolderOpen(folder)}
                className="flex items-center"
              >
                <span className="text-primary">{folder.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading={chrome.i18n.getMessage("tools")}>
            <CommandItem
              onSelect={() => {
                props.setSelectedPage("character-counter");
                setOpen(false);
              }}
              className="flex items-center"
            >
              <span className="text-primary">
                {chrome.i18n.getMessage("character_counter")}
              </span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                props.setSelectedPage("word-counter");
                setOpen(false);
              }}
              className="flex items-center"
            >
              <span className="text-primary">
                {chrome.i18n.getMessage("word_counter")}
              </span>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading={chrome.i18n.getMessage("tabs")}>
            <CommandItem
              onSelect={() => {
                if (!chrome.permissions) {
                  alert(
                    "You're using a preview version of Flowtide. Get the official version to use this feature.",
                  );
                  setOpen(false);
                  return;
                }
                setOpen(false);
                if (confirm(chrome.i18n.getMessage("remove_tabs_confirm"))) {
                  deleteAllTabs();
                }
              }}
              className="flex items-center"
            >
              <span className="text-primary">
                {chrome.i18n.getMessage("remove_all_tabs")}
              </span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
