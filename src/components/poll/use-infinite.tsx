"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getPolls } from "~/actions/poll";
import { queryKeys, type PollFilters } from "~/lib/query-keys";

type Search = Awaited<ReturnType<typeof getPolls>>["data"];

export function useInfinitePolls(filters: PollFilters) {
  return useInfiniteQuery<Search>({
    initialPageParam: 0,
    getNextPageParam: (next) => next?.after,
    refetchOnMount: false,
    queryKey: queryKeys.polls(filters),
    queryFn: async ({ pageParam, direction }) => {
      const { after, before, ...params } = filters || {};
      const searchParams = new URLSearchParams(params);

      if (pageParam && direction === "forward") {
        searchParams.set("after", pageParam.toString());
      }

      if (pageParam && direction === "backward") {
        searchParams.set("before", pageParam.toString());
      }

      const result = await getPolls(searchParams);

      if (result.error) {
        throw result.error;
      }

      return result.data;
    },
  });
}
