"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { findComments } from "~/actions/comment";
import { queryKeys, type ThreadFilters } from "~/lib/query-keys";

type SearchComment = Awaited<ReturnType<typeof findComments>>["data"];
export type UseInfiniteComments = ReturnType<typeof useInfiniteComments>;

export function useInfiniteComments({ filters }: { filters: ThreadFilters }) {
  return useInfiniteQuery<SearchComment>({
    initialPageParam: 0,
    getNextPageParam: (next) => next?.after,
    refetchOnMount: false,
    queryKey: queryKeys.threads(filters),
    queryFn: async ({ pageParam, direction }) => {
      const { contentId, parentId, before, after, ...params } = filters;
      const searchParams = new URLSearchParams(params);

      searchParams.set("contentId", contentId);
      searchParams.set("sort", !parentId ? "desc" : "asc");
      parentId && searchParams.set("parentId", parentId);

      if (pageParam && direction === "forward") {
        searchParams.set("after", pageParam.toString());
      }

      if (pageParam && direction === "backward") {
        searchParams.set("before", pageParam.toString());
      }

      const result = await findComments(searchParams);

      if (result.error) {
        throw result.error;
      }

      return result.data;
    },
  });
}
