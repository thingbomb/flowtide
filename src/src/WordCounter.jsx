import { useState } from "react";
import { Textarea } from "./components/ui/textarea";
import { cn } from "./lib/utils";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [show, setShow] = useState(true);

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center flex-col bg-black/80 p-6 character-counter",
        show ? "" : "hidden"
      )}
      onClick={(e) => {
        if (e.target.classList.contains("character-counter")) {
          setShow(false);
        }
      }}
    >
      <Textarea
        placeholder="Enter some text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <div className="text-5xl font-bold">{text.trim().split(" ").length}</div>
    </div>
  );
}
