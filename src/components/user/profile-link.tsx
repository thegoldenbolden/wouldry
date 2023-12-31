import { ActiveLink } from "~/components/active-link";
import { getSession } from "~/lib/cache/react";
import type { ComponentProps } from "react";
import { Link } from "~/components/ui/link";
import { links } from "~/lib/links";

type ProfileProps = (
  | (Omit<ComponentProps<typeof Link>, "href"> & { as: "static" })
  | (Omit<ComponentProps<typeof ActiveLink>, "href"> & { as: "active" })
) & {
  username?: string;
  authenticate?: boolean;
};

export async function ProfileLink({
  as = "static",
  username,
  authenticate = true,
  ...props
}: ProfileProps) {
  const Comp = as === "active" ? ActiveLink : Link;

  if (username) {
    return <Comp {...props} href={links.profile.href(username)} />;
  }

  const session = await getSession();

  if (!session?.user?.username) {
    if (!authenticate) {
      return null;
    }

    return <Comp {...props} href={links.login.href} />;
  }

  return <Comp {...props} href={links.profile.href(session.user.username)} />;
}
