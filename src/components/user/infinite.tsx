"use client";

import { useSearchParams } from "next/navigation";
import { LoadMore } from "~/components/load-more";
import { User } from "~/components/user";
import { useInfiniteUsers } from "~/components/user/use-infinite";
import { MIN_USERS_PER_PAGE } from "~/db/validations/user";
import type { UserFilters } from "~/lib/query-keys";

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
        {Array.from({ length: MIN_USERS_PER_PAGE }).map((_, i) => {
          return (
            <User.Fallback
              className="md:min-w-64"
              key={`search-users-fallback-${i}`}
            />
          );
        })}
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-xl font-bold tracking-wide">
        Something unexpected happened
      </p>
    );
  }

  if (status === "success" && !data.pages.length) {
    return (
      <p className="text-center text-xl font-bold tracking-wide">
        No users found
      </p>
    );
  }

  return (
    <>
      <section className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        {data.pages.map((page) => {
          if (!page) {
            return null;
          }
          return page.results.map((user) => {
            return (
              <User
                key={user.username}
                user={user}
                className="h-full grow basis-0 list-none p-0"
              />
            );
          });
        })}
      </section>
      <LoadMore
        isFetching={isFetching}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        className="w-auto self-center"
      >
        Load more
      </LoadMore>
    </>
  );
}
