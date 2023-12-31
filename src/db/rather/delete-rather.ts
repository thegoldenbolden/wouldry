import type { IdOutput } from "~/lib/validate";
import db from "~/db";

export async function deleteRather(authorId: string, data: IdOutput) {
  return await db.rather.delete({
    where: { id: data.id, authorId },
    select: { title: true },
  });
}
