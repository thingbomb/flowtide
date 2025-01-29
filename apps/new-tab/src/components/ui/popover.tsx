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

import { cn } from "../../libs/cn";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type {
  PopoverContentProps,
  PopoverRootProps,
} from "@kobalte/core/popover";
import { Popover as PopoverPrimitive } from "@kobalte/core/popover";
import type { ParentProps, ValidComponent } from "solid-js";
import { mergeProps, splitProps } from "solid-js";

export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverTitle = PopoverPrimitive.Title;
export const PopoverDescription = PopoverPrimitive.Description;

export const Popover = (props: PopoverRootProps) => {
  const merge = mergeProps<PopoverRootProps[]>(
    {
      gutter: 4,
      flip: false,
      placement: "bottom-start",
    },
    props
  );

  return <PopoverPrimitive {...merge} />;
};

type popoverContentProps<T extends ValidComponent = "div"> = ParentProps<
  PopoverContentProps<T> & {
    class?: string;
  }
>;

export const PopoverContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, popoverContentProps<T>>
) => {
  const [local, rest] = splitProps(props as popoverContentProps, [
    "class",
    "children",
  ]);

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        class={cn(
          `text-popover-foreground data-[expanded]:animate-in data-[closed]:animate-out
          data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95
          data-[expanded]:zoom-in-95 z-50 w-72 rounded-md border-none bg-black/30 p-4 pt-1
          shadow-md outline-none backdrop-blur-3xl`,
          local.class
        )}
        {...rest}
      >
        {local.children}
        <PopoverPrimitive.CloseButton
          class="ring-offset-background focus:ring-ring absolute right-4 top-3 rounded-sm
            opacity-70 transition-[opacity,box-shadow] hover:opacity-100 focus:outline-none
            focus:ring-[1.5px] focus:ring-offset-2 disabled:pointer-events-none"
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
        </PopoverPrimitive.CloseButton>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
};
