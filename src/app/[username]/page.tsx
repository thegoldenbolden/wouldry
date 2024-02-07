import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "~/components/error-boundary";
import { InfinitePolls } from "~/components/poll/infinite";
import { getPolls } from "~/db/poll";
import { MIN_POLLS_PER_PAGE } from "~/db/validations/poll";
import { getProfile } from "~/lib/cache/react";
import { queryKeys } from "~/lib/query-keys";

type UsernameSegment = {
  params: {
    username: string;
  };
};

export default async function Page({ params }: UsernameSegment) {
  const profile = await getProfile(params.username);

  return (
    <div className="flex flex-col gap-4">
      <Suspense>
        <ErrorBoundary>
          <Polls username={profile.username} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

type Search = Awaited<ReturnType<typeof getPolls>>["data"];
async function Polls({ username }: { username: string }) {
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
    getNextPageParam: (next: Search) => next?.results,
    queryKey: queryKeys.polls({ username }),
    queryFn: async () => {
      const result = await getPolls({
        username,
        limit: MIN_POLLS_PER_PAGE,
        orderBy: "created_at",
        sort: "desc",
      });
      return result.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InfinitePolls filters={{ username }} />
    </HydrationBoundary>
  );
}
