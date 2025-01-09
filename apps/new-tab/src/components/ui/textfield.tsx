import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type {
  TextFieldDescriptionProps,
  TextFieldErrorMessageProps,
  TextFieldInputProps,
  TextFieldLabelProps,
  TextFieldRootProps,
} from "@kobalte/core/text-field";
import { TextField as TextFieldPrimitive } from "@kobalte/core/text-field";
import { cva } from "class-variance-authority";
import type { ValidComponent, VoidProps } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "../../libs/cn";

type textFieldProps<T extends ValidComponent = "div"> =
  TextFieldRootProps<T> & {
    class?: string;
  };

export const TextFieldRoot = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, textFieldProps<T>>
) => {
  const [local, rest] = splitProps(props as textFieldProps, ["class"]);

  return <TextFieldPrimitive class={cn("space-y-1", local.class)} {...rest} />;
};

export const textfieldLabel = cva(
  "text-sm data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70 font-medium",
  {
    variants: {
      label: {
        true: "data-[invalid]:text-destructive",
      },
      error: {
        true: "text-destructive text-xs",
      },
      description: {
        true: "font-normal text-muted-foreground",
      },
    },
    defaultVariants: {
      label: true,
    },
  }
);

type textFieldLabelProps<T extends ValidComponent = "label"> =
  TextFieldLabelProps<T> & {
    class?: string;
  };

export const TextFieldLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, textFieldLabelProps<T>>
) => {
  const [local, rest] = splitProps(props as textFieldLabelProps, ["class"]);

  return (
    <TextFieldPrimitive.Label
      class={cn(textfieldLabel(), local.class)}
      {...rest}
    />
  );
};

type textFieldErrorMessageProps<T extends ValidComponent = "div"> =
  TextFieldErrorMessageProps<T> & {
    class?: string;
  };

export const TextFieldErrorMessage = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, textFieldErrorMessageProps<T>>
) => {
  const [local, rest] = splitProps(props as textFieldErrorMessageProps, [
    "class",
  ]);

  return (
    <TextFieldPrimitive.ErrorMessage
      class={cn(textfieldLabel({ error: true }), local.class)}
      {...rest}
    />
  );
};

type textFieldDescriptionProps<T extends ValidComponent = "div"> =
  TextFieldDescriptionProps<T> & {
    class?: string;
  };

export const TextFieldDescription = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, textFieldDescriptionProps<T>>
) => {
  const [local, rest] = splitProps(props as textFieldDescriptionProps, [
    "class",
  ]);

  return (
    <TextFieldPrimitive.Description
      class={cn(
        textfieldLabel({ description: true, label: false }),
        local.class
      )}
      {...rest}
    />
  );
};

type textFieldInputProps<T extends ValidComponent = "input"> = VoidProps<
  TextFieldInputProps<T> & {
    class?: string;
  }
>;

export const TextField = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, textFieldInputProps<T>>
) => {
  const [local, rest] = splitProps(props as textFieldInputProps, ["class"]);

  return (
    <TextFieldPrimitive.Input
      class={cn(
        "block w-full rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black focus:outline-2 focus:-outline-offset-2 focus:outline-black/25 dark:bg-white/5 dark:text-white dark:shadow-inner dark:shadow-white/10 dark:focus:outline-white/25",
        local.class
      )}
      {...rest}
    />
  );
};
