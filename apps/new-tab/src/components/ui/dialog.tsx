/*
  Copyright © 2023 shadcn Copyright © 2023 hngngn

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
  documentation files (the “Software”), to deal in the Software without restriction, including without limitation the
  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
  PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE 
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
  OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
  DEALINGS IN THE SOFTWARE.
*/

import { cn } from "@/libs/cn";
import type {
  DialogContentProps,
  DialogDescriptionProps,
  DialogTitleProps,
} from "@kobalte/core/dialog";
import { Dialog as DialogPrimitive } from "@kobalte/core/dialog";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ComponentProps, ParentProps, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

export const Dialog = DialogPrimitive;
export const DialogTrigger = DialogPrimitive.Trigger;

type dialogContentProps<T extends ValidComponent = "div"> = ParentProps<
  DialogContentProps<T> & {
    class?: string;
    overlayClass?: string;
  }
>;

export const DialogContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, dialogContentProps<T>>
) => {
  const [local, rest] = splitProps(props as dialogContentProps, [
    "class",
    "children",
    "overlayClass",
  ]);

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        class={cn(
          `dark:bg-background/80 data-[expanded]:animate-in data-[closed]:animate-out
          data-[closed]:fade-out-0 data-[expanded]:fade-in-0 fixed inset-0 z-50
          bg-black/80`,
          local.overlayClass
        )}
        {...rest}
      />
      <div class="z-100 fixed inset-0 flex items-center justify-center p-4">
        <DialogPrimitive.Content
          class={cn(
            `data-[closed]:transform-[scale(95%)] z-50 grid max-h-[60vh] h-full w-full
            max-w-md overflow-y-auto rounded-xl bg-white/60 p-6 backdrop-blur-2xl
            duration-300 ease-out data-[closed]:opacity-0 dark:bg-white/5`,
            local.class
          )}
          {...rest}
        >
          {local.children}
          <DialogPrimitive.CloseButton
            class="ring-offset-background focus:ring-ring absolute right-4 top-4 rounded-sm
              opacity-70 transition-[opacity,box-shadow] hover:opacity-100 focus:outline-none
              focus:ring-[1.5px] focus:ring-offset-2 disabled:pointer-events-none mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="h-4 w-4"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 6L6 18M6 6l12 12"
              />
              <title>{chrome.i18n.getMessage("close")}</title>
            </svg>
          </DialogPrimitive.CloseButton>
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  );
};

type dialogTitleProps<T extends ValidComponent = "h2"> = DialogTitleProps<T> & {
  class?: string;
};

export const DialogTitle = <T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, dialogTitleProps<T>>
) => {
  const [local, rest] = splitProps(props as dialogTitleProps, ["class"]);

  return (
    <DialogPrimitive.Title
      class={cn("text-foreground text-lg font-semibold", local.class)}
      {...rest}
    />
  );
};

type dialogDescriptionProps<T extends ValidComponent = "p"> =
  DialogDescriptionProps<T> & {
    class?: string;
  };

export const DialogDescription = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, dialogDescriptionProps<T>>
) => {
  const [local, rest] = splitProps(props as dialogDescriptionProps, ["class"]);

  return (
    <DialogPrimitive.Description
      class={cn(
        "dark:text-muted-foreground text-sm text-gray-600",
        local.class
      )}
      {...rest}
    />
  );
};

export const DialogHeader = (props: ComponentProps<"div">) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      class={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        local.class
      )}
      {...rest}
    />
  );
};

export const DialogFooter = (props: ComponentProps<"div">) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      class={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        local.class
      )}
      {...rest}
    />
  );
};
