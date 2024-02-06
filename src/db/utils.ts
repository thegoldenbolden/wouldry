import { generateId } from "lucia";
import "server-only";

export function createDisplayName(name?: string | null) {
  if (name) return name;
  const id = generateId(16);
  return `user${id}`;
}

type PageOptions = {
  totalItems: number;
  itemsPerPage: number;
  lastItemId?: string | null;
  firstItemId?: string | null;
  initialPage?: boolean;
};

export function createPage({
  initialPage = true,
  firstItemId = null,
  lastItemId = null,
  totalItems,
  itemsPerPage,
}: PageOptions) {
  const details: { before: string | null; after: string | null } = {
    before: null,
    after: null,
  };

  if (!lastItemId && !firstItemId) return details;
  if (totalItems > itemsPerPage) return details;

  if (initialPage) {
    return {
      before: null,
      after: lastItemId,
    };
  }

  if (totalItems < itemsPerPage) {
    return {
      before: firstItemId,
      after: null,
    };
  }

  return {
    before: firstItemId,
    after: lastItemId,
  };
}
