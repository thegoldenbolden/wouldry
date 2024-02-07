"use client";

import { useState } from "react";
import { toast } from "sonner";
import { findComments } from "~/actions/comment";
import { useCommentMutation } from "~/components/comment/use-mutation";
import { Button } from "~/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  type DialogTriggerProps,
} from "~/components/ui/dialog";

type Permissions = NonNullable<
  Awaited<ReturnType<typeof findComments>>["data"]
>["results"][number]["permissions"];

type MoreProps = DialogTriggerProps & {
  commentId: string;
  contentId: string;
  permissions: Permissions;
};

export function More({
  children,
  commentId,
  contentId,
  permissions,
  ...props
}: MoreProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const mutation = useCommentMutation();

  if (!permissions.deletable) {
    // TODO: Remove once I add more than a delete action
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger title="More" {...props}>
        {children}
      </DialogTrigger>
      <DialogContent className="flex max-w-xs flex-col gap-0 divide-y divide-border rounded-md p-0">
        <Button
          size="md"
          ghost="border"
          className="justify-center rounded-none text-error hover:text-error"
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
          size="md"
          ghost="border"
          className="justify-center rounded-none"
          onClick={close}
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
