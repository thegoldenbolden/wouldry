import "server-only";

import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { safeParse } from "valibot";
import { getPoll as findPoll } from "~/db/poll";
import { getEmail, getProfileByUsername } from "~/db/user";
import { NumberSchema } from "~/db/validations";
import { StrippedAtSignUsername } from "~/db/validations/user";
import { lucia } from "~/lib/auth";
import { links } from "~/lib/links";

export const getUser = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return null;
  }

  const { user } = await lucia.validateSession(sessionId);
  return user;
});

export type TPoll = Awaited<ReturnType<typeof getPoll>>;
export const getPoll = cache(async (number: string | undefined) => {
  const parsed = safeParse(NumberSchema, { number });
  if (!parsed.success) {
    notFound();
  }

  const response = await findPoll(parsed.output);

  if (!response?.data) {
    notFound();
  }

  return response.data;
});

export const getProfile = cache(async (username: string) => {
  const atSignUsername = decodeURIComponent(username);
  const validated = safeParse(StrippedAtSignUsername, atSignUsername);

  if (!validated.success) {
    notFound();
  }

  const [profile, user] = await Promise.all([
    getProfileByUsername(validated.output),
    getUser(),
  ]);

  if (!profile.data) {
    notFound();
  }
  const owner = Boolean(
    user?.username && user.username === profile.data.user.username,
  );

  return {
    ...profile.data.user,
    owner,
  };
});

export const isAuthenticated = cache(async () => {
  return Boolean(await getUser());
});

export const getAuthRoute = cache(async () => {
  const authenticated = await isAuthenticated();
  return authenticated ? links.logout : links.login;
});

export const getAuthProfile = cache(async () => {
  const user = await getUser();

  if (!user?.username) {
    redirect(links.login.href);
  }

  const profile = await getProfileByUsername(user.username);

  if (!profile.data) {
    redirect(links.login.href);
  }

  return profile.data;
});

export const getAuthDetails = cache(async () => {
  const user = await getUser();

  if (!user?.username) {
    redirect(links.login.href);
  }

  const account = await getEmail(user.username);

  if (!account?.data?.user) {
    redirect(links.login.href);
  }

  return account.data.user;
});
