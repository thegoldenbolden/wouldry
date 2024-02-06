import type { Prisma } from "@prisma/client";
import { generateId } from "lucia";
import { getSession } from "~/actions/utils";
import { db } from "~/db/client";
import { createPage } from "~/db/utils";
import type {
  CreateCommentOutput,
  DeleteCommentOutput,
  SearchOutput,
} from "~/db/validations/comment";

export async function createComment(userId: string, data: CreateCommentOutput) {
  const comment = await db.comment.create({
    data: {
      id: generateId(21),
      body: data.body,
      author: {
        connect: {
          id: userId,
        },
      },
      rather: {
        connect: {
          id: data.contentId,
        },
      },
      ...(data.parentId && {
        parent: {
          connect: {
            id: data.parentId,
          },
        },
      }),
    },
    select: {
      id: true,
    },
  });

  return {
    data: {
      comment,
    },
  };
}

export async function deleteComment(
  authorId: string,
  data: DeleteCommentOutput,
) {
  const comment = await db.comment.update({
    where: {
      authorId,
      id: data.commentId,
      forumId: data.forumId,
    },
    data: {
      isDeleted: true,
      body: "This comment is no longer available",
      author: { disconnect: true },
    },
    select: {
      id: true,
    },
  });
  return {
    data: {
      comment,
    },
  };
}

export async function findComments(data: SearchOutput) {
  const where: Prisma.CommentWhereInput = {
    forumId: data.contentId,
    isDeleted: false,
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

  const [comments, session] = await Promise.all([
    db.comment.findMany({
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
            nickname: true,
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
                nickname: true,
              },
            },
          },
        },
      },
    }),
    getSession(),
  ]);

  return {
    data: {
      ...createPage({
        initialPage: !cursor,
        totalItems: comments.length,
        firstItemId: comments[0]?.id,
        itemsPerPage: data.limit,
        lastItemId: comments[comments.length - 1]?.id,
      }),
      results: comments.map((comment) => {
        const isOwner = Boolean(
          comment.author?.id &&
            session?.user?.id &&
            comment.author.id === session.user.id,
        );

        const isForumOwner = Boolean(
          comment.rather?.author?.id &&
            session?.user?.id &&
            comment.rather.author.id === session.user.id,
        );

        return {
          id: comment.id,
          body: comment.body,
          parent: comment.parent,
          author: comment.author,
          createdAt: comment.createdAt,
          permissions: {
            deletable: comment.isDeleted ? false : isOwner || isForumOwner,
          },
        };
      }),
    },
  };
}
