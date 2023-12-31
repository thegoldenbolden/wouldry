"use client";

import { useInfiniteUsers } from "~/components/user/use-users";
import { MIN_USERS_PER_PAGE } from "~/lib/constants";
import { NoResults } from "~/components/no-results";
import type { UserFilters } from "~/lib/query-keys";
import { User, Fallback } from "~/components/user";
import { LoadMore } from "~/components/load-more";
import { useSearchParams } from "next/navigation";

export function InfiniteUsers({ filters = {} }: { filters?: UserFilters }) {
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
  } = useInfiniteUsers({
    ...filters,
    ...(params.username && { username: params.username }),
  });

  if (status === "pending") {
    return (
      <div className="flex flex-wrap gap-2">
        <Fallback className="md:min-w-64" size={MIN_USERS_PER_PAGE} />
      </div>
    );
  }

  if (status === "error") {
    return <NoResults>Something unexpected happened</NoResults>;
  }

  if (status === "success" && !data.pages.length) {
    return <NoResults>No users found</NoResults>;
  }

  return (
    <>
      <ul className="flex flex-wrap gap-2">
        {data.pages.map((page) => {
          return page.results.map((user) => (
            <User
              as="li"
              key={user.username}
              user={user}
              className="list-none drop-shadow-md p-0 basis-0 h-full grow"
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
        Load more
      </LoadMore>
    </>
  );
}
