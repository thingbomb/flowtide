import { cn } from "../../libs/cn";
import type {
  CommandDialogProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandInputProps,
  CommandItemProps,
  CommandListProps,
  CommandRootProps,
} from "cmdk-solid";
import { Command as CommandPrimitive } from "cmdk-solid";
import type { ComponentProps, VoidProps } from "solid-js";
import { splitProps } from "solid-js";
import { Dialog, DialogContent } from "./dialog";

export const Command = (props: CommandRootProps) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CommandPrimitive
      class={cn(
        "text-popover-foreground flex size-full flex-col overflow-hidden bg-white/5",
        local.class
      )}
      {...rest}
    />
  );
};

export const CommandList = (props: CommandListProps) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CommandPrimitive.List
      class={cn(
        "max-h-[300px] overflow-y-auto overflow-x-hidden p-1",
        local.class
      )}
      {...rest}
    />
  );
};

export const CommandInput = (props: VoidProps<CommandInputProps>) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      class="flex items-center border-b border-white/10 px-3"
      cmdk-input-wrapper=""
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="mr-2 h-4 w-4 shrink-0 opacity-50"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6"
        />
        <title>{chrome.i18n.getMessage("search")}</title>
      </svg>
      <CommandPrimitive.Input
        class={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
          local.class
        )}
        {...rest}
      />
    </div>
  );
};

export const CommandItem = (props: CommandItemProps) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CommandPrimitive.Item
      class={cn(
        "aria-selected:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-selected:bg-black/10 dark:aria-selected:bg-white/10",
        local.class
      )}
      {...rest}
    />
  );
};

export const CommandShortcut = (props: ComponentProps<"span">) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <span
      class={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        local.class
      )}
      {...rest}
    />
  );
};

export const CommandDialog = (props: CommandDialogProps) => {
  const [local, rest] = splitProps(props, ["children"]);

  return (
    <Dialog {...rest}>
      <DialogContent class="overflow-hidden p-0">
        <Command class="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5">
          {local.children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export const CommandEmpty = (props: CommandEmptyProps) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CommandPrimitive.Empty
      class={cn("py-6 text-center text-sm", local.class)}
      {...rest}
    />
  );
};

export const CommandGroup = (props: CommandGroupProps) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CommandPrimitive.Group
      class={cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        local.class
      )}
      {...rest}
    />
  );
};

export const CommandSeparator = (props: CommandEmptyProps) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CommandPrimitive.Separator
      class={cn("bg-border -mx-1 h-px", local.class)}
      {...rest}
    />
  );
};
