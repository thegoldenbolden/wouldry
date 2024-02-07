import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "~/components/error-boundary";
import { Footer } from "~/components/footer";
import { PollForm } from "~/components/poll/create";
import { getUser } from "~/lib/cache/react";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  title: "Create",
  description: "Create would you rather questions",
  alternates: {
    canonical: links.create.href,
  },
};

export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect(links.login.href);
  }

  return (
    <div className="flex flex-col gap-6 px-3 py-10">
      <main className="mx-auto w-full max-w-xl bg-background">
        <h1 className="mb-6 rounded-md p-2 font-chillax text-lg font-semibold capitalize leading-none">
          Create a Poll
        </h1>
        <ErrorBoundary>
          <PollForm />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
