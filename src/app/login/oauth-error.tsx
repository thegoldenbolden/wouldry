"use client";

import { useSearchParams } from "next/navigation";
import type { Provider } from "~/lib/auth/utils";

export function OAuthErrorMessage({ providers }: { providers: Provider[] }) {
  const searchParams = useSearchParams();

  const error = searchParams.get("error");

  if (!error) {
    return null;
  }

  const provider = searchParams.get("provider");

  if (provider && providers.some((p) => p === provider)) {
    return (
      <p className="w-full px-2 py-0.5 text-sm font-medium text-error">
        Please sign in with the provider you initially signed in with:&nbsp;
        <span className="rounded-md bg-background px-1 text-sm font-medium capitalize text-foreground">
          {provider}
        </span>
      </p>
    );
  }

  return (
    <p className="w-full px-2 py-0.5 text-sm font-medium text-error">
      There was an error signing in
    </p>
  );
}
