import { useEffect, useState } from "react";
import { evaluate } from "mathjs";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState({
    result: null,
    expression: null,
    copied: false,
  });

  const initialActions = [
    {
      name: `Create Google Document`,
      url: "https://docs.new",
    },
    {
      name: `Create Word Document`,
      url: "https://word.new",
    },
    {
      name: `Create Notion Page`,
      url: "https://notion.new",
    },
    {
      name: `Create Google Sheet`,
      url: "https://sheets.new",
    },
    {
      name: `Compose Gmail Message`,
      url: "https://mail.google.com/mail/u/0/#inbox?compose=new",
    },
    {
      name: `Create Google Slide`,
      url: "https://slides.new",
    },
    {
      name: `Create Google Calendar Event`,
      url: "https://cal.new",
    },
    {
      name: `Create Excel Workbook`,
      url: "https://excel.new",
    },
    {
      name: `Create PowerPoint Presentation`,
      url: "https://powerpoint.new",
    },
    {
      name: `Create Paper Document`,
      url: "https://paper.dropbox.com/new",
    },
    {
      name: `Create Todoist Task`,
      url: "https://todoist.new",
    },
    {
      name: `Create GitHub Repository`,
      url: "https://github.com/new",
    },
    {
      name: `Create GitHub Gist`,
      url: "https://gist.github.com/new",
    },
    {
      name: `Create Figma File`,
      url: "https://www.figma.com/file/new",
    },
    {
      name: `Create Zoom Meeting`,
      url: "https://zoom.us/start/videomeeting",
    },
    {
      name: `Create Bitly Link`,
      url: "https://bitly.new",
    },
  ];

  const [actions, setActions] = useState(initialActions);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    setActions(initialActions);
    setBookmarks([]);
    const down = (e) => {
      if (((e.ctrlKey || e.metaKey) && e.key === "k") || e.key === "/") {
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
      chrome.bookmarks.getTree(function (bookmarks) {
        const newBookmarks = [];
        const displayBookmarks = (bookmarks) => {
          bookmarks.forEach((bookmark) => {
            if (bookmark.children) {
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
      });
    };

    fetchBookmarks();
  }, []);

  const handleCommand = (action) => {
    setOpen(false);
    window.location.href = action.url;
  };

  const handleMathInput = (value) => {
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
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type a command or calculate..."
          value={inputValue}
          onValueChange={(value) => handleMathInput(value)}
        />
        <CommandList className="scrollbar">
          {result.result != null && (
            <div
              className="text-center p-6 bg-neutral-800 hover:bg-neutral-900 rounded-lg m-3 select-none cursor-pointer"
              onClick={() => {
                let copiedResult = result.result;
                setResult({
                  result: "Copied to clipboard",
                  copied: true,
                  expression: result.expression,
                });
                navigator.clipboard.writeText(copiedResult);
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
            {result.result == null ? "No results found." : ""}
          </CommandEmpty>
          <CommandGroup heading="Actions">
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
          <CommandGroup heading="Bookmarks">
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
        </CommandList>
      </CommandDialog>
    </>
  );
}
