"use client";

import { useSearchParams } from "next/navigation";
import { LoadMore } from "~/components/load-more";
import { Poll } from "~/components/poll";
import { useInfinitePolls } from "~/components/poll/use-infinite";
import { MIN_POLLS_PER_PAGE } from "~/db/validations/poll";
import type { PollFilters } from "~/lib/query-keys";

export function InfinitePolls({ filters = {} }: { filters?: PollFilters }) {
  const searchParams = useSearchParams();

  const params = {
    username: searchParams.get("user"),
  };

  const {
    data,
    status,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfinitePolls({
    ...filters,
    ...(params.username && { username: params.username }),
  });

  if (status === "pending") {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: MIN_POLLS_PER_PAGE }).map((_, i) => {
          return (
            <Poll.Fallback
              key={`search-poll-fallback-${i}`}
              className="min-w-full"
            />
          );
        })}
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-xl font-bold tracking-wide">
        An error occurred
      </p>
    );
  }

  if (status === "success" && !data.pages?.[0]?.results?.length) {
    return (
      <p className="text-center text-xl font-bold tracking-wide">
        No polls found
      </p>
    );
  }
  return (
    <>
      <section className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        {data.pages.map((page) => {
          if (!page) return null;
          return page.results.map((poll) => (
            <Poll
              role="region"
              id={`poll-${poll.id}`}
              className="min-w-0 py-3 sm:min-w-0 md:min-w-0"
              key={poll.number}
              poll={poll}
            />
          ));
        })}
      </section>
      <LoadMore
        isFetching={isFetching}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        className="w-auto self-center"
      >
        Load older
      </LoadMore>
    </>
  );
}
