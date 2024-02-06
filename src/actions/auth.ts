"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lucia } from "~/lib/auth";
import { logger } from "~/lib/logger";
import { getSession } from "./utils";

export async function logout() {
  const result = await getSession().catch((e) => {
    logger.error(e, "Failed to get session");
    return null;
  });

  if (!result?.session) {
    return {
      data: null,
      error: {
        message: "Unauthenticated",
      },
    };
  }

  try {
    await lucia.invalidateSession(result.session.id);
  } catch (error) {
    logger.error(error, "Failed to delete session record");
  }

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  redirect("/");
}

export async function deleteSessions() {
  const result = await getSession().catch((e) => {
    logger.error(e, "Failed to getSession");
    return null;
  });

  if (!result?.user?.id) {
    return {
      data: null,
      error: {
        message: "Unauthenticated",
      },
    };
  }

  try {
    await lucia.invalidateUserSessions(result.user.id);
  } catch (error) {
    logger.error(error, "Failed to delete sessions");
    return {
      data: null,
      error: {
        message: "Failed to delete sessions",
      },
    };
  }

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  redirect("/");
}

export async function deleteExpiredSessions() {
  await lucia.deleteExpiredSessions();
}
