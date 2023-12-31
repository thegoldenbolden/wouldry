import type { ProfileOutput } from "~/lib/validate/user";
import type { Session } from "next-auth/types";
import db from "~/db";

export async function updateUser(user: Session["user"], data: ProfileOutput) {
  return await db.user.update({
    where: { id: user.id },
    data: {
      biography: data.biography,
      name: data.display_name,
      ...(data.username?.toLowerCase() !== user.username?.toLowerCase() && {
        username: data.username,
      }),
    },
  });
}
