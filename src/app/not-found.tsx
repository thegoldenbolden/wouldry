import type { Metadata } from "next";
import { Link } from "~/components/ui/link";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  title: "404 - Not Found",
};

export default function NotFound() {
  return (
    <main className="px-2 py-32">
      <div className="flex items-center justify-center">
        <p>This page could not be found</p>
        <Link
          className="font-display group relative mt-10 justify-start gap-2 rounded-md px-4 py-3"
          href={links.home.href}
        >
          Home
        </Link>
      </div>
    </main>
  );
}
