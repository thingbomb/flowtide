import { useState, useEffect } from "react";
import { Textarea } from "@flowtide/ui";
import { Dialog, DialogContent, DialogTitle } from "@flowtide/ui";

export default function CharacterCounter(props: any) {
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
        <DialogTitle>{chrome.i18n.getMessage("character_counter")}</DialogTitle>
        <div className="flex flex-col items-center justify-center">
          <Textarea
            placeholder={chrome.i18n.getMessage("enter_text")}
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
