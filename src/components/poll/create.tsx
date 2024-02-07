"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createPoll } from "~/actions/poll";
import { Button } from "~/components/ui/button";
import {
  FieldLength,
  Form,
  FormControl,
  FormDescription,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import {
  CreatePollSchema,
  fields,
  type CreatePollOutput,
} from "~/db/validations/poll";

export function PollForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreatePollOutput>({
    resolver: valibotResolver(CreatePollSchema),
    defaultValues: {
      [fields.enable_comments.name]: true,
      [fields.title.name]: "",
      [fields.description.name]: "",
      [fields.option_one.name]: "",
      [fields.option_two.name]: "",
    },
  });

  const pending =
    isPending || form.formState.isSubmitting || form.formState.isValidating;

  const onSubmit = async (values: CreatePollOutput) => {
    startTransition(() => {
      if (pending) {
        return;
      }

      toast.promise(
        async () => {
          await createPoll(values);
          form.reset();
        },
        {
          loading: "Creating poll..",
          error: "Something unexpected happened",
          success: `Created ${values.title}`,
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
          name={fields.title.name}
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="group flex flex-col gap-1.5 rounded bg-inherit py-2">
                <FormLabel className="relative flex w-full items-center justify-between gap-2 px-2 font-chillax uppercase tracking-widest text-foreground-lighter">
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
                    required
                    minLength={fields.title.min}
                    maxLength={fields.title.max}
                    className="rounded-md border  border-border p-2"
                    placeholder="Chocolate Lovers"
                    {...field}
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            );
          }}
        />
        <div className="flex flex-col gap-2 bg-inherit sm:flex-row sm:gap-4">
          <FormField
            name={fields.option_one.name}
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem className="group flex flex-col gap-1.5 rounded bg-inherit py-2 sm:basis-1/2">
                  <FormLabel className="relative flex w-full items-center justify-between gap-2 px-2 font-chillax uppercase tracking-widest text-foreground-lighter">
                    <span className="group-has-[textarea:required]:after:absolute group-has-[textarea:required]:after:ml-1 group-has-[textarea:required]:after:text-error group-has-[textarea:required]:after:content-['*']">
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
                      className="peer min-h-20 resize-y rounded-md border  border-border p-2"
                    />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            name={fields.option_two.name}
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem className="group flex flex-col gap-1.5 rounded bg-inherit py-2 sm:basis-1/2">
                  <FormLabel className="relative flex w-full items-center justify-between gap-2 px-2 font-chillax uppercase tracking-widest text-foreground-lighter">
                    <span className="group-has-[textarea:required]:after:absolute group-has-[textarea:required]:after:ml-1 group-has-[textarea:required]:after:text-error group-has-[textarea:required]:after:content-['*']">
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
                      className="peer min-h-20 resize-y rounded-md border border-border p-2"
                    />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <FormField
          name={fields.description.name}
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="group flex flex-col gap-1.5 rounded bg-inherit py-2">
                <FormLabel className="relative flex w-full items-center justify-between gap-2 px-2 font-chillax uppercase tracking-widest text-foreground-lighter">
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
                    className="peer min-h-20 resize-y rounded-md border border-border p-2"
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
              <FormItem className="flex items-center gap-1 bg-inherit p-2 leading-none">
                <div className="flex grow flex-col gap-1">
                  <FormLabel className="flex w-full items-center justify-between font-chillax uppercase tracking-widest text-foreground-lighter">
                    {fields[field.name].label}
                  </FormLabel>
                  <FormDescription>
                    Allow users to comment on this post.
                  </FormDescription>
                </div>

                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
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
            size="md"
            className="basis-1/5 gap-4 self-start rounded-md font-chillax font-bold uppercase"
          >
            {pending ? "Creating.." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
