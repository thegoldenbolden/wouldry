import type { SearchOutput } from "~/lib/validate/user";
import type { Prisma } from "@prisma/client";
import { createPage } from "~/db/utils";
import { auth } from "~/lib/auth";
import db from "~/db";

export async function getRathers(data: SearchOutput) {
  const session = await auth();

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
          name: true,
        },
      },
      choices: {
        orderBy: { id: "asc" },
        select: {
          id: true,
          body: true,
          vote_count: true,
          ...(session?.user?.id && {
            votes: {
              where: {
                userId: session.user.id,
              },
              select: {
                choiceId: true,
              },
            },
          }),
        },
      },
      votes: {
        take: 3,
        orderBy: { createdAt: "desc" },
        select: {
          user: {
            select: {
              image: true,
              name: true,
            },
          },
        },
      },
    },
  });

  const viewer = {
    id: session?.user?.id ?? null,
    username: session?.user?.username ?? null,
    image: session?.user?.image ?? null,
    name: session?.user?.name ?? null,
    isGuest: !session?.user,
  };

  return {
    ...createPage({
      initialPage: !cursor,
      lastItemId: rathers[rathers.length - 1]?.id,
      firstItemId: rathers[0]?.id,
      totalItems: rathers.length,
      itemsPerPage: data.limit,
    }),
    results: rathers.map((result) => {
      const votes = result.choices.reduce((a, b) => a + b.vote_count, 0);
      let voted = false;

      const isOwner = Boolean(
        result.author && viewer.id && result.author.id === viewer.id,
      );

      return {
        ...result,
        votes: result.votes.map((v) => ({
          image: v.user.image,
          name: v.user.name,
        })),
        total: { votes },
        choices: result.choices.map((choice) => {
          const picked = (choice.votes ?? []).length === 1;
          voted ||= picked;

          return {
            id: choice.id,
            body: choice.body,
            percentage: !votes ? 0 : choice.vote_count / votes,
            total: { votes: choice.vote_count },
            viewer: {
              isGuest: viewer.isGuest,
              id: viewer.id,
              voted: picked,
              image: viewer.image,
              name: viewer.name,
            },
          };
        }),
        viewer: {
          voted,
          ...viewer,
          isOwner,
        },
      };
    }),
  };
}
