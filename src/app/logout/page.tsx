import { Metadata } from "next";
import { redirect } from "next/navigation";
import { logout } from "~/actions/auth";
import { Button } from "~/components/ui/button";
import { Link } from "~/components/ui/link";
import { isAuthenticated } from "~/lib/cache/react";
import { BRAND_NAME } from "~/lib/constants";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  title: "Logout",
};

export default async function Page() {
  if (!(await isAuthenticated())) {
    redirect("/");
  }

  return (
    <div className="flex grow items-center justify-center px-3 py-6">
      <main className="flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Log out of {BRAND_NAME}?</h1>
          <p className="text-foreground-lighter">
            You can always log back in at any time.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 px-3">
          <form action={logout} className="w-full">
            <Button
              fill="foreground"
              className="w-full rounded-md px-4 py-2 text-lg"
            >
              Logout
            </Button>
          </form>
          <Link
            href={links.home.href}
            outline="border"
            className="rounded-md px-4 py-2 text-lg"
          >
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}
