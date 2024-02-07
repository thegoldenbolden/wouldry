import type { Metadata } from "next";
import { ActiveLink } from "~/components/active-link";
import { Separator } from "~/components/ui/separator";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  title: {
    default: "Search",
    template: "Search %s",
  },
};

export const revalidate = 43200;

export default function Layout(props: React.PropsWithChildren) {
  return (
    <main className="flex flex-col gap-8 p-4">
      <h1 className="relative text-2xl font-bold">Search</h1>
      <nav>
        <ul className="flex h-4 items-center gap-2">
          <li>
            <ActiveLink
              rootPath="/search"
              href={links.searchPolls.href}
              className={{
                default: "relative px-4 font-medium hover:text-primary",
                active:
                  "text-primary after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-1/2 after:-translate-x-1/2 after:bg-primary after:content-['']",
              }}
            >
              Polls
            </ActiveLink>
          </li>
          <Separator orientation="vertical" />
          <li>
            <ActiveLink
              href={links.searchUsers.href}
              className={{
                default: "relative px-4 font-medium hover:text-primary",
                active:
                  "text-primary after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-1/2 after:-translate-x-1/2 after:bg-primary after:content-['']",
              }}
            >
              Users
            </ActiveLink>
          </li>
        </ul>
      </nav>
      <div className="flex flex-col gap-4">{props.children}</div>
    </main>
  );
}
