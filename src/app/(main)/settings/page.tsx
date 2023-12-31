import { Account } from "~/components/user/account";
import type { Metadata } from "next";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  alternates: {
    canonical: links.settingsAccount.href,
  },
};

export default function Page() {
  return <Account />;
}
