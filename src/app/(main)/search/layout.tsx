import { ActiveLink } from "~/components/active-link";
import { Separator } from "~/components/ui/separator";
import type { Metadata } from "next";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  title: {
    default: "Search",
    template: "Search %s",
  },
};

export default function Layout(props: React.PropsWithChildren) {
  return (
    <main className="flex flex-col gap-8 p-4">
      <h1 className="relative text-2xl font-bold">Search</h1>
      <nav>
        <ul className="flex h-4 items-center gap-2">
          <li>
            <ActiveLink
              parent="/search"
              href={links.searchRathers.href}
              active="after:bottom-0 after:absolute text-primary after:content-[''] after:w-1/2 after:bg-primary after:left-1/2 after:-translate-x-1/2 after:h-px"
              className="relative px-4 font-semibold hover:text-primary"
            >
              Rathers
            </ActiveLink>
          </li>
          <Separator orientation="vertical" />
          <li>
            <ActiveLink
              href={links.searchUsers.href}
              className="relative px-4 font-semibold hover:text-primary"
              active="after:bottom-0 after:absolute text-primary after:content-[''] after:w-1/2 after:bg-primary after:left-1/2 after:-translate-x-1/2 after:h-px"
            >
              Users
            </ActiveLink>
          </li>
        </ul>
      </nav>
      {props.children}
    </main>
  );
}
