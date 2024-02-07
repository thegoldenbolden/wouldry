import type { Metadata } from "next";
import { Suspense } from "react";
import { ActiveLink } from "~/components/active-link";
import { QueryProvider, ThemeProvider } from "~/components/providers";
import { ThemeToggle } from "~/components/theme-toggle";
import { Skeleton } from "~/components/ui/skeleton";
import { Toaster } from "~/components/ui/sonner";
import { getUser } from "~/lib/cache/react";
import { BRAND_NAME } from "~/lib/constants";
import { chillax, synonym } from "~/lib/fonts";
import { links } from "~/lib/links";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL),
  title: BRAND_NAME,
  keywords: [
    "would you rather questions",
    "hypothetical scenarios",
    "thought provoking",
    "challenging choices",
    "engaging discussions",
    "family activities",
    "conversation starters",
    "entertaining dilemmas",
    "intriguing scenarios",
  ],
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <html
      lang="en"
      className={`${synonym.variable} ${chillax.variable}`}
      suppressHydrationWarning
    >
      <body className="font-synonym bg-background text-foreground">
        <ThemeProvider>
          <div className="mx-auto flex min-h-svh max-w-screen-lg flex-col gap-8">
            <QueryProvider>
              <header className="max-w-screen fixed bottom-0 z-40 flex w-full justify-center rounded-none sm:sticky sm:bottom-auto sm:top-0 sm:border-t-0">
                <div className="flex w-full items-center justify-between gap-2 rounded-none border-t-2 border-t-border bg-background backdrop-blur-md sm:border-none sm:py-2">
                  <nav className="grow sm:grow-0">
                    <ul className="flex items-center justify-center sm:gap-4">
                      <NavItem
                        title={links.home.title}
                        icon={links.home.icon}
                        href={links.home.href}
                      />
                      <NavItem
                        title={links.create.title}
                        icon={links.create.icon}
                        href={links.create.href}
                      />
                      <NavItem
                        title={links.search.title}
                        icon={links.search.icon}
                        href={links.search.href}
                      />
                      <Suspense fallback={<AuthLink.Fallback />}>
                        <AuthLink render="profile" />
                      </Suspense>
                    </ul>
                  </nav>
                  <div className="hidden sm:flex sm:items-center sm:justify-center sm:gap-4">
                    <Suspense fallback={<AuthLink.Fallback />}>
                      <AuthLink render="logout" />
                    </Suspense>
                    <ThemeToggle
                      className={{
                        button:
                          "rounded-none p-4 hover:bg-foreground/5 sm:rounded-xl",
                        swatch: "size-7",
                      }}
                    />
                  </div>
                </div>
              </header>
              {props.children}
              <Toaster richColors position="top-center" closeButton />
            </QueryProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

async function AuthLink({ render }: { render: "profile" | "logout" }) {
  const user = await getUser();

  if (!user?.username) {
    if (render === "profile") {
      return null;
    }

    return (
      <NavItem
        href={links.login.href}
        title={links.login.title}
        icon={links.login.icon}
      />
    );
  }

  if (render === "profile") {
    return (
      <NavItem
        title="Your profile"
        href={links.profile.href(user.username)}
        icon={links.profile.icon}
      />
    );
  }

  if (render === "logout") {
    return (
      <NavItem
        title={links.logout.title}
        href={links.logout.href}
        icon={links.logout.icon}
      />
    );
  }

  return null;
}

AuthLink.Fallback = function Fallback() {
  return (
    <li className="flex grow items-center justify-center">
      <Skeleton className="rounded-none bg-foreground/10 p-4 sm:rounded-xl">
        <span className="size-7" />
      </Skeleton>
    </li>
  );
};

function NavItem(props: (typeof links)["home"]) {
  return (
    <li className="flex grow items-center justify-center">
      <ActiveLink
        title={props.title}
        href={props.href}
        className={{
          default: "rounded-none p-4 hover:bg-foreground/5 sm:rounded-xl",
          inactive: "sm:hover:bg-foreground/5",
        }}
      >
        <props.icon className="size-7" />
      </ActiveLink>
    </li>
  );
}
