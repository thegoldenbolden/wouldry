"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
  fields as pollFields,
  type CreatePollOutput,
} from "~/db/validations/poll";
import { Plus, X } from "~/components/icons";

export function PollForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreatePollOutput>({
    resolver: valibotResolver(CreatePollSchema),
    defaultValues: {
      title: "",
      description: "",
      enable_comments: true,
      options: [{ value: "" }, { value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "options",
    control: form.control,
    rules: {
      required: true,
      minLength: pollFields.options.minOptions,
      maxLength: pollFields.options.maxOptions,
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
        className="flex max-w-2xl flex-col gap-4 border border-border bg-background p-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name={pollFields.title.name}
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="group flex flex-col gap-1.5 rounded bg-inherit py-2">
                <FormLabel className="relative flex w-full items-center justify-between gap-2 px-2 font-chillax uppercase tracking-widest text-foreground-lighter">
                  <span className="group-has-[input:required]:after:absolute group-has-[input:required]:after:ml-1 group-has-[input:required]:after:text-error group-has-[input:required]:after:content-['*']">
                    {pollFields[field.name].label}
                  </span>
                  <FieldLength
                    max={pollFields[field.name].max}
                    min={field.value?.length}
                  />
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    required
                    minLength={pollFields.title.min}
                    maxLength={pollFields.title.max}
                    className="rounded-md border border-border p-2"
                    placeholder="Chocolate Lovers"
                    {...field}
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            );
          }}
        />
        <div className="flex flex-col gap-2 bg-inherit">
          <ul className="grid grid-cols-1 gap-x-4 gap-y-2 bg-inherit sm:grid-cols-2">
            {fields.map((array, index) => {
              const canAdd = pollFields.options.maxOptions > fields.length;
              const canRemove = pollFields.options.minOptions < fields.length;

              return (
                <li key={array.id} className="bg-inherit">
                  <FormField
                    name={`options.${index}.value`}
                    render={({ field }) => {
                      return (
                        <FormItem className="group flex flex-col gap-1.5 rounded bg-inherit py-2 sm:basis-1/2">
                          <FormLabel className="relative flex w-full items-center justify-between gap-2 px-2 font-chillax uppercase tracking-widest text-foreground-lighter">
                            <span className="group-has-[textarea:required]:after:absolute group-has-[textarea:required]:after:ml-1 group-has-[textarea:required]:after:text-error group-has-[textarea:required]:after:content-['*']">
                              Option {index + 1}
                            </span>
                            <FieldLength
                              max={pollFields.options.max}
                              min={field.value?.length}
                            />
                          </FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input
                                autoComplete="off"
                                required
                                minLength={pollFields.options.min}
                                maxLength={pollFields.options.max}
                                className="grow rounded-md border border-border p-2"
                                placeholder="Enter an option"
                                {...field}
                              />
                            </FormControl>
                            <Button
                              size="icon"
                              aria-disabled={!canAdd}
                              type="submit"
                              outline="border"
                              aria-label="add option"
                              title="add option"
                              className="aspect-square"
                              onClick={() => canAdd && append({ value: "" })}
                            >
                              <Plus />
                            </Button>
                            <Button
                              size="icon"
                              aria-label="remove option"
                              type="submit"
                              aria-disabled={!canRemove}
                              outline="border"
                              className="aspect-square"
                              title="remove option"
                              onClick={() => canRemove && remove(index)}
                            >
                              <X />
                            </Button>
                          </div>
                          <FormErrorMessage />
                        </FormItem>
                      );
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        <FormField
          name={pollFields.description.name}
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="group flex flex-col gap-1.5 rounded bg-inherit py-2">
                <FormLabel className="relative flex w-full items-center justify-between gap-2 px-2 font-chillax uppercase tracking-widest text-foreground-lighter">
                  <span>{pollFields[field.name].label}</span>
                  <FieldLength
                    max={pollFields[field.name].max}
                    min={field.value?.length}
                  />
                </FormLabel>
                <FormControl>
                  <Textarea
                    autoComplete="off"
                    placeholder="Add a description"
                    className="peer min-h-20 resize-y rounded-md border border-border p-2"
                    minLength={pollFields[field.name].min}
                    maxLength={pollFields[field.name].max}
                    {...field}
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name={pollFields.enable_comments.name}
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="flex items-center gap-1 bg-inherit p-2 leading-none">
                <div className="flex grow flex-col gap-1">
                  <FormLabel className="flex w-full items-center justify-between font-chillax uppercase tracking-widest text-foreground-lighter">
                    {pollFields[field.name].label}
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
        <Button
          aria-disabled={pending}
          fill="primary"
          type="submit"
          size="md"
          className="basis-1/5 gap-4 self-start rounded-md font-chillax font-bold uppercase"
        >
          {pending ? "Creating.." : "Create"}
        </Button>
      </form>
    </Form>
  );
}
