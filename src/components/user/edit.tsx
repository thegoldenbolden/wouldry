"use client";

import { fields, ProfileSchema, type ProfileOutput } from "~/lib/validate/user";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { updateUser } from "~/actions/user";
import { Save } from "~/components/icons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FieldLength,
  FormErrorMessage,
} from "~/components/ui/form";

export function Edit(initial: ProfileOutput) {
  const form = useForm<ProfileOutput>({
    resolver: valibotResolver(ProfileSchema),
    defaultValues: {
      biography: initial.biography,
      display_name: initial.display_name,
      username: initial.username,
    },
  });

  const pending = form.formState.isSubmitting || form.formState.isValidating;

  const onSubmit = async (values: ProfileOutput) => {
    if (pending) return;
    toast.promise(
      async () => {
        const response = await updateUser(values);

        if (response?.error) {
          throw { message: response.error };
        }
      },
      {
        loading: "Updating profile..",
        success: "Successfully updated profile",
        error(error) {
          if (error?.message) {
            return error.message;
          }
          return "Failed to update profile";
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 px-2 bg-inherit"
      >
        <FormField
          name={fields.username.name}
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="group flex flex-col bg-inherit gap-1.5 rounded py-2">
                <FormLabel className="relative px-2 flex w-full items-center justify-between gap-2 uppercase tracking-widest text-copy-lighter">
                  <span className="group-has-[input:required]:after:absolute group-has-[input:required]:after:content-['*'] group-has-[input:required]:after:text-danger group-has-[input:required]:after:ml-1">
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
                    className="p-2 border border-border rounded-md"
                    {...field}
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name={fields.display_name.name}
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="group flex flex-col bg-inherit gap-1.5 rounded py-2">
                <FormLabel className="relative px-2 flex w-full items-center justify-between gap-2 uppercase tracking-widest text-copy-lighter">
                  <span className="group-has-[input:required]:after:absolute group-has-[input:required]:after:content-['*'] group-has-[input:required]:after:text-danger group-has-[input:required]:after:ml-1">
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
                    className="p-2 border border-border rounded-md"
                    {...field}
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name={fields.biography.name}
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="group flex flex-col bg-inherit gap-1.5 rounded py-2">
                <FormLabel className="relative px-2 flex w-full items-center justify-between gap-2 uppercase tracking-widest text-copy-lighter">
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
                    className="border border-border peer resize-none p-2 rounded-md min-h-20"
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
          size="sm"
          className="gap-2 rounded-full disabled:opacity-75"
          type="submit"
          fill="primary"
        >
          <Save className="size-4" />
          {pending ? "Saving.." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
