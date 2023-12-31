import "server-only";

import { CustomError } from "~/lib/error";
import type { Session } from "next-auth";
import { auth } from "~/lib/auth";

import { fetcher, decimalToHex, getRandomColor } from "~/lib/utils";

export async function getTwitchChatColor(userId: string, bearerToken?: string) {
  let color = decimalToHex(getRandomColor());

  if (!bearerToken) {
    return color;
  }

  const colorURL = "https://api.twitch.tv/helix/chat/color";
  const url = new URL(colorURL);
  url.searchParams.set("user_id", userId);

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${bearerToken}`);
  headers.set("Client-Id", process.env.AUTH_TWITCH_ID);

  try {
    const response = await fetcher(url.href, { headers });

    if (response.status !== 200) {
      throw response;
    }

    const res = await response.json();
    color = res.data?.[0]?.color || color;
  } catch (error) {
    console.error(error);
  }

  return color;
}

const getImageFormat = (hash: string) => {
  return hash.startsWith("a_") ? "gif" : "png";
};

export function getDiscordAvatarUrl(userId: string, avatarHash: string | null) {
  if (avatarHash === null) {
    return null;
  }

  const format = getImageFormat(avatarHash);
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${format}`;
}

type Callback<T> = (user: NonNullable<Session["user"]>) => T;
export async function withUser<T = unknown>(cb: Callback<T>) {
  const session = await auth();

  if (!session?.user) {
    throw new CustomError(403);
  }

  return cb(session.user);
}

export const providers = ["discord", "twitch", "google"];
export type Provider = (typeof providers)[number];

export function isInvalidProvider(provider?: Provider) {
  return !provider || !providers.includes(provider);
}

export async function getSession() {
  try {
    return await auth();
  } catch (error) {
    console.error(error);
    return null;
  }
}
