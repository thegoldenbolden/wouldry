import dynamic from "next/dynamic";
import { createContext, useContext, useId, type ComponentProps } from "react";
import { InfoCircle } from "~/components/icons";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

const Slot = dynamic(() => import("@radix-ui/react-slot").then((m) => m.Slot));

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

function useFormField() {
  const { getFieldState, formState } = useFormContext();
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

function FormItem({ className, ref, ...props }: ComponentProps<"div">) {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn(className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({ className, ref, ...props }: ComponentProps<typeof Label>) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-red-600", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FieldLength({
  max = 0,
  min = 0,
  ...props
}: ComponentProps<"span"> & { max?: number; min?: number }) {
  return (
    <span {...props}>
      {min} / {max}
    </span>
  );
}

function FormControl({ ref, ...props }: ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ref, ...props }: ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("py-3", className)}
      {...props}
    />
  );
}

function FormErrorMessage({
  className,
  children,
  ref,
  ...props
}: ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <div className="relative border-l-[3px] border-l-error bg-inherit">
      <span className="absolute left-0 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-error bg-inherit p-1">
        <InfoCircle className="size-4" />
      </span>
      <p
        ref={ref}
        id={formMessageId}
        className={cn(
          "rounded-r-sm bg-error/50 px-6 py-2 text-sm font-medium text-error-foreground",
          className,
        )}
        {...props}
      >
        {body}
      </p>
    </div>
  );
}

export {
  FieldLength,
  Form,
  FormControl,
  FormDescription,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
  useFormField,
};
