import { Twitch, type TwitchTokens } from "arctic";
import { getRedirectURI, type Profile } from "~/lib/auth/utils";
import { OAuthError } from "~/lib/error/auth";
import { fetcher, getAvatarUrl } from "~/lib/utils";

type TwitchProfile = {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
  email: string;
};

const twitch = new Twitch(
  process.env.AUTH_TWITCH_ID,
  process.env.AUTH_TWITCH_SECRET,
  getRedirectURI("twitch"),
);

export async function getTwitchProfile(tokens: TwitchTokens): Promise<Profile> {
  const response = await fetcher("https://api.twitch.tv/helix/users", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
      "Client-Id": process.env.AUTH_TWITCH_ID,
    },
  });

  const data: TwitchProfile[] = await response.data;
  const profile = data.at(0);

  if (!profile) {
    throw new OAuthError("OAuthProfileError", {
      provider: "twitch",
      message: "Failed to get profile",
    });
  }

  const image = getAvatarUrl(profile.profile_image_url).url;

  return {
    id: profile.id,
    username: profile.login,
    name: profile.display_name,
    email: profile.email,
    emailVerified: false,
    image,
  };
}

export async function createTwitchAuthorizationUrl(state: string) {
  return await twitch.createAuthorizationURL(state, {
    scopes: ["user:read:email"],
  });
}

export async function validateTwitchAuthorizationCode(code: string) {
  return await twitch.validateAuthorizationCode(code);
}
