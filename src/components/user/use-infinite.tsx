"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { findUsers } from "~/actions/user";
import { queryKeys, type UserFilters } from "~/lib/query-keys";

type Search = Awaited<ReturnType<typeof findUsers>>["data"];

export function useInfiniteUsers(filters: UserFilters) {
  return useInfiniteQuery<Search>({
    initialPageParam: 0,
    getNextPageParam: (next) => next?.after,
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

      const result = await findUsers(searchParams);
      if (result.error) {
        throw result.error;
      }

      return result.data;
    },
  });
}
