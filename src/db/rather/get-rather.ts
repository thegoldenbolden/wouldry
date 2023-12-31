import type { IdOutput, NumberOutput } from "~/lib/validate";
import db from "~/db";

export async function getRather(data: NumberOutput | IdOutput) {
  const rather = await db.rather.findUnique({
    where: {
      ...data,
      isDeleted: false,
    },
    select: {
      id: true,
      number: true,
      title: true,
      slug: true,
      createdAt: true,
      description: true,
      commentsEnabled: true,
      author: {
        select: {
          id: true,
          image: true,
          username: true,
          name: true,
        },
      },
      choices: {
        orderBy: { id: "asc" },
        select: {
          id: true,
          body: true,
          vote_count: true,
        },
      },
    },
  });

  if (!rather) return null;

  const votes = rather.choices.reduce((a, b) => a + b.vote_count, 0);

  return {
    ...rather,
    total: { votes },
    choices: rather.choices.map((choice) => {
      return {
        id: choice.id,
        body: choice.body,
        percentage: !votes ? 0 : choice.vote_count / votes,
        total: { votes: choice.vote_count },
      };
    }),
  };
}
