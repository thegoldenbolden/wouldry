"use server";

import { getProfileByUsername as getProfile } from "~/db/user/get-profile-by-username";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { deleteUser as destroy } from "~/db/user/delete-user";
import { updateUser as update } from "~/db/user/update-user";
import { getUsers } from "~/db/user/get-users";
import { revalidate } from "~/lib/cache/next";
import { getSession } from "~/lib/auth/utils";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { safeParse } from "valibot";

import {
  type ProfileOutput,
  ProfileSchema,
  SearchSchema,
} from "~/lib/validate/user";

export async function deleteUser() {
  const session = await getSession();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await destroy(session?.user?.id);

    if (process.env.NODE_ENV === "production") {
      cookies().delete(`__Host-authjs.session-token`);
      cookies().delete(`__Secure-authjs.callback-url`);
      cookies().delete(`__Secure-authjs.csrf-token`);
    }
  } catch (error) {
    console.error(error);
    return { error: "There was an error deleting your account" };
  }

  revalidate("recent-users");
  revalidate("recent-rathers");
  redirect("/");
}

export async function updateUser(data: ProfileOutput) {
  const parse = safeParse(ProfileSchema, data);

  if (!parse.success) {
    return {
      error: parse.issues[0].message,
    };
  }

  const session = await getSession();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await update(session.user, parse.output);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { error: "Username already taken" };
      }
    }

    console.error(error);
    return { error: "There was an error updating your profile" };
  }

  revalidate("recent-users");
  redirect("/settings/profile");
}

export async function getProfileByUsername(data: string) {
  const parse = safeParse(ProfileSchema.entries.username, data);

  if (!parse.success) {
    return {
      error: parse.issues[0].message,
    };
  }

  try {
    const user = await getProfile(parse.output);
    return { ...user };
  } catch (error) {
    console.error(error);
    return { error: "An unexpected error happened" };
  }
}

export async function search(searchParams: URLSearchParams) {
  const parse = safeParse(SearchSchema, Object.fromEntries(searchParams));

  if (!parse.success) {
    return {
      error: parse.issues[0].message,
    };
  }

  try {
    const users = await getUsers(parse.output);
    return { ...users };
  } catch (error) {
    console.error(error);
    return { error: "Something unexpected occurred" };
  }
}
