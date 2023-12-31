"use client";

import { useInfiniteRathers } from "~/components/rather/use-rather";
import { Fallback, Rather } from "~/components/rather";
import { MIN_RATHERS_PER_PAGE } from "~/lib/constants";
import type { RatherFilters } from "~/lib/query-keys";
import { NoResults } from "~/components/no-results";
import { useSearchParams } from "next/navigation";
import { LoadMore } from "~/components/load-more";

export function InfiniteRathers({ filters = {} }: { filters?: RatherFilters }) {
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
  } = useInfiniteRathers({
    ...filters,
    ...(params.username && { username: params.username }),
  });

  if (status === "pending") {
    return (
      <div className="flex flex-wrap gap-2">
        <Fallback className="md:min-w-64" size={MIN_RATHERS_PER_PAGE} />
      </div>
    );
  }

  if (status === "error") {
    return <NoResults>Something unexpected happened</NoResults>;
  }

  if (status === "success" && !data.pages?.[0]?.results?.length) {
    return <NoResults>No rathers found</NoResults>;
  }

  return (
    <>
      <ul className="flex flex-wrap gap-2">
        {data.pages.map((page) => {
          return page.results.map((rather) => (
            <Rather
              as="li"
              role="region"
              id={`rather-${rather.id}`}
              className="w-full min-w-full py-3 sm:min-w-64"
              key={rather.number}
              rather={rather}
            />
          ));
        })}
      </ul>
      <LoadMore
        isFetching={isFetching}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      >
        Load older
      </LoadMore>
    </>
  );
}
