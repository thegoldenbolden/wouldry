import type { CreateCommentOutput } from "~/lib/validate/comment";
import { createId } from "~/db/utils";
import db from "~/db";

export async function create(userId: string, data: CreateCommentOutput) {
  return db.comment.create({
    data: {
      id: createId({
        uppercase: true,
        lowercase: true,
        numbers: true,
        size: 12,
      }),
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
}
