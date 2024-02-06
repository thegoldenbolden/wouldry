import type { Prisma } from "@prisma/client";
import { generateId } from "lucia";
import { db } from "~/db/client";
import { createPage } from "~/db/utils";
import type { IdOutput, NumberOutput } from "~/db/validations";
import {
  MIN_RATHERS_PER_PAGE,
  type CreateRatherOutput,
  type CreateVoteOutput,
  type SearchOutput,
  type SlugOutput,
} from "~/db/validations/rather";

export async function createRather(
  userId: string,
  data: CreateRatherOutput & SlugOutput,
) {
  const rather = await db.rather.create({
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
      rather,
    },
  };
}

export async function createVote(userId: string, data: CreateVoteOutput) {
  const vote = await db.option.update({
    where: {
      id_ratherId: {
        ratherId: data.ratherId,
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
    votes: vote.rather.options.reduce((a, b) => a + b.vote_count, 0),
  };

  const options = vote.rather.options.map(({ vote_count, ...option }) => {
    return {
      ...option,
      voted: option.id === data.optionId,
      total: { votes: vote_count },
      percentage: total.votes ? vote_count / total.votes : 0,
    };
  });

  return {
    data: {
      total,
      options,
    },
  };
}

export async function deleteRather(authorId: string, data: IdOutput) {
  const rather = await db.rather.delete({
    where: { id: data.id, authorId },
    select: { title: true },
  });

  return {
    data: {
      rather,
    },
  };
}

export async function findRather(data: NumberOutput | IdOutput) {
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

  if (!rather) {
    return {
      data: null,
    };
  }

  const votes = rather.options.reduce((a, b) => a + b.vote_count, 0);

  return {
    data: {
      ...rather,
      total: { votes },
      options: rather.options.map((option) => {
        return {
          id: option.id,
          value: option.value,
          percentage: !votes ? 0 : option.vote_count / votes,
          total: { votes: option.vote_count },
        };
      }),
    },
  };
}

export async function findRathers(
  data: SearchOutput = {
    limit: MIN_RATHERS_PER_PAGE,
    sort: "desc",
    orderBy: "created_at",
  },
) {
  let where: Prisma.RatherWhereInput = { isDeleted: false };
  let cursor: Prisma.RatherWhereUniqueInput | undefined;
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

  const rathers = await db.rather.findMany({
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
      votes: {
        take: 3,
        orderBy: { createdAt: "desc" },
        select: {
          user: {
            select: {
              image: true,
              nickname: true,
            },
          },
        },
      },
    },
  });

  return {
    data: {
      ...createPage({
        initialPage: !cursor,
        lastItemId: rathers[rathers.length - 1]?.id,
        firstItemId: rathers[0]?.id,
        totalItems: rathers.length,
        itemsPerPage: data.limit,
      }),
      results: rathers.map((result) => {
        const votes = result.options.reduce((a, b) => a + b.vote_count, 0);
        return {
          ...result,
          votes: result.votes.map((v) => ({
            image: v.user.image,
            nickname: v.user.nickname,
          })),
          total: { votes },
          options: result.options.map((option) => {
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

export async function getRecentRathers() {
  const rathers = await db.rather.findMany({
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
      rathers,
    },
  };
}

export const getTotalRathers = async () => {
  const total = await db.rather.count({
    where: {
      isDeleted: false,
    },
  });

  return {
    data: {
      total,
    },
  };
};

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

export async function getVotes(rather: IdOutput) {
  const response = await db.option.findMany({
    where: { ratherId: rather.id },
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

export async function getRathers({ start, end }: { start: number, end: number }) {
  const rathers = await db.rather.findMany({
    where: {
      isDeleted: false,
      number: {
        'gte': start,
        'lte': end
      }
    },
    take: 50_000,
    orderBy: {
      createdAt: 'asc'
    },
    select: {
      slug: true,
      number: true,
      createdAt: true
    }
  });

  return {
    data: {
      rathers
    }
  }
}