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
import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuGroupLabelProps,
  DropdownMenuItemLabelProps,
  DropdownMenuItemProps,
  DropdownMenuRadioItemProps,
  DropdownMenuRootProps,
  DropdownMenuSeparatorProps,
  DropdownMenuSubTriggerProps,
} from "@kobalte/core/dropdown-menu";
import { DropdownMenu as DropdownMenuPrimitive } from "@kobalte/core/dropdown-menu";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ComponentProps, ParentProps, ValidComponent } from "solid-js";
import { mergeProps, splitProps } from "solid-js";

export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export const DropdownMenu = (props: DropdownMenuRootProps) => {
  const merge = mergeProps<DropdownMenuRootProps[]>(
    {
      gutter: 4,
      flip: false,
    },
    props
  );

  return <DropdownMenuPrimitive {...merge} />;
};

type dropdownMenuContentProps<T extends ValidComponent = "div"> =
  DropdownMenuContentProps<T> & {
    class?: string;
  };

export const DropdownMenuContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, dropdownMenuContentProps<T>>
) => {
  const [local, rest] = splitProps(props as dropdownMenuContentProps, [
    "class",
  ]);

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        class={cn(
          `min-w-8rem text-popover-foreground focus-visible:ring-ring
          data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0
          data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95
          z-50 overflow-hidden rounded-md bg-black/40 p-1 shadow-md backdrop-blur-3xl
          transition-shadow focus-visible:outline-none focus-visible:ring-[1.5px]`,
          local.class
        )}
        {...rest}
      />
    </DropdownMenuPrimitive.Portal>
  );
};

type dropdownMenuItemProps<T extends ValidComponent = "div"> =
  DropdownMenuItemProps<T> & {
    class?: string;
    inset?: boolean;
  };

export const DropdownMenuItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, dropdownMenuItemProps<T>>
) => {
  const [local, rest] = splitProps(props as dropdownMenuItemProps, [
    "class",
    "inset",
  ]);

  return (
    <DropdownMenuPrimitive.Item
      class={cn(
        `focus:text-accent-foreground relative flex cursor-default select-none
        items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors
        focus:bg-black/20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50`,
        local.inset && "pl-8",
        local.class
      )}
      {...rest}
    />
  );
};

type dropdownMenuGroupLabelProps<T extends ValidComponent = "span"> =
  DropdownMenuGroupLabelProps<T> & {
    class?: string;
  };

export const DropdownMenuGroupLabel = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, dropdownMenuGroupLabelProps<T>>
) => {
  const [local, rest] = splitProps(props as dropdownMenuGroupLabelProps, [
    "class",
  ]);

  return (
    <DropdownMenuPrimitive.GroupLabel
      as="div"
      class={cn("px-2 py-1.5 text-sm font-semibold", local.class)}
      {...rest}
    />
  );
};

type dropdownMenuItemLabelProps<T extends ValidComponent = "div"> =
  DropdownMenuItemLabelProps<T> & {
    class?: string;
  };

export const DropdownMenuItemLabel = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, dropdownMenuItemLabelProps<T>>
) => {
  const [local, rest] = splitProps(props as dropdownMenuItemLabelProps, [
    "class",
  ]);

  return (
    <DropdownMenuPrimitive.ItemLabel
      as="div"
      class={cn("px-2 py-1.5 text-sm font-semibold", local.class)}
      {...rest}
    />
  );
};

type dropdownMenuSeparatorProps<T extends ValidComponent = "hr"> =
  DropdownMenuSeparatorProps<T> & {
    class?: string;
  };

export const DropdownMenuSeparator = <T extends ValidComponent = "hr">(
  props: PolymorphicProps<T, dropdownMenuSeparatorProps<T>>
) => {
  const [local, rest] = splitProps(props as dropdownMenuSeparatorProps, [
    "class",
  ]);

  return (
    <DropdownMenuPrimitive.Separator
      class={cn("bg-muted -mx-1 my-1 h-px", local.class)}
      {...rest}
    />
  );
};

export const DropdownMenuShortcut = (props: ComponentProps<"span">) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <span
      class={cn("ml-auto text-xs tracking-widest opacity-60", local.class)}
      {...rest}
    />
  );
};

type dropdownMenuSubTriggerProps<T extends ValidComponent = "div"> =
  ParentProps<
    DropdownMenuSubTriggerProps<T> & {
      class?: string;
    }
  >;

export const DropdownMenuSubTrigger = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, dropdownMenuSubTriggerProps<T>>
) => {
  const [local, rest] = splitProps(props as dropdownMenuSubTriggerProps, [
    "class",
    "children",
  ]);

  return (
    <DropdownMenuPrimitive.SubTrigger
      class={cn(
        `focus:bg-accent data-[expanded]:bg-accent flex cursor-default select-none
        items-center rounded-sm px-2 py-1.5 text-sm outline-none`,
        local.class
      )}
      {...rest}
    >
      {local.children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        class="ml-auto h-4 w-4"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m9 6l6 6l-6 6"
        />
        <title>Arrow</title>
      </svg>
    </DropdownMenuPrimitive.SubTrigger>
  );
};

type dropdownMenuSubContentProps<T extends ValidComponent = "div"> =
  DropdownMenuSubTriggerProps<T> & {
    class?: string;
  };

export const DropdownMenuSubContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, dropdownMenuSubContentProps<T>>
) => {
  const [local, rest] = splitProps(props as dropdownMenuSubContentProps, [
    "class",
  ]);

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        class={cn(
          `min-w-8rem bg-popover text-popover-foreground data-[expanded]:animate-in
          data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0
          data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95 z-50 overflow-hidden
          rounded-md border p-1 shadow-md`,
          local.class
        )}
        {...rest}
      />
    </DropdownMenuPrimitive.Portal>
  );
};

type dropdownMenuCheckboxItemProps<T extends ValidComponent = "div"> =
  ParentProps<
    DropdownMenuCheckboxItemProps<T> & {
      class?: string;
    }
  >;

export const DropdownMenuCheckboxItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, dropdownMenuCheckboxItemProps<T>>
) => {
  const [local, rest] = splitProps(props as dropdownMenuCheckboxItemProps, [
    "class",
    "children",
  ]);

  return (
    <DropdownMenuPrimitive.CheckboxItem
      class={cn(
        `focus:bg-accent focus:text-accent-foreground relative flex cursor-default
        select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none
        transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50`,
        local.class
      )}
      {...rest}
    >
      <DropdownMenuPrimitive.ItemIndicator class="absolute left-2 inline-flex h-4 w-4 items-center justify-center">
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
            d="m5 12l5 5L20 7"
          />
          <title>Checkbox</title>
        </svg>
      </DropdownMenuPrimitive.ItemIndicator>
      {props.children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
};

type dropdownMenuRadioItemProps<T extends ValidComponent = "div"> = ParentProps<
  DropdownMenuRadioItemProps<T> & {
    class?: string;
  }
>;

export const DropdownMenuRadioItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, dropdownMenuRadioItemProps<T>>
) => {
  const [local, rest] = splitProps(props as dropdownMenuRadioItemProps, [
    "class",
    "children",
  ]);

  return (
    <DropdownMenuPrimitive.RadioItem
      class={cn(
        `focus:bg-accent focus:text-accent-foreground relative flex cursor-default
        select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none
        transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50`,
        local.class
      )}
      {...rest}
    >
      <DropdownMenuPrimitive.ItemIndicator class="absolute left-2 inline-flex h-4 w-4 items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="h-2 w-2"
        >
          <g
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          >
            <path d="M0 0h24v24H0z" />
            <path
              fill="currentColor"
              d="M7 3.34a10 10 0 1 1-4.995 8.984L2 12l.005-.324A10 10 0 0 1 7 3.34"
            />
          </g>
          <title>Radio</title>
        </svg>
      </DropdownMenuPrimitive.ItemIndicator>
      {props.children}
    </DropdownMenuPrimitive.RadioItem>
  );
};
