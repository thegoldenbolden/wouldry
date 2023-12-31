import db from "~/db";

export async function deleteUser(id: string) {
  // PlanetScale does not support foreign key constraints.
  // https://planetscale.com/docs/learn/operating-without-foreign-key-constraints

  await db.user.update({
    where: { id },
    data: {
      comments: {
        set: [],
      },
      rathers: {
        set: [],
      },
    },
  });

  return db.user.delete({
    where: { id },
    select: { username: true },
  });
}
