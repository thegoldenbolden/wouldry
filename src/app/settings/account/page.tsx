import type { Metadata } from "next";

import { ErrorBoundary } from "~/components/error-boundary";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { DeleteAccount } from "~/components/user/delete";
import { getAuthDetails } from "~/lib/cache/react";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  title: links.settingsAccount.title,
  alternates: {
    canonical: links.settingsAccount.href,
  },
};

export default async function Page() {
  const user = await getAuthDetails();

  return (
    <main className="flex w-full flex-col gap-8">
      <section className="flex max-w-xs flex-col gap-4">
        <div className="flex shrink-0 flex-col">
          <Label className="py-2 text-xs font-semibold uppercase tracking-wider text-foreground-light">
            Email
          </Label>
          <Input
            placeholder={user.email}
            className="rounded-md bg-border p-2 text-border-foreground"
            disabled
          />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold capitalize xs:text-xl sm:text-2xl">
          Danger Zone
        </h2>
        <p>
          Deleting your account is a permanent and irreversible action. Your
          account data, settings, and information will be permanently removed
          and cannot be recovered. Please think through this decision carefully.
        </p>
        <AlertDialog>
          <AlertDialogTrigger size="md" outline="danger" className="self-start">
            Delete my account
          </AlertDialogTrigger>
          <AlertDialogContent asChild>
            <Card className="flex w-full max-w-sm flex-col justify-between gap-4 p-0 hover:border-border">
              <ErrorBoundary>
                <DeleteAccount>
                  <div className="text-xl font-medium sm:text-2xl md:text-3xl">
                    Are you sure?
                  </div>
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
    </main>
  );
}
