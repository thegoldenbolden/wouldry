import { Discord, type DiscordTokens } from "arctic";
import { getRedirectURI, type Profile } from "~/lib/auth/utils";
import { fetcher, getRandomAvatar } from "~/lib/utils";

type DiscordProfile = {
  id: string;
  username: string;
  avatar: string;
  accent_color: string;
  global_name: string;
  email: string;
  verified: boolean;
};

const discord = new Discord(
  process.env.AUTH_DISCORD_ID,
  process.env.AUTH_DISCORD_SECRET,
  getRedirectURI("discord"),
);

function getImageFormat(hash: string) {
  return hash.startsWith("a_") ? "gif" : "png";
}

function getDiscordAvatarURL(userId: string, avatarHash: string | null) {
  if (avatarHash === null) {
    return null;
  }

  const format = getImageFormat(avatarHash);
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${format}`;
}

export async function getDiscordProfile(
  tokens: DiscordTokens,
): Promise<Profile> {
  const profile: DiscordProfile = await fetcher(
    "https://discord.com/api/users/@me",
    {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    },
  );

  let image = getDiscordAvatarURL(profile.id, profile.avatar);

  if (!image) {
    image = getRandomAvatar().url;
  }

  return {
    id: profile.id,
    username: profile.username,
    name: profile.global_name,
    email: profile.email,
    emailVerified: profile.verified,
    image,
  };
}

export async function createDiscordAuthorizationURL(state: string) {
  return await discord.createAuthorizationURL(state, {
    scopes: ["identify"],
  });
}

export async function validateDiscordAuthorizationCode(code: string) {
  return await discord.validateAuthorizationCode(code);
}
