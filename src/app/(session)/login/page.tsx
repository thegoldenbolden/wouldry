import { Discord, Google, Twitch } from "~/components/icons";
import { isAuthenticated } from "~/lib/cache/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { redirect } from "next/navigation";
import { login } from "~/actions/auth";
import { links } from "~/lib/links";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default async function Page() {
  if (await isAuthenticated()) {
    redirect("/");
  }

  return (
    <main>
      <Card className="flex flex-col gap-6 px-4 py-6 sm:px-6">
        <h1 className="text-copy-light font-bold text-center">Sign in with</h1>
        <form action={login} className="grid grid-cols-1 xs:grid-cols-2 gap-2">
          <Button
            outline="copy"
            className="rounded-full gap-3 px-4 py-3 text-lg"
            name="provider"
            value="discord"
          >
            <Discord className="size-7" />
            <span className="capitalize">Discord</span>
          </Button>
          <Button
            outline="copy"
            className="rounded-full gap-3 px-4 py-3 text-lg"
            name="provider"
            value="google"
          >
            <Google className="size-7" />
            <span className="capitalize">Google</span>
          </Button>
          <Button
            outline="copy"
            className="rounded-full gap-3 px-4 py-3 text-lg"
            name="provider"
            value="twitch"
          >
            <Twitch className="size-7" />
            <span className="capitalize">Twitch</span>
          </Button>
        </form>
        <p className="text-center text-sm w-4/5  mx-auto">
          By signing in, you agree to our&nbsp;
          <Link text="primary" href={links.terms.href}>
            Terms of Service
          </Link>
          &nbsp;and&nbsp;
          <Link text="primary" href={links.privacy.href}>
            Privacy Policy
          </Link>
          .
        </p>
      </Card>
    </main>
  );
}
