"use server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { safeParse } from "valibot";
import * as db from "~/db/user";
import {
  SearchSchema,
  UpdateUserSchema,
  type UpdateUserOutput,
} from "~/db/validations/user";
import { lucia } from "~/lib/auth";
import { logger } from "~/lib/logger";
import { getSession } from "./utils";

export async function deleteUser() {
  const session = await getSession();

  if (!session?.user?.id) {
    return {
      data: null,
      error: {
        message: "Unauthenticated",
      },
    };
  }

  const response = await db.deleteUser(session.user.id).catch((error) => {
    logger.error(error, "Failed to delete account");
    return null;
  });

  if (!response) {
    return {
      data: null,
      error: {
        message: "There was an error deleting your account",
      },
    };
  }

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  revalidatePath("/");
  redirect("/");
}

export async function updateUser(data: UpdateUserOutput) {
  const parse = safeParse(UpdateUserSchema, data);

  if (!parse.success) {
    return {
      data: null,
      error: {
        message: parse.issues[0].message,
      },
    };
  }

  const session = await getSession().catch((error) => {
    logger.error(error, "Failed to authenticate user");
    return null;
  });

  if (!session?.user?.id) {
    return {
      data: null,
      error: {
        message: "Unauthenticated",
      },
    };
  }

  try {
    const response = await db.updateUser(session.user, parse.output);

    if (!response) {
      return {
        data: null,
      };
    }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          data: null,
          error: {
            message: "Username already taken",
          },
        };
      }
    }

    const message = "Failed to update user";
    logger.error(error, message);
    return {
      data: null,
      error: {
        message,
      },
    };
  }

  revalidatePath("/");
  redirect("/settings/profile");
}

export async function findUsers(searchParams?: URLSearchParams) {
  const parse = safeParse(
    SearchSchema,
    Object.fromEntries(searchParams || new URLSearchParams()),
  );

  if (!parse.success) {
    return {
      data: null,
      error: {
        message: parse.issues[0].message,
      },
    };
  }

  const response = await db.getUsers(parse.output).catch((error) => {
    logger.error(error, "Failed to load users");
    return null;
  });

  if (!response) {
    return {
      data: null,
      error: {
        message: "Failed to load users",
      },
    };
  }

  return { data: response.data };
}
