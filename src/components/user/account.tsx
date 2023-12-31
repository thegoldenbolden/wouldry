import { ErrorBoundary } from "~/components/error-boundary";
import { DeleteAccount } from "~/components/user/delete";
import { getAuthDetails } from "~/lib/cache/react";
import { Card } from "~/components/ui/card";

import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
} from "~/components/ui/alert-dialog";

export async function Account() {
  const user = await getAuthDetails();

  return (
    <div className="flex w-full flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h3 className="border-b border-border py-2 text-xs font-semibold uppercase tracking-wider text-copy-light">
          Contact
        </h3>
        <Card className="flex p-4 flex-col">
          <span className="py-2 text-xs font-semibold uppercase tracking-wider text-copy-light">
            Email
          </span>
          <span className="rounded-md text-copy-light">{user.email}</span>
        </Card>
      </section>

      <section className="inline-flex flex-col gap-4">
        <h2 className="text-lg font-semibold capitalize xs:text-xl sm:text-2xl">
          Danger Zone
        </h2>
        <p className="text-sm tracking-wide">
          Deleting your account is a permanent and irreversible action. Your
          account data, settings, and information will be permanently removed
          and cannot be recovered. Please think through this decision
          thoughtfully, and reach out to our support team if you need
          assistance.
        </p>
        <AlertDialog>
          <AlertDialogTrigger className="inline shrink-0 bg-danger text-danger-content px-3 py-2 rounded-full hover:bg-danger/75 pressed:bg-danger/75">
            Delete my account
          </AlertDialogTrigger>
          <AlertDialogContent asChild>
            <Card className="flex flex-col max-w-sm w-full justify-between gap-4 hover:border-border p-0">
              <ErrorBoundary>
                <DeleteAccount>
                  <AlertDialogHeader className="text-xl sm:text-2xl md:text-3xl">
                    Are you sure?
                  </AlertDialogHeader>
                  <AlertDialogDescription>
                    This action cannot be undone. When you delete your account,
                    all references to your account will be removed.
                  </AlertDialogDescription>
                </DeleteAccount>
              </ErrorBoundary>
            </Card>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}
