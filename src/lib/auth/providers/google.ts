import { Google, generateCodeVerifier, type GoogleTokens } from "arctic";
import {
  getRedirectURI,
  getStoredCodeVerifier,
  setCodeVerifierCookie,
  type Profile,
} from "~/lib/auth/utils";
import { OAuthError } from "~/lib/error/auth";
import { fetcher, getAvatarUrl } from "~/lib/utils";

type GoogleProfile = {
  sub: string;
  name: string;
  picture: string;
  email: string;
  email_verified: boolean;
};

const google = new Google(
  process.env.AUTH_GOOGLE_ID,
  process.env.AUTH_GOOGLE_SECRET,
  getRedirectURI("google"),
);

export async function getGoogleProfile(tokens: GoogleTokens): Promise<Profile> {
  const profile: GoogleProfile = await fetcher(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    },
  );

  const image = getAvatarUrl(profile.picture).url;

  return {
    id: profile.sub,
    name: profile.name,
    username: profile.email,
    email: profile.email,
    emailVerified: profile.email_verified,
    image,
  };
}

export async function createGoogleAuthorizationURL(state: string) {
  const codeVerifier = generateCodeVerifier();
  const googleAuthorizationURL = await google.createAuthorizationURL(
    state,
    codeVerifier,
    {
      scopes: ["profile", "email"],
    },
  );

  setCodeVerifierCookie(codeVerifier, "google");
  return googleAuthorizationURL;
}

export async function validateGoogleAuthorizationCode(code: string) {
  const codeVerifier = getStoredCodeVerifier("google");

  if (!codeVerifier) {
    throw new OAuthError("OAuthCallbackError", {
      provider: "google",
      message: "Missing 'code_verifier' cookie",
    });
  }

  return await google.validateAuthorizationCode(code, codeVerifier);
}
