import { Home, Edit, User, W, Search } from "~/components/icons";
import { ProfileLink } from "~/components/user/profile-link";
import { QueryProvider } from "~/components/query-provider";
import { ActiveLink } from "~/components/active-link";
import { ThemeToggle } from "~/components/theme";
import { Toaster } from "~/components/ui/sonner";
import { Footer } from "~/components/footer";
import { Card } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { links } from "~/lib/links";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <QueryProvider>
      <Header />
      {children}
      <Footer />
      <Toaster richColors />
    </QueryProvider>
  );
}

function Header() {
  return (
    <header className="fixed sm:sticky border-t border-copy/5 sm:border-t-0 w-full max-w-screen-lg z-40 bottom-0 sm:bottom-auto rounded-none sm:rounded-sm sm:top-4 sm:px-3">
      <Card className="w-full rounded-none sm:rounded-md flex gap-2 justify-between items-center sm:px-4 sm:py-2 p-0">
        <Link
          title="Home"
          tabIndex={-1}
          className="hidden sm:block font-bold"
          href={links.home.href}
        >
          <W className="size-12" />
        </Link>
        <nav className="grow sm:grow-0">
          <ul className="flex justify-center items-center sm:gap-4">
            <li className="grow flex items-center justify-center">
              <ActiveLink
                title={links.home.title}
                active="text-primary group"
                className="p-4 rounded-none sm:rounded-xl hover:bg-copy/5"
                href={links.home.href}
              >
                <Home className="size-7" />
              </ActiveLink>
            </li>
            <li className="grow flex items-center justify-center">
              <ActiveLink
                title={links.create.title}
                active="text-primary group"
                inactive="sm:hover:bg-copy/5 hover:drop-shadow-xl"
                className="p-4 rounded-none sm:rounded-xl hover:bg-copy/5"
                href={links.create.href}
              >
                <Edit className="size-7" />
              </ActiveLink>
            </li>
            <li className="grow flex items-center justify-center">
              <ActiveLink
                title={links.search.title}
                active="text-primary group"
                inactive="sm:hover:bg-copy/5 hover:drop-shadow-xl"
                className="p-4 rounded-none sm:rounded-xl hover:bg-copy/5"
                href={links.search.href}
              >
                <Search className="size-7" />
              </ActiveLink>
            </li>
            <li className="grow flex items-center justify-center">
              <ProfileLink
                as="active"
                title="Your profile"
                active="text-primary group"
                inactive="sm:hover:bg-copy/5 hover:drop-shadow-xl"
                className="p-4 rounded-none sm:rounded-xl hover:bg-copy/5"
              >
                <User className="size-7" />
              </ProfileLink>
            </li>
          </ul>
        </nav>
        <div className="hidden sm:block">
          <ThemeToggle
            iconProps={{ className: "size-7" }}
            className="p-4 rounded-none sm:rounded-xl hover:bg-copy/5"
          />
        </div>
      </Card>
    </header>
  );
}
