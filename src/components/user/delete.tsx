"use client";

import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "~/components/ui/alert-dialog";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "~/components/ui/button";
import { deleteUser } from "~/actions/user";
import { toast } from "sonner";

export function DeleteAccount({
  children,
  ...props
}: React.ComponentProps<"form">) {
  const { pending } = useFormStatus();

  const [_, action] = useFormState(async () => {
    if (pending) return;

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
  }, undefined);

  return (
    <form
      action={action}
      className="flex flex-wrap items-center justify-between gap-6"
      {...props}
    >
      {children}
      <AlertDialogFooter className="flex items-center w-full gap-4 flex-wrap">
        <AlertDialogCancel
          outline="copy"
          className="rounded-sm basis-0 grow py-1.5"
        >
          Cancel
        </AlertDialogCancel>
        <Button
          aria-disabled={pending}
          fill="danger"
          className="rounded-sm basis-0 grow py-1.5"
        >
          Delete
        </Button>
      </AlertDialogFooter>
    </form>
  );
}
