import type { DeleteCommentOutput } from "~/lib/validate/comment";
import db from "~/db";

export async function deleteComment(
  authorId: string,
  data: DeleteCommentOutput,
) {
  return db.comment.update({
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
}
