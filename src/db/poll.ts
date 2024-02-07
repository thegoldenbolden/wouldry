import type { Prisma } from "@prisma/client";
import { generateId } from "lucia";
import { db } from "~/db/client";
import { createPage } from "~/db/utils";
import type { IdOutput, NumberOutput } from "~/db/validations";
import {
  MIN_POLLS_PER_PAGE,
  type CreatePollOutput,
  type CreateVoteOutput,
  type SearchOutput,
} from "~/db/validations/poll";

export async function createPoll(userId: string, data: CreatePollOutput) {
  const poll = await db.poll.create({
    data: {
      id: generateId(18),
      title: data.title,
      slug: data.slug,
      description: data.description,
      commentsEnabled: data.enable_comments,
      author: {
        connect: {
          id: userId,
        },
      },
      options: {
        createMany: {
          data: [
            {
              id: generateId(21),
              value: data.option_one,
            },
            {
              id: generateId(21),
              value: data.option_two,
            },
          ],
        },
      },
    },
    select: {
      number: true,
      slug: true,
    },
  });

  return {
    data: {
      poll,
    },
  };
}

export async function createVote(userId: string, data: CreateVoteOutput) {
  const {
    poll: { options },
  } = await db.option.update({
    where: {
      id_pollId: {
        pollId: data.pollId,
        id: data.optionId,
      },
    },
    data: {
      vote_count: {
        increment: 1,
      },
      votes: {
        create: {
          id: generateId(21),
          poll: {
            connect: {
              id: data.pollId,
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
      poll: {
        select: {
          options: {
            orderBy: { id: "asc" },
            select: {
              id: true,
              value: true,
              vote_count: true,
            },
          },
        },
      },
    },
  });

  const total = {
    votes: options.reduce((a, b) => a + b.vote_count, 0),
  };

  return {
    data: {
      total,
      options: options.map(({ vote_count, ...option }) => {
        return {
          ...option,
          voted: option.id === data.optionId,
          total: {
            percentage: total.votes ? vote_count / total.votes : 0,
            votes: vote_count,
          },
        };
      }),
    },
  };
}

export async function deletePoll(authorId: string, data: IdOutput) {
  const poll = await db.poll.delete({
    where: { id: data.id, authorId },
    select: { title: true },
  });

  return {
    data: {
      poll
    }
  }
}

export async function getPoll(data: NumberOutput | IdOutput) {
  const poll = await db.poll.findUnique({
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
          nickname: true,
        },
      },
      options: {
        orderBy: { id: "asc" },
        select: {
          id: true,
          value: true,
          vote_count: true,
        },
      },
    },
  });

  if (!poll) {
    return {
      data: null
    };
  }

  const votes = poll.options.reduce((a, b) => a + b.vote_count, 0);

  return {
    data: {
      ...poll,
      total: { votes },
      options: poll.options.map((option) => {
        return {
          id: option.id,
          value: option.value,
          total: {
            votes: option.vote_count,
            percentage: !votes ? 0 : option.vote_count / votes,
          },
        };
      }),
    }
  }
}

export async function getPolls(
  data: SearchOutput = {
    limit: MIN_POLLS_PER_PAGE,
    sort: "desc",
    orderBy: "created_at",
  },
) {
  let where: Prisma.PollWhereInput = { isDeleted: false };
  let cursor: Prisma.PollWhereUniqueInput | undefined;
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
      author: {
        username: data.username,
      },
    };
  }

  const polls = await db.poll.findMany({
    cursor,
    where,
    take,
    skip,
    orderBy: { createdAt: data.sort },
    select: {
      id: true,
      number: true,
      title: true,
      slug: true,
      createdAt: true,
      description: true,
      author: {
        select: {
          id: true,
          image: true,
          username: true,
          nickname: true,
        },
      },
      options: {
        orderBy: { id: "asc" },
        select: {
          id: true,
          value: true,
          vote_count: true,
        },
      },
    },
  });

  return {
    data: {
      ...createPage({
        initialPage: !cursor,
        lastItemId: polls[polls.length - 1]?.id,
        firstItemId: polls[0]?.id,
        totalItems: polls.length,
        itemsPerPage: data.limit,
      }),
      results: polls.map((poll) => {
        const votes = poll.options.reduce((a, b) => a + b.vote_count, 0);
        return {
          ...poll,
          total: { votes },
          options: poll.options.map((option) => {
            return {
              id: option.id,
              value: option.value,
              percentage: !votes ? 0 : option.vote_count / votes,
              total: { votes: option.vote_count },
            };
          }),
        };
      }),
    },
  };
}

export async function getRecentPolls() {
  const polls = await db.poll.findMany({
    take: 12,
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      number: true,
      title: true,
      slug: true,
      createdAt: true,
      description: true,
      author: {
        select: {
          id: true,
          image: true,
          username: true,
          nickname: true,
        },
      },
      options: {
        orderBy: { id: "asc" },
        select: {
          id: true,
          value: true,
        },
      },
    },
  });

  return {
    data: {
      polls: polls,
    },
  };
}

export async function getTotalPolls() {
  const total = await db.poll.count({
    where: {
      isDeleted: false,
    },
  });

  return {
    data: {
      total,
    },
  };
}

export async function getVote(userId: string, data: IdOutput) {
  const vote = await db.vote.findUnique({
    where: {
      userId_forumId: {
        userId,
        forumId: data.id,
      },
    },
    select: {
      optionId: true,
    },
  });

  return {
    data: {
      vote,
    },
  };
}

export async function getVotes(poll: IdOutput) {
  const response = await db.option.findMany({
    where: { pollId: poll.id },
    orderBy: { id: "asc" },
    select: {
      id: true,
      vote_count: true,
    },
  });

  const totalVotes = response.reduce((a, b) => a + b.vote_count, 0);

  const options = response.map(({ vote_count, ...option }) => {
    return {
      ...option,
      voted: false,
      total: { votes: vote_count },
      percentage: totalVotes ? vote_count / totalVotes : 0,
    };
  });

  return {
    data: {
      options,
      total: {
        votes: totalVotes,
      },
    },
  };
}
