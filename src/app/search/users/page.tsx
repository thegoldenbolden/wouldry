import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { findUsers } from "~/actions/user";
import { ErrorBoundary } from "~/components/error-boundary";
import { InfiniteUsers } from "~/components/user/infinite";
import { links } from "~/lib/links";
import { queryKeys } from "~/lib/query-keys";

export const metadata: Metadata = {
  title: "Search users",
  alternates: {
    canonical: links.searchUsers.href,
  },
};

export default function Page() {
  return (
    <Suspense>
      <Users />
    </Suspense>
  );
}
type Search = Awaited<ReturnType<typeof findUsers>>["data"];

async function Users() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
    },
  });

  await queryClient.prefetchInfiniteQuery<Search>({
    initialPageParam: 0,
    getNextPageParam: (next: Search) => next?.after,
    queryKey: queryKeys.users({}),
    queryFn: async () => {
      const result = await findUsers();
      return result.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary>
        <InfiniteUsers />
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
