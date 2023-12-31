import "server-only";

import { getRecentRathers as _getRecentRathers } from "~/db/rather/get-recent-rathers";
import { getTotalRathers as _getTotalRathers } from "~/db/rather/get-total-rathers";
import { getRecentUsers as _getRecentUsers } from "~/db/user/get-recent-users";
import { getTotalUsers as _getUserCount } from "~/db/user/get-total-users";
import { getProfile as _getProfile } from "~/lib/cache/react";
import { getRather as _getRather } from "~/lib/cache/react";
import { revalidateTag, unstable_cache } from "next/cache";

const cache = {
  "rather-count": {
    tags: ["rather-count"],
    revalidate: 86400,
  },
  "user-count": {
    tags: ["user-count"],
    revalidate: 86400,
  },
  "recent-rathers": {
    tags: ["get-recent-rathers"],
    revalidate: 86400,
  },
  "recent-users": {
    tags: ["get-recent-users"],
    revalidate: 86400,
  },
  "get-profile": {
    tags: ["get-profile"],
    revalidate: 86400,
  },
  session: {
    tags: ["session"],
    revalidate: 86400,
  },
};

type Tag = keyof typeof cache;
export const revalidate = (tag: Tag) => revalidateTag(tag);

export const getTotalRathers = unstable_cache(
  _getTotalRathers,
  cache["rather-count"].tags,
  cache["rather-count"],
);

export const getRecentRathers = unstable_cache(
  _getRecentRathers,
  cache["recent-rathers"].tags,
  cache["recent-rathers"],
);

export const getTotalUsers = unstable_cache(
  _getUserCount,
  cache["user-count"].tags,
  cache["user-count"],
);

export const getRecentUsers = unstable_cache(
  _getRecentUsers,
  cache["recent-users"].tags,
  cache["recent-users"],
);
