export type DefaultFilters<T = unknown> = T &
  Partial<{
    username: string;
    id: string;
    before: string | null;
    after: string | null;
  }>;

export type ThreadFilters = DefaultFilters<{
  contentId: string;
  parentId: string | null;
}>;

export type PollFilters = DefaultFilters;
export type UserFilters = DefaultFilters;

export const queryKeys = {
  threads: (filters: ThreadFilters) => ["threads", filters] as const,
  users: (filters: UserFilters) => ["users", filters] as const,
  polls: (filters: PollFilters) => ["polls", filters] as const,
};
