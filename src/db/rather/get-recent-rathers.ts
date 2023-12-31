import db from "~/db";

export async function getRecentRathers() {
  return db.rather.findMany({
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
      votes: {
        take: 3,
        orderBy: { createdAt: "desc" },
        select: {
          user: {
            select: {
              image: true,
              username: true,
            },
          },
        },
      },
    },
  });
}
