import type { Metadata } from "next";
import { Avatar } from "~/components/avatar";
import { Footer } from "~/components/footer";
import { Link } from "~/components/ui/link";
import { getProfile } from "~/lib/cache/react";
import { links } from "~/lib/links";

type UsernameSegment = {
  params: {
    username: string;
  };
};

export async function generateMetadata({
  params,
}: UsernameSegment): Promise<Metadata> {
  const profile = await getProfile(params.username);

  const metadata: Metadata = {
    title: `${profile.nickname} (@${profile.username})`,
    alternates: {
      canonical: links.profile.href(profile.username),
    },
  };

  if (profile.about) {
    metadata.description = profile.about;
  }

  return metadata;
}

export default async function Layout({
  children,
  params,
}: React.PropsWithChildren<UsernameSegment>) {
  const profile = await getProfile(params.username);

  return (
    <div>
      <main className="flex flex-col gap-8">
        <section className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 py-8">
          <Avatar
            className="size-16 border  border-border"
            src={profile.image}
            alt={profile.username}
          />
          <h1 className="flex flex-col gap-px text-center text-xl font-bold">
            {profile.nickname}
            <span className="text-sm font-normal text-foreground-lighter">
              @{profile.username}
            </span>
          </h1>
          {profile.about && <p>{profile.about}</p>}
          {profile.owner && (
            <Link
              outline="foreground"
              size="md"
              className="rounded-md px-4 py-2"
              href={links.settingsProfile.href}
            >
              Edit Profile
            </Link>
          )}
        </section>
        <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-4 px-3">
          {children}
        </div>
      </main>
      <Footer className="mx-auto" />
    </div>
  );
}
