import "server-only";

import { getProfileByUsername } from "~/db/user/get-profile-by-username";
import { getRather as findRather } from "~/db/rather/get-rather";
import { StrippedUsername } from "~/lib/validate/user";
import { notFound, redirect } from "next/navigation";
import { getEmail } from "~/db/user/get-email";
import { NumberSchema } from "~/lib/validate";
import { links } from "~/lib/links";
import { safeParse } from "valibot";
import { auth } from "~/lib/auth";
import { cache } from "react";

export const getSession = cache(() => auth());

export type TRather = Awaited<ReturnType<typeof getRather>>;
export const getRather = cache(async (number: string | undefined) => {
  const parsed = safeParse(NumberSchema, { number });
  if (!parsed.success) {
    return notFound();
  }

  const response = await findRather(parsed.output).catch((e) => null);
  if (!response) {
    return notFound();
  }

  return response;
});

export const getProfile = cache(async (username: string) => {
  const atSignUsername = decodeURIComponent(username);
  const validated = safeParse(StrippedUsername, atSignUsername);

  if (!validated.success) {
    return notFound();
  }

  const [profile, session] = await Promise.all([
    getProfileByUsername(validated.output),
    getSession(),
  ]);

  if (!profile) {
    return notFound();
  }

  const owner = Boolean(
    session?.user && session.user.username === profile.username,
  );
  return { ...profile, owner };
});

export const isAuthenticated = cache(async () => {
  const session = await getSession();
  return Boolean(session?.user);
});

export const getAuthRoute = cache(async () => {
  const authenticated = await isAuthenticated();
  return authenticated ? links.logout : links.login;
});

export const getAuthProfile = cache(async () => {
  const session = await getSession();

  if (!session?.user?.username) {
    return redirect(links.login.href);
  }

  const profile = await getProfileByUsername(session.user.username);

  if (!profile) {
    return redirect(links.login.href);
  }

  return profile;
});

export const getAuthDetails = cache(async () => {
  const session = await getSession();

  if (!session?.user?.username) {
    return redirect(links.login.href);
  }

  const account = await getEmail(session.user.username);

  if (!account) {
    return redirect(links.login.href);
  }

  return account;
});
