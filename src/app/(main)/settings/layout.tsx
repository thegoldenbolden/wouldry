import { ActiveLink } from "~/components/active-link";
import { Separator } from "~/components/ui/separator";
import { isAuthenticated } from "~/lib/cache/react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function Layout({ children }: React.PropsWithChildren) {
  if (!(await isAuthenticated())) {
    redirect(links.login.href);
  }

  return (
    <main className="w-full flex flex-col py-4 px-3 mx-auto max-w-screen-sm gap-6">
      <nav>
        <ul className="flex h-4 items-center gap-2">
          <li>
            <ActiveLink
              parent="/settings"
              href={links.settingsAccount.href}
              active="after:bottom-0 after:absolute text-primary after:content-[''] after:w-1/2 after:bg-primary after:left-1/2 after:-translate-x-1/2 after:h-px"
              className="relative px-4 font-semibold hover:text-primary"
            >
              Account
            </ActiveLink>
          </li>
          <Separator orientation="vertical" />
          <li>
            <ActiveLink
              href={links.settingsProfile.href}
              className="relative px-4 font-semibold hover:text-primary"
              active="after:bottom-0 after:absolute text-primary after:content-[''] after:w-1/2 after:bg-primary after:left-1/2 after:-translate-x-1/2 after:h-px"
            >
              Profile
            </ActiveLink>
          </li>
        </ul>
      </nav>
      {children}
    </main>
  );
}
