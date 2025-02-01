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
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type {
  SwitchControlProps,
  SwitchThumbProps,
} from "@kobalte/core/switch";
import { Switch as SwitchPrimitive } from "@kobalte/core/switch";
import type { ParentProps, ValidComponent, VoidProps } from "solid-js";
import { splitProps } from "solid-js";

export const SwitchLabel = SwitchPrimitive.Label;
export const Switch = SwitchPrimitive;
export const SwitchErrorMessage = SwitchPrimitive.ErrorMessage;
export const SwitchDescription = SwitchPrimitive.Description;

type switchControlProps<T extends ValidComponent = "input"> = ParentProps<
  SwitchControlProps<T> & { class?: string }
>;

export const SwitchControl = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, switchControlProps<T>>
) => {
  const [local, rest] = splitProps(props as switchControlProps, [
    "class",
    "children",
  ]);

  return (
    <>
      <SwitchPrimitive.Input
        class="[&:focus-visible+div]:outline-none [&:focus-visible+div]:ring-[1.5px]
          [&:focus-visible+div]:ring-ring [&:focus-visible+div]:ring-offset-2
          [&:focus-visible+div]:ring-offset-background"
      />
      <SwitchPrimitive.Control
        class={cn(
          `inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2
          border-transparent bg-gray-600/30 backdrop-blur-3xl shadow-sm
          transition-[color,background-color,box-shadow]
          data-[disabled]:cursor-not-allowed data-[checked]:bg-primary
          data-[disabled]:opacity-50`,
          local.class
        )}
        {...rest}
      >
        {local.children}
      </SwitchPrimitive.Control>
    </>
  );
};

type switchThumbProps<T extends ValidComponent = "div"> = VoidProps<
  SwitchThumbProps<T> & { class?: string }
>;

export const SwitchThumb = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, switchThumbProps<T>>
) => {
  const [local, rest] = splitProps(props as switchThumbProps, ["class"]);

  return (
    <SwitchPrimitive.Thumb
      class={cn(
        `pointer-events-none block h-4 w-4 translate-x-0 rounded-full bg-background
        shadow-lg ring-0 transition-transform data-[checked]:translate-x-4`,
        local.class
      )}
      {...rest}
    />
  );
};
