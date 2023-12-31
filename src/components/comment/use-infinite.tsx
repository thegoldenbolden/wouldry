"use client";

import { type ThreadFilters, queryKeys } from "~/lib/query-keys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { search } from "~/actions/comment";

type Search = Awaited<ReturnType<typeof search>>;
export type SearchExcludeError = Exclude<Search, { error: string }>;

export type UseInfiniteComments = ReturnType<typeof useInfiniteComments>;

export function useInfiniteComments({ filters }: { filters: ThreadFilters }) {
  const data = useInfiniteQuery<SearchExcludeError>({
    initialPageParam: 0,
    getNextPageParam: (next) => next.after || undefined,
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

      const result = await search(searchParams);

      if (typeof result.error === "string") {
        throw result.error;
      }

      return result;
    },
  });

  return data;
}
