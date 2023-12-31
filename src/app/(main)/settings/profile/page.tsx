import { ErrorBoundary } from "~/components/error-boundary";
import { getAuthProfile } from "~/lib/cache/react";
import { Edit } from "~/components/user/edit";
import { Card } from "~/components/ui/card";
import type { Metadata } from "next";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  alternates: {
    canonical: links.settingsProfile.href,
  },
};

export default async function Page() {
  const profile = await getAuthProfile();

  return (
    <Card className="p-12">
      <ErrorBoundary>
        <Edit
          username={profile.username}
          display_name={profile.name}
          biography={profile.biography ?? ""}
        />
      </ErrorBoundary>
    </Card>
  );
}
