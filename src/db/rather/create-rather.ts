import type { CreateRatherOutput, SlugOutput } from "~/lib/validate/rather";
import { createId } from "~/db/utils";
import db from "~/db";

export async function createRather(
  userId: string,
  data: CreateRatherOutput & SlugOutput,
) {
  const idConfig: Parameters<typeof createId>[0] = {
    lowercase: true,
    uppercase: true,
    numbers: true,
    size: 18,
  };

  return await db.rather.create({
    data: {
      id: createId(idConfig),
      title: data.title,
      slug: data.slug,
      description: data.description,
      commentsEnabled: data.enable_comments,
      author: {
        connect: {
          id: userId,
        },
      },
      choices: {
        createMany: {
          data: [
            {
              id: createId(idConfig),
              body: data.choice_one,
            },
            {
              id: createId(idConfig),
              body: data.choice_two,
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
}
