import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ActiveLink } from "~/components/active-link";
import { isAuthenticated } from "~/lib/cache/react";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function Layout({ children }: React.PropsWithChildren) {
  if (!(await isAuthenticated())) {
    redirect(links.login.href);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <nav
        aria-label="user settings"
        className="w-full rounded-md p-6 sm:max-w-[256px]"
      >
        <ul className="flex flex-col gap-2">
          <li>
            <ActiveLink
              rootPath="/settings"
              className={{
                active:
                  "bg-border after:absolute after:-left-3 after:top-1/2 after:h-1/2 after:w-1 after:-translate-y-1/2 after:rounded-md after:bg-primary after:content-['']",
                default:
                  "relative flex items-center justify-start gap-2 rounded-md p-2 text-lg",
                inactive: "hover:bg-border/80",
              }}
              href={links.settingsProfile.href}
              title={links.settingsProfile.title}
            >
              <links.settingsProfile.icon className="size-4" />
              Profile
            </ActiveLink>
          </li>
          <li>
            <ActiveLink
              className={{
                active:
                  "bg-card after:absolute after:-left-3 after:top-1/2 after:h-1/2 after:w-1 after:-translate-y-1/2 after:rounded-md after:bg-primary after:content-['']",
                default:
                  "relative flex items-center justify-start gap-2 rounded-md p-2 text-lg",
                inactive: "hover:bg-card/80",
              }}
              href={links.settingsAccount.href}
              title={links.settingsAccount.title}
            >
              <links.settingsAccount.icon className="size-4" />
              Account
            </ActiveLink>
          </li>
        </ul>
      </nav>
      <div className="grow p-6">{children}</div>
    </div>
  );
}
