import { InfiniteUsers } from "~/components/user/infinite";
import { ErrorBoundary } from "~/components/error-boundary";
import type { Metadata } from "next";
import { links } from "~/lib/links";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Users",
  alternates: {
    canonical: links.searchUsers.href,
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <Suspense>
        <ErrorBoundary>
          <InfiniteUsers />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}
