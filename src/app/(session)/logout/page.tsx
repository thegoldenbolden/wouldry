import { isAuthenticated } from "~/lib/cache/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { redirect } from "next/navigation";
import { logout } from "~/actions/auth";
import { W } from "~/components/icons";
import { links } from "~/lib/links";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logout",
};

export default async function Page() {
  if (!(await isAuthenticated())) {
    redirect("/");
  }

  return (
    <main>
      <form action={logout}>
        <Card className="flex flex-col gap-6 p-6">
          <span className="self-center">
            <W className="size-16" />
          </span>
          <div>
            <h1 className="text-2xl font-bold">Log out of Wouldry?</h1>
            <p className="text-copy-lighter text-center">
              You can always log back in at any time.
            </p>
          </div>
          <div className="px-3 flex flex-col gap-2">
            <Button fill="copy" className="rounded-md px-4 py-2 text-lg">
              Logout
            </Button>
            <Link
              href={links.home.href}
              outline="copy"
              className="rounded-md px-4 py-2 text-lg"
            >
              Home
            </Link>
          </div>
        </Card>
      </form>
    </main>
  );
}
