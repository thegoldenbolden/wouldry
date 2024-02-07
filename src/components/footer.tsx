import { Suspense } from "react";
import { Link } from "~/components/ui/link";
import { getAuthRoute } from "~/lib/cache/react";
import { BRAND_NAME } from "~/lib/constants";
import { links } from "~/lib/links";
import { cn } from "~/lib/utils";
import { Skeleton } from "./ui/skeleton";

export function Footer({
  className,
  ...props
}: React.ComponentProps<"footer">) {
  return (
    <footer className={cn("mx-auto px-6 pb-16")} {...props}>
      <nav className="py-4">
        <ul className="flex flex-wrap justify-center gap-3">
          <li className="text-sm hover:underline hover:underline-offset-1">
            <Link href={links.terms.href}>{links.terms.title}</Link>
          </li>
          <li className="text-sm hover:underline hover:underline-offset-1">
            <Link href={links.cookies.href}>{links.cookies.title}</Link>
          </li>
          <li className="text-sm hover:underline hover:underline-offset-1">
            <Link href={links.privacy.href}>{links.privacy.title}</Link>
          </li>
          <li className="text-sm hover:underline hover:underline-offset-1">
            <Link href={links.discord.href}>Discord</Link>
          </li>
          <li className="text-sm hover:underline hover:underline-offset-1">
            <Suspense fallback={<Auth.Fallback />}>
              <Auth />
            </Suspense>
          </li>
        </ul>
      </nav>
      <div className="text-center text-sm">
        © 2024 {BRAND_NAME}, All rights reserved
      </div>
    </footer>
  );
}

async function Auth() {
  const route = await getAuthRoute();
  return <Link href={route.href}>{route.title}</Link>;
}

Auth.Fallback = function Fallback() {
  return <Skeleton className="h-4 w-12 rounded-md" />;
};
