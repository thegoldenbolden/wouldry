import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Login, logos } from "~/components/icons";
import { Link } from "~/components/ui/link";
import { providers } from "~/lib/auth/providers";
import { isAuthenticated } from "~/lib/cache/react";
import { BRAND_NAME } from "~/lib/constants";
import { links } from "~/lib/links";
import { OAuthErrorMessage } from "./oauth-error";

export const metadata: Metadata = {
  title: "Login",
};

export default async function Page() {
  if (await isAuthenticated()) {
    redirect(links.home.href);
  }

  return (
    <div className="px-3 py-6 flex grow items-center justify-center">
      <main className="flex flex-col justify-center gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login to {BRAND_NAME}?</h1>
          <p className="text-center text-foreground-light">
            Sign in with one of the following
          </p>
          <Suspense>
            <OAuthErrorMessage providers={providers} />
          </Suspense>
        </div>
        <div className="grid grid-cols-1 gap-2 xs:grid-cols-2">
          {providers.map((provider) => {
            const Icon = logos[provider];
            return (
              <Link
                outline="foreground"
                key={provider}
                href={`${links.login.href}/${provider}`}
                className="gap-3 rounded-md px-4 py-3 text-lg text-foreground"
              >
                {Icon ? (
                  <Icon aria-label={`${provider} logo`} className="size-7" />
                ) : (
                  <Login aria-label="login icon" className="size-7" />
                )}
                <span className="capitalize">{provider}</span>
              </Link>
            );
          })}
        </div>
        <p className="mx-auto w-4/5 text-center text-sm font-medium">
          By signing in, you agree to our&nbsp;
          <Link className="inline p-0" text="primary" href={links.terms.href}>
            Terms of Service
          </Link>
          &nbsp;and&nbsp;
          <Link className="inline p-0" text="primary" href={links.privacy.href}>
            Privacy Policy
          </Link>
        </p>
      </main>
    </div>
  );
}
