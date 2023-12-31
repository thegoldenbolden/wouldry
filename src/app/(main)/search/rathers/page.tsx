import { InfiniteRathers } from "~/components/rather/infinite";
import { ErrorBoundary } from "~/components/error-boundary";
import type { Metadata } from "next";
import { links } from "~/lib/links";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Rathers",
  alternates: {
    canonical: links.searchRathers.href,
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <Suspense>
        <ErrorBoundary>
          <InfiniteRathers />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}
