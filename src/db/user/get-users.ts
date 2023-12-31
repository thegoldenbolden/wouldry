import db from "~/db";

import type { SearchOutput } from "~/lib/validate/user";
import { Prisma } from "@prisma/client";
import { createPage } from "~/db/utils";

export async function getUsers(data: SearchOutput) {
  let where: Prisma.UserWhereInput = { isDeleted: false };
  let cursor: Prisma.UserWhereUniqueInput | undefined;

  if (data.before && !data.after) {
    cursor = { id: data.before };
  } else if (data.after && !data.before) {
    cursor = { id: data.after };
  }

  // If searching previous page, set take to a negative value.
  const take = data.before ? -data.limit : data.limit;

  // If a cursor exists, skip the cursor in result.
  const skip = cursor ? 1 : undefined;
  if (data.username) {
    where = {
      ...where,
      username: data.username,
    };
  }

  const users = await db.user.findMany({
    cursor,
    where,
    take,
    skip,
    orderBy: { createdAt: data.sort },
    select: {
      id: true,
      image: true,
      username: true,
      name: true,
      accentColor: true,
      biography: true,
    },
  });

  return {
    ...createPage({
      initialPage: !cursor,
      lastItemId: users[users.length - 1]?.id,
      firstItemId: users[0]?.id,
      totalItems: users.length,
      itemsPerPage: data.limit,
    }),
    results: users,
  };
}
