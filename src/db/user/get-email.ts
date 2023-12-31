import db from "~/db";

export async function getEmail(username: string) {
  return db.user.findUnique({
    where: { username },
    select: {
      email: true,
      emailVerified: true,
    },
  });
}
