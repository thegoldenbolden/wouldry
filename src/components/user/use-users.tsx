"use client";

import { queryKeys, type UserFilters } from "~/lib/query-keys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { search } from "~/actions/user";

type Search = Awaited<ReturnType<typeof search>>;
type SearchExcludeError = Exclude<Search, { error: string }>;

export function useInfiniteUsers(filters: UserFilters) {
  return useInfiniteQuery<SearchExcludeError>({
    initialPageParam: 0,
    getNextPageParam: (next) => next.after,
    queryKey: queryKeys.users(filters),
    refetchOnMount: false,
    queryFn: async ({ pageParam, direction }) => {
      const { after, before, ...params } = filters || {};
      const searchParams = new URLSearchParams(params);

      if (pageParam && direction === "forward") {
        searchParams.set("after", pageParam.toString());
      }

      if (pageParam && direction === "backward") {
        searchParams.set("before", pageParam.toString());
      }

      const result = await search(searchParams);
      if (typeof result.error === "string") {
        throw result.error;
      }

      return result;
    },
  });
}
