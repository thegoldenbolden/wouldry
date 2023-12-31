import { InfiniteRathers } from "~/components/rather/infinite";
import { ErrorBoundary } from "~/components/error-boundary";
import { getProfile } from "~/lib/cache/react";
import type { UsernameRoute } from "~/types";
import { Suspense } from "react";

export default async function Page({ params }: UsernameRoute) {
  const profile = await getProfile(params.username);

  return (
    <div className="flex flex-col gap-4">
      <Suspense>
        <ErrorBoundary>
          <InfiniteRathers filters={{ username: profile.username }} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}
