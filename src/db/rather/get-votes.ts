import type { IdOutput } from "~/lib/validate";
import db from "~/db";

export async function getVotes(data: IdOutput) {
  const response = await db.choice.findMany({
    where: { ratherId: data.id },
    orderBy: { id: "asc" },
    select: {
      id: true,
      body: true,
      vote_count: true,
    },
  });

  const total = {
    votes: response.reduce((a, b) => a + b.vote_count, 0),
  };

  const choices = response.map(({ vote_count, ...choice }) => {
    return {
      ...choice,
      total: { votes: vote_count },
      percentage: total.votes ? vote_count / total.votes : 0,
    };
  });

  return { total, choices };
}
