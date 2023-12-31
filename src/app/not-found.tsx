import { NoResults } from "~/components/no-results";
import { Link } from "~/components/ui/link";
import type { Metadata } from "next";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  title: "404 - Not Found",
};

export default function NotFound() {
  return (
    <main className="px-2 py-32">
      <NoResults className="flex items-center justify-center">
        <p>This page could not be found</p>
        <Link
          className="group relative mt-10 justify-start gap-2 rounded-md px-4 py-3 font-display"
          href={links.home.href}
        >
          Home
        </Link>
      </NoResults>
    </main>
  );
}
