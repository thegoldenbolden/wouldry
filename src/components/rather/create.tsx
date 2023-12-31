"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "~/components/ui/checkbox";
import { Textarea } from "~/components/ui/textarea";
import { Spinner } from "~/components/ui/spinner";
import { Button } from "~/components/ui/button";
import { createRather } from "~/actions/rather";
import { Input } from "~/components/ui/input";
import { queryKeys } from "~/lib/query-keys";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  fields,
  CreateRatherSchema,
  type CreateRatherOutput,
} from "~/lib/validate/rather";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormErrorMessage,
  FieldLength,
} from "~/components/ui/form";

export function RatherForm({ username }: { username: string }) {
  const client = useQueryClient();
  const form = useForm({
    resolver: valibotResolver(CreateRatherSchema),
    defaultValues: {
      [fields.enable_comments.name]: true,
      [fields.title.name]: "",
      [fields.description.name]: "",
      [fields.choice_one.name]: "",
      [fields.choice_two.name]: "",
    },
  });

  const onSubmit = async (values: CreateRatherOutput) => {
    toast.promise(
      async () => {
        const response = await createRather(values);

        if (response.error) {
          throw response.error;
        }

        client.invalidateQueries({ queryKey: queryKeys.rathers({ username }) });
        form.reset();
        return { slug: response.slug, number: response.number };
      },
      {
        loading: "Creating rather..",
        error: "Something unexpected happened",
        success: `Created ${values.title}`,
      },
    );
  };

  const pending = form.formState.isSubmitting || form.formState.isValidating;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 px-2 bg-inherit"
      >
        <FormField
          name={fields.title.name}
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
                    required
                    minLength={fields.title.min}
                    maxLength={fields.title.max}
                    className="p-2 border border-border rounded-md"
                    placeholder="Chocolate Lovers"
                    {...field}
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name={fields.choice_one.name}
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="group flex flex-col bg-inherit gap-1.5 rounded py-2">
                <FormLabel className="relative px-2 flex w-full items-center justify-between gap-2 uppercase tracking-widest text-copy-lighter">
                  <span className="group-has-[textarea:required]:after:absolute group-has-[textarea:required]:after:ml-1 group-has-[textarea:required]:after:content-['*'] group-has-[textarea:required]:after:text-danger">
                    {fields[field.name].label}
                  </span>
                  <FieldLength
                    max={fields[field.name].max}
                    min={field.value?.length}
                  />
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Twix"
                    {...field}
                    minLength={fields[field.name].min}
                    maxLength={fields[field.name].max}
                    required
                    aria-required
                    className="border border-border peer resize-none p-2 rounded-md min-h-20"
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name={fields.choice_two.name}
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="group flex flex-col bg-inherit gap-1.5 rounded py-2">
                <FormLabel className="relative px-2 flex w-full items-center justify-between gap-2 uppercase tracking-widest text-copy-lighter">
                  <span className="group-has-[textarea:required]:after:absolute group-has-[textarea:required]:after:ml-1 group-has-[textarea:required]:after:content-['*'] group-has-[textarea:required]:after:text-danger">
                    {fields[field.name].label}
                  </span>
                  <FieldLength
                    max={fields[field.name].max}
                    min={field.value?.length}
                  />
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Snickers"
                    {...field}
                    minLength={fields[field.name].min}
                    maxLength={fields[field.name].max}
                    required
                    aria-required
                    className="border border-border peer resize-none p-2 rounded-md min-h-20"
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name={fields.description.name}
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
                    placeholder="Add a description"
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
        <FormField
          name={fields.enable_comments.name}
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="py-2">
                <FormLabel className="relative px-2 flex w-full items-center justify-between gap-2 uppercase tracking-widest text-copy-lighter">
                  {fields[field.name].label}
                </FormLabel>
                <div className="flex items-center p-2 gap-2 leading-none">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="rounded-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    Allow users to comment on this rather
                  </FormDescription>
                </div>
                <FormErrorMessage />
              </FormItem>
            );
          }}
        />
        <div className="flex justify-end py-1.5">
          <Button
            aria-disabled={pending}
            fill="primary"
            type="submit"
            size="sm"
            className="rounded-full w-full"
          >
            {pending && <Spinner />}
            {pending ? "Creating.." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
