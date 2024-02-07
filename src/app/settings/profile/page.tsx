import type { Metadata } from "next";
import { ErrorBoundary } from "~/components/error-boundary";
import { Edit } from "~/components/user/edit";
import { getAuthProfile } from "~/lib/cache/react";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  alternates: {
    canonical: links.settingsProfile.href,
  },
};

export default async function Page() {
  const { user: profile } = await getAuthProfile();

  return (
    <main>
      <section className="flex max-w-md flex-col gap-4">
        <ErrorBoundary>
          <Edit
            username={profile.username}
            nickname={profile.nickname}
            about={profile.about || undefined}
          />
        </ErrorBoundary>
      </section>
    </main>
  );
}
