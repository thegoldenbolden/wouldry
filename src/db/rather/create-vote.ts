import type { CreateVoteOutput } from "~/lib/validate/rather";
import { createId } from "~/db/utils";
import db from "~/db";

export async function createVote(userId: string, data: CreateVoteOutput) {
  const vote = await db.choice.update({
    where: {
      id_ratherId: {
        ratherId: data.ratherId,
        id: data.choiceId,
      },
    },
    data: {
      vote_count: {
        increment: 1,
      },
      votes: {
        create: {
          id: createId({
            lowercase: true,
            uppercase: true,
            numbers: true,
            underscore: true,
          }),
          rather: {
            connect: {
              id: data.ratherId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      },
    },
    select: {
      rather: {
        select: {
          choices: {
            orderBy: { id: "asc" },
            select: {
              id: true,
              body: true,
              vote_count: true,
              votes: {
                where: {
                  userId: userId,
                },
                select: {
                  user: {
                    select: {
                      image: true,
                      name: true,
                      username: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const total = {
    votes: vote.rather.choices.reduce((a, b) => a + b.vote_count, 0),
  };

  const choices = vote.rather.choices.map(({ vote_count, ...choice }) => {
    return {
      ...choice,
      user: choice.votes[0]?.user,
      voted: choice.id === data.choiceId,
      total: { votes: vote_count },
      percentage: total.votes ? vote_count / total.votes : 0,
    };
  });

  return {
    total,
    choices,
  };
}
