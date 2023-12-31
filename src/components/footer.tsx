import { Link } from "~/components/ui/link";
import { links } from "~/lib/links";

export function Footer() {
  return (
    <footer className="mx-auto px-6">
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
        </ul>
      </nav>
      <div className="text-center text-sm">
        © 2024 Wouldry, All rights reserved
      </div>
    </footer>
  );
}
