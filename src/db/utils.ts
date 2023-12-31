import "server-only";

import { customAlphabet } from "nanoid";

type Options = Partial<{
  size: number;
  lowercase: boolean;
  numbers: boolean;
  underscore: boolean;
  uppercase: boolean;
}>;

export function createAlphabet(options: Options) {
  let alphabet = "";
  options.size ||= 18;

  if (options.lowercase) {
    alphabet += "abcdefghijklmnopqrstuvwxyz";
  }

  if (options.numbers) {
    alphabet += "0123456789";
  }

  if (options.underscore) {
    alphabet += "_";
  }

  if (options.uppercase) {
    alphabet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  return alphabet;
}

export function createId({
  size = 18,
  lowercase = true,
  uppercase = true,
  underscore = true,
  numbers = true,
}: Options = {}) {
  return customAlphabet(
    createAlphabet({
      size,
      numbers,
      lowercase,
      uppercase,
      underscore,
    }),
    size,
  )();
}

export function createNumberId(size: number = 18) {
  const alphabet = createAlphabet({ numbers: true });
  return customAlphabet(alphabet, size)();
}

export const createDisplayName = (name?: string | null) => {
  if (name) return name;
  const str = createId({ numbers: true, lowercase: true, uppercase: true });
  return `user${str}`;
};

export function createPage({
  initialPage = true,
  firstItemId = null,
  lastItemId = null,
  ...options
}: {
  totalItems: number;
  itemsPerPage: number;
  lastItemId?: string | null;
  firstItemId?: string | null;
  initialPage?: boolean;
}) {
  const details: { before: string | null; after: string | null } = {
    before: null,
    after: null,
  };

  if (!lastItemId && !firstItemId) return details;
  if (options.totalItems > options.itemsPerPage) return details;

  if (initialPage) {
    return {
      before: null,
      after: lastItemId,
    };
  }

  if (options.totalItems < options.itemsPerPage) {
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
