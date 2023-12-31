import type { SearchOutput } from "~/lib/validate/comment";
import type { Prisma } from "@prisma/client";
import { createPage } from "~/db/utils";
import { auth } from "~/lib/auth";
import db from "~/db";

export async function getComments(data: SearchOutput) {
  const session = await auth();

  const where: Prisma.CommentWhereInput = {
    forumId: data.contentId,
    ...(!data.parentId && { isDeleted: false }),
  };

  if (!data.parentId) {
    where.parentId = null;
  } else {
    where.OR = [{ parentId: data.parentId }, { id: data.parentId }];
  }

  let cursor: Prisma.CommentWhereUniqueInput | undefined;
  if (data.before && !data.after) {
    cursor = { id: data.before };
  } else if (data.after && !data.before) {
    cursor = { id: data.after };
  }

  // If searching previous page, set take to a negative value.
  const take = data.before ? -data.limit : data.limit;

  // If a cursor exists, skip the cursor in result.
  const skip = cursor ? 1 : undefined;

  const comments = await db.comment.findMany({
    where,
    cursor,
    take,
    skip,
    orderBy: { createdAt: data.sort },
    select: {
      id: true,
      body: true,
      createdAt: true,
      isDeleted: true,
      author: {
        select: {
          id: true,
          image: true,
          username: true,
          name: true,
          accentColor: true,
        },
      },
      rather: {
        select: {
          author: {
            select: {
              id: true,
            },
          },
        },
      },
      parent: {
        select: {
          id: true,
          body: true,
          createdAt: true,
          isDeleted: true,
          author: {
            select: {
              id: true,
              image: true,
              username: true,
              name: true,
              accentColor: true,
            },
          },
        },
      },
    },
  });

  return {
    ...createPage({
      initialPage: !cursor,
      totalItems: comments.length,
      firstItemId: comments[0]?.id,
      itemsPerPage: data.limit,
      lastItemId: comments[comments.length - 1]?.id,
    }),
    results: comments.map((comment) => {
      const isOwner = Boolean(
        comment.author &&
          session?.user &&
          comment.author.id === session.user.id,
      );

      const isPostAuthor = Boolean(
        comment.rather?.author &&
          session?.user &&
          comment.rather.author.id === session.user.id,
      );

      return {
        id: comment.id,
        body: comment.body,
        parent: comment.parent,
        author: comment.author,
        createdAt: comment.createdAt,
        viewer: {
          isGuest: !session?.user?.id,
          id: session?.user?.id ?? null,
          username: session?.user?.username ?? null,
          name: session?.user?.name ?? null,
          image: session?.user?.image ?? null,
          isOwner,
          canDelete: comment.isDeleted ? false : isOwner || isPostAuthor,
        },
      };
    }),
  };
}
