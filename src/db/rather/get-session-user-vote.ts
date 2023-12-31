import type { IdOutput } from "~/lib/validate";
import db from "~/db";

export async function getUserVote(userId: string, data: IdOutput) {
  return db.vote.findUnique({
    where: {
      userId_forumId: {
        userId,
        forumId: data.id,
      },
    },
    select: {
      choiceId: true,
    },
  });
}
