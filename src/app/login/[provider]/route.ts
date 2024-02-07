import { generateState } from "arctic";
import {
  createAuthorizationURL,
  setCallbackURL,
  setOAuthStateCookie,
  type RouteSegment,
} from "~/lib/auth/utils";
import { isOAuthError } from "~/lib/error/utils";
import { logger } from "~/lib/logger";

export async function GET(
  request: Request,
  { params }: RouteSegment,
): Promise<Response> {
  const state = generateState();

  try {
    const url = await createAuthorizationURL(state, params.provider);
    setOAuthStateCookie(state, params.provider);

    const searchParams = new URLSearchParams(request.url);
    const callbackURL = searchParams.get("callback_url");
    setCallbackURL(callbackURL);

    return Response.redirect(url);
  } catch (error) {
    logger.error(error, "Failed to create authorization url");
    const searchParams = new URLSearchParams();
    searchParams.set("error", "OAuthError");

    if (isOAuthError(error)) {
      searchParams.set("error", error.name);
    }

    return Response.redirect(`/login?${error}`);
  }
}
