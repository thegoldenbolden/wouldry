import { InfiniteRathers } from "~/components/rather/infinite";
import { ErrorBoundary } from "~/components/error-boundary";
import type { Metadata } from "next";
import { links } from "~/lib/links";
import { Suspense } from "react";

export const metadata: Metadata = {
  alternates: {
    canonical: links.searchRathers.href,
  },
};

export default function Page() {
  return (
    <div className="flex flex-wrap gap-2">
      <Suspense>
        <ErrorBoundary>
          <InfiniteRathers />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}
