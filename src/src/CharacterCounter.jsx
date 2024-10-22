import { useState } from "react";
import { Textarea } from "./components/ui/textarea";
import { Dialog, DialogContent } from "./components/ui/dialog";
import { useEffect } from "react";

export default function CharacterCounter(props) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(true);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        props.setSelectedPage("none");
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Character Counter</DialogTitle>
        <div className="flex flex-col items-center justify-center">
          <Textarea
            placeholder="Enter some text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full mb-4"
          />
          <div className="text-5xl font-bold">{text.length}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
