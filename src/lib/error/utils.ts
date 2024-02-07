import { OAuthError } from "./auth";
import { KnownError } from "./known";

export function isOAuthError(error: unknown): error is OAuthError {
  return error instanceof OAuthError;
}

export function isKnownError(error: unknown): error is KnownError {
  return error instanceof KnownError;
}
