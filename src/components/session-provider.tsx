"use client";

import { SessionProvider as AuthProvider } from "next-auth/react";

export function SessionProvider(props: React.PropsWithChildren) {
  return <AuthProvider>{props.children}</AuthProvider>;
}
