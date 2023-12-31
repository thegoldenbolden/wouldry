"use client";

import { useCommentMutation } from "~/components/comment/use-mutation";
import { Button, type ButtonProps } from "~/components/ui/button";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { RelativeDate } from "~/components/relative-date";
import { Textarea } from "~/components/ui/textarea";
import { createAvatarBorder } from "~/lib/utils";
import { Avatar } from "~/components/avatar";
import { Link } from "~/components/ui/link";
import { useForm } from "react-hook-form";
import { links } from "~/lib/links";
import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogTriggerProps,
} from "~/components/ui/dialog";

import {
  CreateCommentOutput,
  CreateCommentSchema,
  fields,
} from "~/lib/validate/comment";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormErrorMessage,
} from "~/components/ui/form";

type ReplyProps = ButtonProps & {
  contentId: string;
  comment?: {
    id: string;
    createdAt: Date;
    author: {
      username: string;
      image: string;
      accentColor: string;
      name: string;
    } | null;
    body: string;
  } | null;
};

export function Reply({ comment, contentId, children, ...props }: ReplyProps) {
  const Message = () => {
    if (!comment) {
      return null;
    }

    return (
      <div className="py-6 flex flex-col gap-2">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex grow items-end gap-2">
            <Avatar
              style={createAvatarBorder(comment.author?.accentColor)}
              className="size-6 rounded-full"
              src={comment.author?.image}
              alt={comment.author?.username || "An"}
            />
            {comment.author ? (
              <Link
                className="inline"
                text="copy"
                href={links.profile.href(comment.author.username)}
              >
                {comment.author.name}
              </Link>
            ) : (
              <span>Anonymous</span>
            )}
          </div>
          <RelativeDate ago={false} date={comment.createdAt} style="narrow" />
        </div>
        <p>{comment.body}</p>
      </div>
    );
  };

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
        className="p-1 rounded-sm"
        ghost="primary"
        title="Reply"
        {...props}
      >
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg truncate w-full">
        <DialogTitle className="sr-only">Add Comment</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="py-4 px-2 flex text-ellipsis overflow-hidden w-full flex-col divide-border divide-y gap-3"
          >
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogClose
                text="copy"
                title="Cancel"
                className="hover:no-underline rounded-sm"
              >
                Cancel
              </DialogClose>
              <Button
                fill="primary"
                className="px-5 rounded-full py-1"
                type="submit"
              >
                Reply
              </Button>
            </DialogHeader>
            <Message />
            <FormField
              name={fields.body.name}
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="sr-only">add a comment</FormLabel>
                  <div className="flex flex-col gap-2">
                    <FormControl>
                      <Textarea
                        className="w-full p-2 grow rounded-sm outline-border outline outline-1 transition-all hover:outline-2 focus-visible:outline-2"
                        required
                        placeholder={!comment ? "Add a comment.." : "Reply.."}
                        aria-required
                        autoComplete="off"
                        minLength={fields[field.name].min}
                        maxLength={fields[field.name].max}
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between">
                      <FormErrorMessage />
                      <span className="ml-auto">
                        {fields[field.name].max - field.value.length}
                      </span>
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

type MoreProps = DialogTriggerProps & {
  commentId: string;
  contentId: string;
  owner: boolean;
};

export function More({
  children,
  commentId,
  owner,
  contentId,
  ...props
}: MoreProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const mutation = useCommentMutation();

  if (!owner) {
    // TODO: Remove once I add more than a delete action
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger title="More" {...props}>
        {children}
      </DialogTrigger>
      <DialogContent className="flex overflow-clip max-w-xs flex-col gap-0 p-0 divide-y divide-border">
        <Button
          size="sm"
          ghost="copy"
          className="justify-center"
          onClick={() => {
            toast.promise(
              async () => {
                await mutation.mutateAsync({
                  type: "delete",
                  commentId,
                  contentId,
                });
                close();
              },
              {
                loading: "Deleting comment..",
                error: "Failed to delete comment",
                success: "Deleted comment",
              },
            );
          }}
        >
          Delete
        </Button>
        <Button
          size="sm"
          ghost="copy"
          className="justify-center"
          onClick={close}
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
