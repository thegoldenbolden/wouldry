import db from "~/db";

export async function getProfileByUsername(username: string) {
  const response = await db.user.findUnique({
    where: { username, isDeleted: false },
    select: {
      biography: true,
      image: true,
      username: true,
      name: true,
      accentColor: true,
    },
  });

  if (!response) {
    return null;
  }

  return response;
}
