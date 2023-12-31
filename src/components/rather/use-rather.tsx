"use client";

import { type RatherFilters, queryKeys } from "~/lib/query-keys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { search } from "~/actions/rather";

type Search = Awaited<ReturnType<typeof search>>;
type SearchExcludeError = Exclude<Search, { error: string }>;

export function useInfiniteRathers(filters: RatherFilters) {
  return useInfiniteQuery<SearchExcludeError>({
    initialPageParam: 0,
    getNextPageParam: (next) => next.after,
    refetchOnMount: false,
    queryKey: queryKeys.rathers(filters),
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
