import db from "~/db";

export async function getRecentUsers() {
  return db.user.findMany({
    take: 8,
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    select: {
      image: true,
      username: true,
      name: true,
      accentColor: true,
      biography: true,
    },
  });
}
