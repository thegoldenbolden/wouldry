"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateUser } from "~/actions/user";
import { Button } from "~/components/ui/button";
import {
  FieldLength,
  Form,
  FormControl,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  UpdateUserSchema,
  fields,
  type UpdateUserOutput,
} from "~/db/validations/user";

export function Edit(initial: UpdateUserOutput) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateUserOutput>({
    resolver: valibotResolver(UpdateUserSchema),
    defaultValues: {
      about: initial.about,
      nickname: initial.nickname,
      username: initial.username,
    },
  });

  const pending =
    isPending || form.formState.isSubmitting || form.formState.isValidating;

  const onSubmit = async (values: UpdateUserOutput) => {
    startTransition(() => {
      if (pending) {
        return;
      }

      toast.promise(
        async () => {
          const response = await updateUser(values);

          if (response?.error) {
            throw response.error;
          }
        },
        {
          loading: "Updating profile..",
          success: "Updated profile",
          error(error) {
            if (error?.message) {
              return error.message;
            }
            return "Failed to update profile";
          },
        },
      );
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 bg-inherit px-2"
      >
        <FormField
          name={fields.username.name}
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="group flex flex-col gap-1.5 rounded bg-inherit py-2">
                <FormLabel className="relative flex w-full items-center justify-between gap-2 px-2 uppercase tracking-widest text-foreground-lighter">
                  <span className="group-has-[input:required]:after:absolute group-has-[input:required]:after:ml-1 group-has-[input:required]:after:text-error group-has-[input:required]:after:content-['*']">
                    {fields[field.name].label}
                  </span>
                  <FieldLength
                    max={fields[field.name].max}
                    min={field.value?.length}
                  />
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    minLength={fields[field.name].min}
                    maxLength={fields[field.name].max}
                    placeholder="Enter a username"
                    className="rounded-md border  border-border p-2"
                    {...field}
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name={fields.nickname.name}
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="group flex flex-col gap-1.5 rounded bg-inherit py-2">
                <FormLabel className="relative flex w-full items-center justify-between gap-2 px-2 uppercase tracking-widest text-foreground-lighter">
                  <span className="group-has-[input:required]:after:absolute group-has-[input:required]:after:ml-1 group-has-[input:required]:after:text-error group-has-[input:required]:after:content-['*']">
                    {fields[field.name].label}
                  </span>
                  <FieldLength
                    max={fields[field.name].max}
                    min={field.value?.length}
                  />
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    minLength={fields[field.name].min}
                    maxLength={fields[field.name].max}
                    placeholder="Enter a display name"
                    className="rounded-md border border-border p-2"
                    {...field}
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name={fields.about.name}
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="group flex flex-col gap-1.5 rounded bg-inherit py-2">
                <FormLabel className="relative flex w-full items-center justify-between gap-2 px-2 uppercase tracking-widest text-foreground-lighter">
                  <span>{fields[field.name].label}</span>
                  <FieldLength
                    max={fields[field.name].max}
                    min={field.value?.length}
                  />
                </FormLabel>
                <FormControl>
                  <Textarea
                    autoComplete="off"
                    placeholder="Tell us about yourself"
                    className="peer min-h-20 resize-none rounded-md border border-border p-2"
                    minLength={fields[field.name].min}
                    maxLength={fields[field.name].max}
                    {...field}
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            );
          }}
        />
        <Button
          aria-disabled={pending}
          size="md"
          className="self-start"
          type="submit"
          fill="primary"
        >
          {pending ? "Saving.." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
