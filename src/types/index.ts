export type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

type RouteParams<T extends string> = { params: Record<T, string> };
export type ProviderRoute = RouteParams<"provider">;
export type UsernameRoute = RouteParams<"username">;
export type NumberRoute = RouteParams<"number">;
export type IdRoute = RouteParams<"id">;

export type ApiResponse<T> = {
  before: string | null;
  after: string | null;
  results: T[];
};
