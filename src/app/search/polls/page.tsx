import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { InfinitePolls } from "~/components/poll/infinite";
import { getPolls } from "~/db/poll";
import { links } from "~/lib/links";
import { queryKeys } from "~/lib/query-keys";

export const metadata: Metadata = {
  alternates: {
    canonical: links.searchPolls.href,
  },
};

export const revalidate = 43200;

export default function Page() {
  return (
    <Suspense>
      <Polls />
    </Suspense>
  );
}

type Search = Awaited<ReturnType<typeof getPolls>>["data"];
async function Polls() {
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
    queryKey: queryKeys.polls({}),
    queryFn: async () => {
      const result = await getPolls();
      return result.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InfinitePolls />
    </HydrationBoundary>
  );
}
