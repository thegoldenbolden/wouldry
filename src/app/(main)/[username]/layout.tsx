import { getProfile } from "~/lib/cache/react";
import type { UsernameRoute } from "~/types";
import { Avatar } from "~/components/avatar";
import { Link } from "~/components/ui/link";
import type { Metadata } from "next";
import { links } from "~/lib/links";

type LayoutProps = React.PropsWithChildren<UsernameRoute>;
export async function generateMetadata({
  params,
}: UsernameRoute): Promise<Metadata> {
  const profile = await getProfile(params.username);

  const metadata: Metadata = {
    title: `${profile.name} (@${profile.username})`,
    alternates: {
      canonical: links.profile.href(profile.username),
    },
  };

  if (profile.biography) {
    metadata.description = profile.biography;
  }

  return metadata;
}

export default async function Layout({ children, params }: LayoutProps) {
  const profile = await getProfile(params.username);

  return (
    <main className="flex flex-col gap-8">
      <section className="flex max-w-lg mx-auto py-8 items-center gap-4 justify-center flex-col">
        <Avatar
          className="size-16 border-border border"
          src={profile.image}
          alt={profile.username}
        />
        <h1 className="flex flex-col gap-px text-center text-xl font-bold">
          {profile.name}
          <span className="font-normal text-sm text-copy-lighter">
            @{profile.username}
          </span>
        </h1>
        {profile.biography && <p>{profile.biography}</p>}
        {profile.owner && (
          <Link
            outline="copy"
            size="sm"
            className="rounded-full"
            href={links.settingsProfile.href}
          >
            Edit Profile
          </Link>
        )}
      </section>
      <section className="w-full flex px-3 flex-col gap-4 max-w-screen-lg mx-auto">
        {children}
      </section>
    </main>
  );
}
