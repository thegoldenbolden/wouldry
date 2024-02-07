"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Comment } from "~/components/comment";
import { useCommentMutation } from "~/components/comment/use-mutation";
import { Button, type ButtonProps } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  FieldLength,
  Form,
  FormControl,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import {
  CreateCommentSchema,
  fields,
  type CreateCommentOutput,
} from "~/db/validations/comment";

type ReplyProps = ButtonProps & {
  contentId: string;
  comment?: {
    id: string;
    createdAt: Date;
    author: {
      username: string;
      image: string;
      nickname: string;
    } | null;
    body: string;
  } | null;
};

export function Reply({ comment, contentId, children, ...props }: ReplyProps) {
  const form = useForm({
    reValidateMode: "onChange",
    resolver: valibotResolver(CreateCommentSchema),
    defaultValues: {
      [fields.body.name]: "",
      [fields.contentId.name]: contentId,
    },
  });

  const mutation = useCommentMutation();
  const [open, setOpen] = useState(false);

  const onSubmit = async (values: CreateCommentOutput) => {
    if (mutation.isPending) return;

    toast.promise(
      async () => {
        await mutation.mutateAsync({
          type: "add",
          ...values,
          ...(comment && { parentId: comment.id }),
        });
        form.reset();
        setOpen(false);
      },
      {
        loading: "Adding comment..",
        error: "There was an error comment",
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="rounded-md p-1"
        ghost="primary"
        title="Reply"
        {...props}
      >
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-svh w-11/12 max-w-lg overflow-auto rounded-md border-none p-0">
        <DialogTitle className="sr-only">Add Comment</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full max-w-lg flex-col gap-6 rounded-inherit p-6"
          >
            {!comment ? null : (
              <Comment className="text-ellipsis">
                <Comment.Content>
                  <Comment.Header>
                    <Comment.Avatar
                      image={comment.author?.image}
                      username={comment.author?.username}
                      alt={comment.author?.username}
                      className="size-7 min-w-7"
                    />
                    <Comment.Author
                      nickname={comment.author?.nickname}
                      username={comment.author?.username}
                    />
                    <Comment.Date date={comment.createdAt} />
                  </Comment.Header>
                  <Comment.Message>{comment.body}</Comment.Message>
                </Comment.Content>
              </Comment>
            )}

            <FormField
              name={fields.body.name}
              control={form.control}
              render={({ field }) => (
                <FormItem className="group flex flex-col gap-1.5 rounded bg-inherit py-2 sm:basis-1/2">
                  <FormLabel className="relative flex w-full items-center justify-between gap-2 px-2 font-chillax uppercase tracking-widest text-foreground-lighter">
                    <span className="group-has-[textarea:required]:after:absolute group-has-[textarea:required]:after:ml-1 group-has-[textarea:required]:after:text-error group-has-[textarea:required]:after:content-['*']">
                      {!comment ? "Add a comment" : "Add a reply"}
                    </span>
                    <FieldLength
                      max={fields[field.name].max}
                      min={field.value?.length}
                    />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      minLength={fields[field.name].min}
                      maxLength={fields[field.name].max}
                      required
                      aria-required
                      className="peer min-h-24 resize-none rounded-md border  border-border p-2"
                    />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-wrap items-center justify-between gap-2 px-2 text-sm uppercase tracking-wide">
              <DialogClose
                ghost="border"
                title="Cancel"
                className="hover:no-underline"
              >
                Cancel
              </DialogClose>
              <Button type="submit" size="md" fill="primary">
                Reply
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
