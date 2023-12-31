"use server";

import { isInvalidProvider, type Provider } from "~/lib/auth/utils";
import { auth, signIn, signOut } from "~/lib/auth";

export async function login(formData: FormData) {
  const provider = formData.get("provider") as Provider;

  if (isInvalidProvider(provider)) {
    return "INVALID_PROVIDER";
  }

  const session = await auth();
  if (session?.user?.id) {
    return "EXISTING_SESSION";
  }

  await signIn(provider);
}

export async function logout() {
  const session = await auth();

  if (!session?.user?.id) {
    return "MISSING_SESSION";
  }

  await signOut();
}
