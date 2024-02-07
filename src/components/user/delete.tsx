"use client";

import { FormEvent, useTransition } from "react";
import { toast } from "sonner";
import { deleteUser } from "~/actions/user";
import { AlertDialogCancel } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";

export function DeleteAccount(props: React.ComponentProps<"form">) {
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(() => {
      if (pending) {
        return;
      }

      toast.promise(
        async () => {
          const response = await deleteUser();

          if (response?.error) {
            throw response.error;
          }
        },
        {
          loading: "Deleting...",
          error: "Failed to delete account",
          success: "Successfully deleted your account",
        },
      );
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-wrap items-center justify-between gap-6"
      {...props}
    >
      {props.children}
      <div className="flex w-full flex-wrap items-center gap-4">
        <AlertDialogCancel
          ghost="border"
          className="grow basis-0 rounded-md py-1.5"
        >
          Cancel
        </AlertDialogCancel>
        <Button
          aria-disabled={pending}
          fill="danger"
          className="grow basis-0 rounded-md py-1.5"
        >
          Delete
        </Button>
      </div>
    </form>
  );
}
